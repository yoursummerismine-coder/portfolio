# Portfolio 코드 분석 리포트

## 1) 전체 구조 요약
- 스택: React 18 + Vite 6 기반의 단일 페이지 포트폴리오 앱.
- 엔트리 포인트는 `src/main.jsx`, 주요 화면/로직은 사실상 `src/App.jsx` 한 파일에 집중.
- 정적 에셋(이미지/영상)은 `public/`에 위치하며, 코드에서 절대 경로(`/...`)로 참조.

## 2) 잘된 점
- **브랜딩 일관성**: 색상/타이포 토큰을 CSS 변수(`:root`)로 통일해 시각 톤이 안정적.
- **경험 중심 UX**: Hero 크로스페이드, 섹션 페이드인, 갤러리 라이트박스 등 체감 품질이 좋음.
- **콘텐츠 구조화**: `FILMS`, `AI_WORKS` 데이터 배열 기반 렌더링으로 확장성이 있음.
- **기본 성능 배려**: Hero 이미지 전환 시 단순 배경 교체 방식으로 구현 복잡도를 낮춤.

## 3) 핵심 리스크/개선 우선순위

### P0 (먼저 대응 권장)
1. **접근성(A11y) 미흡**
   - 클릭 가능한 `div`가 다수 존재(키보드 포커스/역할 미정의).
   - 라이트박스 이미지/비디오 `alt` 값이 빈 문자열이며, 닫기/이동 버튼의 접근성 라벨 부재.
   - 링크에 `target="_blank"`를 추가할 경우를 대비한 `rel="noopener noreferrer"` 정책도 정리 필요.

2. **단일 파일 과대화(유지보수성 저하)**
   - `App.jsx`가 데이터/스타일/뷰/인터랙션을 전부 포함하는 모놀리식 구조.
   - 컴포넌트 분리 및 데이터 분리 없이는 수정 시 회귀 위험 증가.

### P1 (가까운 스프린트에서 권장)
3. **스타일 관리 방식 한계**
   - 대부분 인라인 스타일이라 재사용/테마/반응형 유지보수가 어려움.
   - hover 스타일을 JS 이벤트(`onMouseEnter/Leave`)로 직접 수정하는 패턴이 반복됨.

4. **상태/이펙트의 미세한 비효율**
   - Hero 전환 `useEffect`가 `currentImg` 의존으로 매 전환마다 interval 재생성.
   - 작은 앱에선 문제 없지만 패턴상 타이머 누수/동작 불안정 가능성에 취약.

5. **SEO/메타 정보 부재**
   - 포트폴리오 특성상 SNS 공유/검색 노출이 중요하나 meta/og/twitter 설정이 없음.

### P2 (품질 고도화 단계)
6. **미디어 최적화 여지**
   - 영상 자동재생(모바일 데이터/저전력 고려 필요).
   - 이미지 포맷(WebP/AVIF), lazy loading, `preload`/`prefetch` 전략 검토 가능.

## 4) 구체 개선 제안

### A. 파일 구조 개선
- `src/components/`로 분리:
  - `Nav.jsx`, `HeroSection.jsx`, `FilmCard.jsx`, `StillsGallery.jsx`, `AIWorkSection.jsx`, `Lightbox.jsx`, `AboutSection.jsx`, `ContactSection.jsx`
- `src/data/portfolioData.js`로 `FILMS`, `AI_WORKS` 분리.
- `src/styles/`에 전역 토큰 + 섹션별 CSS 모듈 또는 styled-system 도입.

### B. 접근성 개선
- 클릭 `div`를 `button` 또는 `a`로 변경하고 `aria-label` 부여.
- 라이트박스에 focus trap 및 `role="dialog" aria-modal="true"` 적용.
- 이미지 `alt`에 작품명/설명 반영.
- 키보드 탐색(탭 순서, ESC 닫기, 좌우 이동) 안내 문구 추가.

### C. 성능/안정성 개선
- Hero 슬라이드 타이머는 단일 interval + ref로 관리.
- 미디어 요소에 `loading="lazy"`, 영상에는 조건부 autoplay(사용자 환경 감지) 도입.
- 정적 에셋 최적화 파이프라인(압축/리사이즈) 정비.

### D. 콘텐츠/운영 개선
- `FILMS`, `AI_WORKS`를 CMS/JSON 연동 가능한 형태로 전환.
- 연락처 섹션에 복사 버튼/폼 도입 검토.
- 다국어(한/영) 토글 도입 시 국제 사용자 접근성 향상.

## 5) 빠른 체크리스트
- [ ] `App.jsx` 컴포넌트 분리
- [ ] 라이트박스 접근성(aria/dialog/focus trap)
- [ ] 인라인 스타일 축소 및 CSS 체계화
- [ ] SEO 메타(og/twitter/canonical) 추가
- [ ] 이미지/영상 최적화
- [ ] Lighthouse 측정(Perf/A11y/SEO)

## 6) 결론
현재 코드는 **시각 완성도와 포트폴리오 감성 전달력은 매우 우수**합니다. 다만, 실무 수준의 장기 운영 관점에서는 **접근성 + 구조 분리 + 성능 최적화**가 다음 단계의 핵심입니다. 이 3가지를 우선 정리하면 유지보수 비용을 낮추면서도 완성도를 더 끌어올릴 수 있습니다.
