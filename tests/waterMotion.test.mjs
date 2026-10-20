import assert from "node:assert/strict";
import { test } from "node:test";
import { createRequire } from "node:module";
import { build } from "esbuild";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createWaterSurface, waterMesh, waterPointer, waterSize } from "../src/components/waterMotion.js";

test("pixel budget, mobile resolution and finite pointer projection", () => {
  for (const [w,h] of [[1195,1045],[1440,1000],[390,844],[320,568],[3840,2160]]) {
    const [width,height] = waterSize(w,h,3);
    assert.ok(width * height <= 1200000);
    assert.ok(width <= w * (w < 700 ? .9 : 1.25));
    for (const x of [0,.5,1]) for (const y of [0,.5,1]) assert.ok(waterPointer(x,y,w/h).every(Number.isFinite));
  }
});

test("water plane fits 16-bit indices and uses fewer vertices on mobile", () => {
  const desktop = waterMesh();
  const mobile = waterMesh(80,96);
  assert.equal(desktop.vertices.length / 2, 193 * 193);
  assert.equal(desktop.indices.length, 192 * 192 * 6);
  assert.ok(mobile.vertices.length < desktop.vertices.length);
  for (const mesh of [desktop,mobile]) {
    assert.ok(mesh.vertices.every(Number.isFinite));
    assert.ok(mesh.indices.every(i => i < mesh.vertices.length / 2));
  }
});

test("pause, visibility, pointer input, context recovery and complete cleanup", () => {
  const pending = new Map(), listeners = new Map(), canvasEvents = new Map(), uniforms = new Map();
  let id = 0, draws = 0, disconnected = false, prevented = false, deleted = 0;
  const gl = {
    createProgram: () => ({}), createShader: () => ({}), createBuffer: () => ({}), createTexture: () => ({}), createFramebuffer: () => ({}),
    shaderSource() {}, compileShader() {}, attachShader() {}, bindAttribLocation() {}, linkProgram() {}, deleteShader() {},
    getProgramParameter: () => true, useProgram() {}, bindBuffer() {}, bufferData() {}, enableVertexAttribArray() {}, vertexAttribPointer() {},
    getUniformLocation: (_,name) => name, clearColor() {}, clear() {}, viewport() {},
    bindTexture() {}, texParameteri() {}, texImage2D() {}, bindFramebuffer() {}, framebufferTexture2D() {}, activeTexture() {}, uniform1i() {}, drawArrays() {},
    uniform1f(name,...values) { uniforms.set(name, values); }, uniform2f() {},
    uniform3f(name,...values) { uniforms.set(name, values); }, uniform4f(name,...values) { uniforms.set(name, values); },
    drawElements() { draws++; }, deleteBuffer() { deleted++; }, deleteProgram() { deleted++; }, deleteTexture() { deleted++; }, deleteFramebuffer() { deleted++; },
  };
  globalThis.window = { devicePixelRatio: 2, requestAnimationFrame(callback) { pending.set(++id,callback); return id; }, cancelAnimationFrame(key) { pending.delete(key); } };
  globalThis.document = { hidden: false, addEventListener: (name,callback) => listeners.set(name,callback), removeEventListener: name => listeners.delete(name) };
  globalThis.ResizeObserver = class { observe() {} disconnect() { disconnected = true; } };
  const canvas = {
    getContext: () => gl, getBoundingClientRect: () => ({ left:310,top:0,width:1195,height:1045 }),
    addEventListener: (name,callback) => canvasEvents.set(name,callback), removeEventListener: name => canvasEvents.delete(name),
  };
  const status = [];
  const water = createWaterSurface(canvas, ready => status.push(ready));
  assert.equal(draws,1);
  assert.equal(pending.size,0); // Reduced motion never has to start a frame loop.
  const tick = now => { const [key,callback] = pending.entries().next().value; pending.delete(key); callback(now); };
  water.setPaused(false); tick(0); tick(40);
  assert.ok(uniforms.get("u_time")[0] > 0);
  canvasEvents.get("pointerdown")({clientX:900,clientY:500,pointerType:"touch"});
  tick(80);
  assert.equal(uniforms.get("u_ripple")[3],1);
  assert.ok(uniforms.get("u_pointer")[2] > 0);
  canvasEvents.get("pointerup")({pointerType:"touch"});
  water.setPaused(true);
  assert.equal(pending.size,0);
  const frozenTime = uniforms.get("u_time")[0];
  water.setPaused(false);
  document.hidden = true; listeners.get("visibilitychange")();
  assert.equal(pending.size,0);
  document.hidden = false; listeners.get("visibilitychange")(); tick(50000);
  assert.equal(uniforms.get("u_time")[0],frozenTime);
  canvasEvents.get("webglcontextlost")({preventDefault() { prevented = true; }});
  assert.equal(prevented,true);
  assert.equal(pending.size,0);
  assert.equal(status.at(-1),false);
  canvasEvents.get("webglcontextrestored")();
  assert.equal(status.at(-1),true);
  water.destroy();
  assert.equal(pending.size,0);
  assert.equal(canvasEvents.size,0);
  assert.equal(listeners.size,0);
  assert.equal(disconnected,true);
  assert.equal(deleted,7);
  assert.equal(createWaterSurface({getContext: () => null}),null);
  delete globalThis.window; delete globalThis.document; delete globalThis.ResizeObserver;
});

test("reduced motion and saved pause initialize a non-animated, image-free home", async () => {
  const bundled = await build({ entryPoints:["src/components/HomeGraphic.jsx"],bundle:true,write:false,platform:"node",format:"cjs",jsx:"automatic",external:["react","react/jsx-runtime"] });
  const module = {exports:{}};
  new Function("require","module","exports",bundled.outputFiles[0].text)(createRequire(import.meta.url),module,module.exports);
  for (const [reduced,paused,mode] of [[true,false,"reduced"],[false,true,"paused"],[false,false,"running"]]) {
    globalThis.window = {matchMedia: () => ({matches:reduced}),localStorage:{getItem: () => String(paused)}};
    const html = renderToStaticMarkup(React.createElement(module.exports.default));
    assert.ok(html.includes(`data-motion="${mode}"`));
    assert.ok(html.includes("<canvas"));
    assert.ok(!html.includes("<img") && !html.includes("<video") && !html.includes("home-frame"));
    if (reduced) assert.ok(!html.includes("<button"));
  }
  delete globalThis.window;
});
