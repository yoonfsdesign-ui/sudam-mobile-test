# 수담한정식 모바일 홈페이지 가안 — GitHub Pages 테스트용

이 폴더는 **GitHub Pages에 그대로 올려 테스트할 수 있는 정적 웹사이트 패키지**입니다.
HTML/CSS/JavaScript로만 구성되어 있으며 별도 서버나 데이터베이스가 필요하지 않습니다.

> 현재 이미지들은 전체 시안에서 만든 **임시 테스트 이미지**입니다. 최종 원본 이미지를 받으면 `/images` 폴더의 파일을 교체하세요.

## 폴더 구조

```text
index.html
.nojekyll
README.md
css/
  style.css
js/
  site-config.js   ← 예약/지도/상세페이지 URL 설정
  main.js
images/
  logo.png
  logo-white.png
  hero-temp.jpg
  strength-temp.jpg
  meeting-temp.jpg
  menu-temp.jpg
  space-temp.jpg
  reviews-temp.jpg
  map-temp.jpg
  footer-temp.jpg
```

## 1. 가장 쉬운 GitHub Pages 업로드 방법

### 1) GitHub에 새 저장소 만들기
1. GitHub 로그인
2. 우측 상단 `+` → `New repository`
3. Repository name 예: `sudam-mobile-test`
4. **Public** 선택
5. `Create repository`

GitHub Free에서 Pages를 사용할 때는 일반적으로 Public 저장소가 가장 간단합니다.
테스트 페이지와 업로드한 이미지가 인터넷에 공개될 수 있으므로 내부기밀/개인정보 파일은 넣지 마세요.

### 2) 이 ZIP 압축 풀기
ZIP 자체를 GitHub에 올리는 것이 아니라 **압축을 푼 뒤 폴더 안의 파일들**을 올립니다.

중요: 업로드 후 저장소 최상단에 바로 아래처럼 보여야 합니다.

```text
index.html
css/
js/
images/
```

`폴더명/index.html`처럼 한 단계 안쪽에 들어가면 Pages 첫 화면을 찾지 못할 수 있습니다.

### 3) 파일 올리기
저장소 화면에서:
1. `Add file`
2. `Upload files`
3. 압축을 푼 `sudam_github_pages` 폴더 **안의 내용 전체**를 드래그
4. 아래 Commit message에 예: `Upload Sudam mobile prototype`
5. main 브랜치에 Commit

### 4) GitHub Pages 켜기
1. 저장소 상단 `Settings`
2. 왼쪽 `Pages`
3. `Build and deployment`
4. `Source` → **Deploy from a branch**
5. Branch → **main**
6. Folder → **/(root)**
7. `Save`

잠시 후 Pages 화면에 `Visit site`가 표시됩니다.
보통 주소는 다음과 같습니다.

```text
https://내아이디.github.io/sudam-mobile-test/
```

첫 배포나 수정사항 반영은 수 분 걸릴 수 있습니다.

---

## 2. 링크 연결 방법

`js/site-config.js`만 수정하면 됩니다.

예:

```js
window.SUDAM_CONFIG = {
  urls: {
    reservation: "https://booking.naver.com/...",
    kakao: "https://pf.kakao.com/...",
    naver_map: "https://map.naver.com/...",
    meeting_family: "https://...",
    course_jinyeon: "https://..."
  }
};
```

URL을 비워둔 버튼은 가안에서 클릭해도 페이지 맨 위로 튀지 않고
`연결 URL 준비 중입니다.` 메시지만 표시됩니다.

전화 버튼은 현재 `02-558-4900`으로 연결되어 있습니다.

---

## 3. 이미지 교체 방법

가장 쉬운 방법은 **파일명은 그대로 두고 이미지 파일만 교체**하는 것입니다.

예:

```text
images/hero-temp.jpg
```

을 새 Hero 이미지로 덮어쓰면 HTML 수정 없이 바로 교체됩니다.

현재 연결 파일:
- `hero-temp.jpg` — 메인 Hero
- `strength-temp.jpg` — 수담 강점
- `meeting-temp.jpg` — 모임 영역
- `menu-temp.jpg` — 대표 메뉴
- `space-temp.jpg` — 공간
- `reviews-temp.jpg` — 후기
- `map-temp.jpg` — 약도
- `footer-temp.jpg` — Footer 배경

최종 작업에서는 파일명을 `hero-01.webp` 같은 식으로 정리해도 되지만,
가안 단계에서는 파일명을 유지하는 편이 편합니다.

---

## 4. 텍스트 수정 방법

`index.html`을 GitHub에서 직접 열고 연필 아이콘(Edit)으로 수정할 수 있습니다.

예를 들어 Hero 제목:

```html
<h1 id="heroTitle">품격을 더하다</h1>
```

문구만 수정하고 `Commit changes`하면 Pages가 다시 배포됩니다.

---

## 5. 디자인 수정 위치

대부분의 디자인 값은 아래 파일에 있습니다.

```text
css/style.css
```

상단의 CSS 변수에서 컬러와 기본 규격을 한꺼번에 수정할 수 있습니다.

예:

```css
:root {
  --sd-bg: #F4ECE4;
  --sd-brown-900: #2E1F12;
  --sd-gold: #AA8E6B;
}
```

---

## 6. 현재 구현된 테스트 기능

- 모바일 반응형 레이아웃
- 햄버거 메뉴
- 상단 sticky header
- 수담 강점 자동 슬라이드
- 공간 수동 슬라이드 / swipe
- 모임 카드 클릭 상태
- 메뉴 카드
- 후기 카드
- 주소 복사 + toast
- 전화 걸기
- Family Site dropdown
- 하단 예약/전화/카카오 고정 CTA
- Footer 진입 시 하단 CTA 자동 숨김
- safe-area 대응
- `prefers-reduced-motion` 대응
- GTM용 클릭 이벤트 dataLayer 구조

---

## 7. 수정본 다시 올리는 방법

### 간단한 수정
GitHub에서 해당 파일 클릭 → 연필 아이콘 → 수정 → Commit.

### 이미지/파일 여러 개 수정
`Add file` → `Upload files`에서 변경한 파일들을 다시 업로드 → Commit.

같은 경로/파일명으로 반영하면 사이트에서 해당 파일을 계속 사용합니다.

---

## 8. 자주 생기는 문제

### Pages가 404일 때
- `index.html`이 저장소 root에 있는지 확인
- `Settings → Pages`에서 `main / (root)`인지 확인
- 배포 직후라면 몇 분 대기

### 이미지/CSS가 안 나올 때
- `css`, `js`, `images` 폴더 이름의 대소문자 확인
- Windows에서는 되는데 Pages에서는 안 되는 경우 파일명 대소문자 불일치가 흔합니다.

### 수정했는데 이전 화면이 나올 때
- Pages 배포가 끝났는지 확인
- 브라우저 새로고침 또는 강력 새로고침
- GitHub 저장소의 `Actions`에서 배포 상태 확인

### 버튼 눌렀는데 'URL 준비 중'이 나올 때
정상입니다. `js/site-config.js`의 해당 URL이 아직 비어 있는 상태입니다.

---

## 참고
이 패키지는 **수담한정식 모바일 홈페이지의 개발 전 UI/UX 가안 테스트** 용도입니다.
GitHub Pages는 정적 사이트 테스트에는 잘 맞지만, 실제 예약 DB 처리·로그인·관리자 기능·PHP 같은 서버 기능은 지원하지 않습니다.


## v2 QA 반영
- 강점/공간 슬라이더 텍스트 상단 및 pagination 이미지 내부 배치
- 메뉴 대표코스/전체메뉴/코스상담 UI 수정
- 후기 2개 노출 + 사진 가로 스크롤 + 상세 정보 순서 적용
- 오시는 길 지도 선택, 주소/예약/발렛 순서 및 건물 이미지 영역 적용
