# Portfolio Project

## Deployment
- Vercel에 연결되어 있으며 `main` 브랜치 푸시 시 도메인에 자동 배포됨
- 모든 변경 사항은 작업 완료 후 `main`에 바로 머지하여 즉시 반영

## Section ordering convention
- 각 섹션(`AI_WORKS`, `FILMS` 등)에 새 항목을 추가할 때 사용자가 위치를 명시하지 않으면 **항상 가장 첫 번째(맨 앞)에 추가**한다
- `AI_WORKS`는 `id` 내림차순으로 정렬되므로(`AI_WORKS_NEWEST_FIRST`), 새 항목은 기존 최댓값보다 큰 id를 사용해 첫 번째 위치를 보장한다
- 미디어 파일은 `public/ai/ai-XX.mp4` 형식의 다음 번호로 명명한다
