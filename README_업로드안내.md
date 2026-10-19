# 수담한정식 v4.3 기반 서브페이지 통합 패치

이 패치는 사용자가 제공한 `sudam_github_pages_v4.3_full(1).zip`을 기준으로 제작했습니다.

## 가장 중요한 점

- **메인 `index.html`은 수정하거나 교체하지 않습니다.** 원본 메인 마크업을 그대로 사용합니다.
- 원본 `css/style.css`와 `js/main.js`도 **변경하지 않습니다.** 헤더·푸터·하단 예약바는 해당 공통 코드를 그대로 재사용합니다.
- 기존 메인의 모바일 기준: **390px 화면에서 100% 너비**, 데스크톱에서는 **최대 480px 중앙 배치**입니다. 430px 등으로 별도 변경하지 않았습니다.
- **`js/site-config.js`만 기존 파일을 교체**합니다. 기존 홈페이지의 `수담 / 메뉴 / 모임 / 후기 / 예약` 링크를 서브페이지 경로로 연결하고, GitHub Pages 저장소 경로를 자동 감지하기 위한 변경입니다.
- 사진은 제공된 메인페이지의 임시 테스트 이미지를 재사용했습니다. 실제 메뉴 사진·대표 행사·공인 이력·고객사 로고를 검증된 자료로 교체해야 합니다.

## 적용할 파일

```text
수담 GitHub 저장소 루트/
├── index.html                [기존 유지, 업로드 불필요]
├── css/
│   ├── style.css             [기존 유지, 업로드 불필요]
│   └── subpages.css          [새로 추가]
├── js/
│   ├── main.js               [기존 유지, 업로드 불필요]
│   ├── site-config.js        [교체 필수]
│   └── subpages.js           [새로 추가]
├── images/                   [기존 이미지 그대로 사용]
├── about/index.html          [새로 추가 / 수담 소개]
├── menu/index.html           [새로 추가 / 메뉴 안내]
├── menu/course/daegam/index.html
├── menu/course/jinyeon/index.html
├── menu/course/sura/index.html
├── occasions/index.html     [연결을 위한 기본 화면 — 미완성]
├── reviews/index.html       [연결을 위한 기본 화면 — 미완성]
└── reservation/index.html   [연결을 위한 기본 화면 — 미완성]
```

## 업로드 방법

1. `sudam_v43_subpages_patch.zip` 압축을 풉니다.
2. GitHub 저장소 `yoonfsdesign-ui/sudam-mobile-test`에서 `Add file` → `Upload files`를 누릅니다.
3. 압축 푼 안의 **`about/`, `menu/`, `occasions/`, `reviews/`, `reservation/`, `css/`, `js/` 폴더**를 저장소 루트에 병합합니다.
4. **`index.html`을 교체하라는 메시지가 나오면 작업을 멈추세요.** 이 패치에는 루트 `index.html`이 없습니다.
5. `js/site-config.js`는 덮어쓰고 Commit 합니다.
6. GitHub Pages가 갱신된 후 브라우저에서 **강력 새로고침(Ctrl+F5)** 하세요.

GitHub 웹 업로드에서 동일 폴더를 병합하기 어렵다면, 파일별로 경로를 생성해 업로드하거나 GitHub Desktop으로 폴더를 병합한 뒤 Push 하면 됩니다.

## 연결 주소

- 메인: `https://yoonfsdesign-ui.github.io/sudam-mobile-test/`
- 수담 소개: `https://yoonfsdesign-ui.github.io/sudam-mobile-test/about/`
- 메뉴 안내: `https://yoonfsdesign-ui.github.io/sudam-mobile-test/menu/`
- 대감상 상세: `https://yoonfsdesign-ui.github.io/sudam-mobile-test/menu/course/daegam/`
- 진연상 상세: `https://yoonfsdesign-ui.github.io/sudam-mobile-test/menu/course/jinyeon/`
- 수라상 상세: `https://yoonfsdesign-ui.github.io/sudam-mobile-test/menu/course/sura/`

## 현재 실제로 작동하는 것

- v4.3 공통 로고·헤더·탑 메뉴·햄버거·언어 선택·푸터·하단 예약 CTA
- 스크롤 이후 예약바 노출 (메인 기존 JS 동작)
- 수담 소개: 4개 섹션, 앵커 이동, 소식 임시 상세 팝업, 공간 카테고리 필터, 슬라이드·확대
- 메뉴 안내: 6개 섹션, 코스 상세 URL, 두 코스 선택 비교, 일품요리/주류 아코디언
- 방문 가능한 독립 URL: `/occasions/`, `/reviews/`, `/reservation/` (연결 테스트용 기본 화면이며 상세 기능은 **미구현**)

## 확정 자료가 필요하거나 미구현인 부분

- 코스별 전 메뉴·가격·메뉴 사진은 공식 자료 확인 필수. `진연상 62,000원`, `수라상 82,000원`은 **제공된 v4.3 메인 페이지에 표시된 테스트 가격**을 그대로 사용했습니다. `대감상`과 기타 메뉴는 가격을 새로 지어내지 않았습니다.
- 메뉴판 PDF·기업 제안서 PDF는 **다운로드 URL 준비 중**으로 처리했습니다. `js/site-config.js` 안의 `menu_pdf`, `proposal_pdf`에 실제 링크를 입력하면 활성화됩니다.
- 네이버 예약 및 카카오톡 링크는 기존 `site-config.js`의 빈 문자열 설정을 유지했습니다. 확정 링크를 입력해야 실제 예약으로 연결됩니다.
- 블루리본 수상 연도/공인 이력, 한식 명인 사진, 기업 제휴 로고·리뷰 등의 사실 확인 및 콘텐츠 교체 필요.
- `/occasions/`, `/reviews/`, `/reservation/`은 내비게이션 연결을 위한 임시 페이지이며, 완성된 서브페이지가 아닙니다.

## 확인 사항

- 제공된 v4.3 원본 `index.html`, `css/style.css`, `js/main.js`의 파일 내용은 변경하지 않았습니다.
- 모바일 390px에서 메인과 서브페이지의 공통 최대폭이 동일하도록 검증했습니다.
- 데스크톱 1440px에서는 모두 480px 모바일 컬럼을 사용합니다.
- 메뉴 코스 비교와 수담 소개 공간 필터/뉴스 모달 동작을 브라우저에서 확인했습니다.
- 이 검증은 로컬 렌더링 기반이며 실제 GitHub Pages 서버에 배포하거나 원격 사이트 수정은 수행하지 않았습니다.
