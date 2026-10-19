# 기존 메인페이지 보존형 수담 소개 서브페이지

이 패키지는 기존 메인페이지를 **절대 덮어쓰지 않습니다**.

## 적용
1. ZIP을 압축 해제합니다.
2. 기존 GitHub 저장소의 최상위 폴더에 `about/` 폴더만 업로드합니다.
3. 기존 `index.html`, `styles.css`, `script.js`는 수정하거나 삭제하지 않습니다.
4. 기존 메인페이지의 수담 소개 메뉴 링크를 `./about/` 또는 `/저장소명/about/`로 연결합니다.
5. GitHub Pages 배포 후 `https://계정.github.io/저장소명/about/`에서 확인합니다.

`about/` 안에 전용 CSS/JS/로고가 들어 있어 기존 메인페이지의 동명 파일과 충돌하지 않습니다.

## 향후 실제 자료
- 공간 사진: `about/assets/space-exterior.jpg`, `space-lobby.jpg`, `space-private.jpg`, `space-event.jpg`, `space-private-2.jpg`
- 제안서: `about/downloads/sudam-proposal.pdf`
- 뉴스, 전화, 외부 예약 링크 및 명인/인증 정보: `about/index.html`, `about/script.js` 확인 후 교체
- 메뉴/모임/후기/예약 연결 경로는 이후 실제 서브페이지를 제작해 채워야 합니다.

주의: 기존 메인페이지 저장소 구조를 직접 확인하지 못했으므로, 기존 메인 메뉴 링크 변경은 별도로 필요할 수 있습니다.
