const heightSource = `
precision highp float;
uniform vec2 u_resolution;
uniform float u_time;
uniform vec3 u_pointer;
uniform vec4 u_ripple;

float noise(vec2 p) {
  vec2 cell = floor(p), f = fract(p);
  f = f * f * (3. - 2. * f);
  vec2 seed = cell + vec2(17.17, 43.71);
  vec4 h = fract(sin(vec4(dot(seed, vec2(127.1, 311.7)), dot(seed + vec2(1.,0.), vec2(127.1,311.7)), dot(seed + vec2(0.,1.), vec2(127.1,311.7)), dot(seed + 1., vec2(127.1,311.7)))) * 43758.5453);
  return mix(mix(h.x, h.y, f.x), mix(h.z, h.w, f.x), f.y);
}

float folds(vec2 p) {
  float value = 0.;
  float amplitude = .5;
  for (int i = 0; i < 3; i++) {
    value += noise(p) * amplitude;
    p = p * 2.03 + vec2(4.7, 9.2);
    amplitude *= .48;
  }
  return value;
}

float heightAt(vec2 p) {
  float t = u_time;
  vec2 q = p + vec2(.4 * sin(p.y * 1.4 + t * .12), .65 * sin(p.x * 1.2 - t * .09));
  q.y -= q.x * .3;
  q += vec2(noise(q + t * .035), noise(q + vec2(8.3,-t * .03))) * .8;
  float grain = folds(q * vec2(1.1,2.8) + vec2(t * .025, -t * .045));
  float stream = q.y - .5 * sin(q.x * 1.7 + t * .09) + grain * .25 - .1 * sin(t * .13);
  float height = .36 * exp(-stream * stream * 2.2);
  height += .18 * exp(-pow((stream + 1.45) * 1.6, 2.));
  height -= .15 * exp(-pow((stream - 1.5) * 1.8, 2.));
  height += .025 * grain;
  if (u_pointer.z > .001) {
    float distance = length(p - u_pointer.xy);
    height += sin(distance * 11. - t * 2.8) * .035 * exp(-distance * 2.5) * u_pointer.z;
  }
  if (u_ripple.w > .001) {
    float rippleDistance = length(p - u_ripple.xy);
    float age = max(0., t - u_ripple.z);
    float front = exp(-pow((rippleDistance - age * .75) * 3., 2.));
    height += sin(rippleDistance * 19. - age * 9.) * .055 * front * exp(-age * 1.2) * u_ripple.w;
  }
  return height;
}`;

const vertexSource = `${heightSource}
attribute vec2 a_position;
varying vec3 v_normal;
varying vec3 v_world;
void main() {
  float e = .025;
  float h = heightAt(a_position * .65) * .7;
  float hx = heightAt((a_position + vec2(e,0.)) * .65) * .7;
  float hz = heightAt((a_position + vec2(0.,e)) * .65) * .7;
  v_normal = normalize(vec3((h - hx) / e, 1., (h - hz) / e));
  v_world = vec3(a_position.x, h, a_position.y);
  vec3 relative = v_world - vec3(0.,2.2,4.);
  float depth = dot(relative, vec3(0.,-.481919,-.876216));
  vec2 projected = vec2(relative.x / (u_resolution.x / u_resolution.y), dot(relative, vec3(0.,.876216,-.481919))) / .55;
  gl_Position = vec4(projected, 1.003339 * depth - .200334, depth);
}`;

const normalVertexSource = `
attribute vec2 a_position;
void main() { gl_Position = vec4(a_position, 0., 1.); }`;

const normalFragmentSource = `${heightSource}
void main() {
  vec2 world = vec2(-8.,-9.) + gl_FragCoord.xy / u_resolution * vec2(16.,15.);
  float e = .012;
  float h = heightAt(world * .65) * .7;
  float hx = heightAt((world + vec2(e,0.)) * .65) * .7;
  float hz = heightAt((world + vec2(0.,e)) * .65) * .7;
  vec3 normal = normalize(vec3((h - hx) / e, 1., (h - hz) / e));
  gl_FragColor = vec4(normal * .5 + .5, 1.);
}`;

export const fragmentSource = `
precision highp float;
uniform vec2 u_resolution;
uniform float u_time;
uniform sampler2D u_normals;
varying vec3 v_normal;
varying vec3 v_world;

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  vec3 eye = normalize(vec3(0.,2.2,4.) - v_world);
  float detail = 1. / (1. + length(v_world.xz) * .2);
  vec2 fine = vec2(sin(v_world.x * 4. + v_world.z * 17. - u_time * .65), sin(v_world.x * 9. - v_world.z * 13. + u_time * .42));
  vec2 normalUV = (v_world.xz - vec2(-8.,-9.)) / vec2(16.,15.);
  vec3 sampled = texture2D(u_normals, normalUV).xyz * 2. - 1.;
  float blend = (1. - smoothstep(7.,8.,abs(v_world.x))) * smoothstep(-10.,-8.,v_world.z) * (1. - smoothstep(5.,6.,v_world.z));
  vec3 normal = normalize(mix(v_normal, sampled, blend) + vec3(fine.x * .008, 0., fine.y * .012) * detail);
  vec3 reflection = reflect(-eye, normal);
  float band = exp(-pow((reflection.y + reflection.x * .22 - .4) * 17., 2.));
  float sheen = pow(max(dot(reflection, normalize(vec3(-.3, .4, -.8))), 0.), 24.);
  float broad = exp(-pow((reflection.y + reflection.x * .22 - .4) * 3., 2.));
  float light = band * .82 + sheen * .15 + broad * .025;
  vec2 edge = smoothstep(vec2(0.,.14), vec2(.06,.3), uv) * smoothstep(vec2(0.), vec2(.06,.16), 1. - uv);
  float vignette = 1. - .35 * smoothstep(.3, .9, length((uv - .5) * vec2(.8,1.)));
  vec3 base = vec3(20.,21.,20.) / 255.;
  vec3 silver = vec3(.73,.73,.70);
  gl_FragColor = vec4(mix(base, silver, light * edge.x * edge.y * vignette), 1.);
}`;

export function waterMesh(columns = 192, rows = 192) {
  const vertices = new Float32Array((columns + 1) * (rows + 1) * 2);
  const indices = new Uint16Array(columns * rows * 6);
  let v = 0, n = 0;
  for (let y = 0; y <= rows; y++) {
    for (let x = 0; x <= columns; x++) {
      vertices[v++] = -16 + x / columns * 32;
      vertices[v++] = -20 + y / rows * 25;
      if (x < columns && y < rows) {
        const i = y * (columns + 1) + x;
        indices.set([i, i + 1, i + columns + 1, i + 1, i + columns + 2, i + columns + 1], n);
        n += 6;
      }
    }
  }
  return { vertices, indices };
}

export function waterPointer(x, y, aspect) {
  const rayX = (x * 2 - 1) * aspect * .55;
  const rayY = -.481919 + (y * 2 - 1) * .876216 * .55;
  const rayZ = -.876216 - (y * 2 - 1) * .481919 * .55;
  const distance = -2.2 / Math.min(-.05, rayY);
  return [rayX * distance * .65, (4 + rayZ * distance) * .65];
}

export function waterSize(width, height, ratio = 1) {
  const scale = Math.min(ratio, width < 700 ? .9 : 1.25, 2048 / Math.max(1,width,height), Math.sqrt(1200000 / Math.max(1, width * height)));
  return [Math.max(1, Math.floor(width * scale)), Math.max(1, Math.floor(height * scale))];
}

export function createWaterSurface(canvas, onReady = () => {}) {
  const gl = canvas.getContext("webgl", { antialias: false, depth: false, stencil: false, preserveDrawingBuffer: false, powerPreference: "low-power" });
  if (!gl) { onReady(false); return null; }
  let resources;
  let paused = true;
  let lost = false;
  let disposed = false;
  let request = null;
  let previous = null;
  let time = 0;
  let lastInput = -10;
  const pointer = { x: .5, y: .5, strength: 0 };
  const target = { ...pointer };
  let ripple = { x: .5, y: .5, time: -10, strength: 0 };
  let bounds;

  function compileProgram(vertex, fragment) {
    const program = gl.createProgram();
    const shaders = [gl.VERTEX_SHADER, gl.FRAGMENT_SHADER].map((type, i) => {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, i ? fragment : vertex);
      gl.compileShader(shader);
      gl.attachShader(program, shader);
      return shader;
    });
    gl.bindAttribLocation(program, 0, "a_position");
    gl.linkProgram(program);
    shaders.forEach(shader => gl.deleteShader(shader));
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) { gl.deleteProgram(program); return null; }
    return program;
  }

  function setup() {
    const program = compileProgram(vertexSource, fragmentSource);
    if (!program) return false;
    const normalProgram = compileProgram(normalVertexSource, normalFragmentSource);
    if (!normalProgram) { gl.deleteProgram(program); return false; }
    gl.useProgram(program);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    const normalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,3,-1,-1,3]), gl.STATIC_DRAW);
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    const framebuffer = gl.createFramebuffer();
    const locations = p => Object.fromEntries(["resolution", "time", "pointer", "ripple", "normals"].map(key => [key, gl.getUniformLocation(p, `u_${key}`)]));
    resources = { program, normalProgram, buffer, normalBuffer, indexBuffer, texture, framebuffer, mobile: null, indexCount: 0, uniforms: locations(program), normalUniforms: locations(normalProgram) };
    gl.clearColor(20 / 255, 21 / 255, 20 / 255, 1);
    return true;
  }

  function render() {
    const r = resources;
    const uniforms = (program,u,width,height) => {
      gl.useProgram(program);
      gl.uniform2f(u.resolution, width, height);
      gl.uniform1f(u.time, time);
      gl.uniform3f(u.pointer, pointer.x, pointer.y, pointer.strength);
      gl.uniform4f(u.ripple, ripple.x, ripple.y, ripple.time, ripple.strength);
    };
    gl.bindFramebuffer(gl.FRAMEBUFFER, r.framebuffer);
    gl.viewport(0,0,r.normalSize,r.normalSize);
    uniforms(r.normalProgram,r.normalUniforms,r.normalSize,r.normalSize);
    gl.bindBuffer(gl.ARRAY_BUFFER,r.normalBuffer);
    gl.vertexAttribPointer(0,2,gl.FLOAT,false,0,0);
    gl.drawArrays(gl.TRIANGLES,0,3);
    gl.bindFramebuffer(gl.FRAMEBUFFER,null);
    gl.viewport(0,0,canvas.width,canvas.height);
    uniforms(r.program,r.uniforms,canvas.width,canvas.height);
    gl.bindBuffer(gl.ARRAY_BUFFER,r.buffer);
    gl.vertexAttribPointer(0,2,gl.FLOAT,false,0,0);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D,r.texture);
    gl.uniform1i(r.uniforms.normals,0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawElements(gl.TRIANGLES, r.indexCount, gl.UNSIGNED_SHORT, 0);
  }

  function resize() {
    bounds = canvas.getBoundingClientRect();
    [canvas.width, canvas.height] = waterSize(bounds.width, bounds.height, window.devicePixelRatio || 1);
    gl.viewport(0, 0, canvas.width, canvas.height);
    if (!lost && resources) {
      const mobile = bounds.width < 700;
      if (resources.mobile !== mobile) {
        const mesh = mobile ? waterMesh(80,96) : waterMesh();
        gl.bindBuffer(gl.ARRAY_BUFFER, resources.buffer);
        gl.bufferData(gl.ARRAY_BUFFER, mesh.vertices, gl.STATIC_DRAW);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, resources.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, mesh.indices, gl.STATIC_DRAW);
        resources.mobile = mobile;
        resources.indexCount = mesh.indices.length;
        resources.normalSize = mobile ? 256 : 512;
        gl.bindTexture(gl.TEXTURE_2D,resources.texture);
        gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,resources.normalSize,resources.normalSize,0,gl.RGBA,gl.UNSIGNED_BYTE,null);
        gl.bindFramebuffer(gl.FRAMEBUFFER,resources.framebuffer);
        gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,resources.texture,0);
        gl.bindFramebuffer(gl.FRAMEBUFFER,null);
      }
      render();
    }
  }

  function draw(now) {
    request = null;
    if (disposed || lost || paused || document.hidden) return;
    const interval = bounds.width < 700 || time - lastInput > 1 ? 1000 / 30 : 1000 / 60;
    if (previous === null || now - previous >= interval - .5) {
      const dt = previous === null ? 0 : Math.min((now - previous) / 1000, .08);
      previous = now;
      time += dt;
      if (time - ripple.time > 4) ripple.strength = 0;
      const follow = 1 - Math.exp(-dt * 6);
      pointer.x += (target.x - pointer.x) * follow;
      pointer.y += (target.y - pointer.y) * follow;
      pointer.strength += ((time - lastInput < 1.5 ? target.strength : 0) - pointer.strength) * follow;
      render();
    }
    request = window.requestAnimationFrame(draw);
  }

  function sync() {
    if (request !== null) window.cancelAnimationFrame(request);
    request = null;
    previous = null;
    if (!paused && !lost && !disposed && !document.hidden) request = window.requestAnimationFrame(draw);
  }

  function move(event) {
    if (paused) return;
    [target.x, target.y] = waterPointer((event.clientX - bounds.left) / Math.max(1, bounds.width), 1 - (event.clientY - bounds.top) / Math.max(1, bounds.height), bounds.width / Math.max(1, bounds.height));
    target.strength = 1;
    lastInput = time;
  }
  function leave() { target.strength = 0; }
  function press(event) {
    if (paused) return;
    move(event);
    ripple = { x: target.x, y: target.y, time, strength: 1 };
  }
  function release(event) { if (event.pointerType !== "mouse") leave(); }
  function contextLost(event) { event.preventDefault(); lost = true; sync(); onReady(false); }
  function contextRestored() {
    lost = !setup();
    if (!lost) resize();
    onReady(!lost);
    sync();
  }

  if (!setup()) { onReady(false); return null; }
  resize();
  onReady(true);
  canvas.addEventListener("pointermove", move, { passive: true });
  canvas.addEventListener("pointerdown", press, { passive: true });
  canvas.addEventListener("pointerleave", leave);
  canvas.addEventListener("pointerup", release);
  canvas.addEventListener("pointercancel", leave);
  canvas.addEventListener("webglcontextlost", contextLost);
  canvas.addEventListener("webglcontextrestored", contextRestored);
  document.addEventListener("visibilitychange", sync);
  const observer = new ResizeObserver(resize);
  observer.observe(canvas);

  return {
    setPaused(value) { paused = value; if (value) leave(); sync(); },
    destroy() {
      disposed = true;
      sync();
      observer.disconnect();
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerdown", press);
      canvas.removeEventListener("pointerleave", leave);
      canvas.removeEventListener("pointerup", release);
      canvas.removeEventListener("pointercancel", leave);
      canvas.removeEventListener("webglcontextlost", contextLost);
      canvas.removeEventListener("webglcontextrestored", contextRestored);
      document.removeEventListener("visibilitychange", sync);
      if (resources) {
        gl.deleteBuffer(resources.buffer); gl.deleteBuffer(resources.indexBuffer); gl.deleteBuffer(resources.normalBuffer);
        gl.deleteTexture(resources.texture); gl.deleteFramebuffer(resources.framebuffer);
        gl.deleteProgram(resources.program); gl.deleteProgram(resources.normalProgram);
      }
    },
  };
}
