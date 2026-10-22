수담한정식 v5.9 패치

업로드 방법
- 이 ZIP의 내용물을 GitHub 저장소 최상위에 그대로 덮어쓰기
- 기존 images 폴더와 기존 서브페이지 폴더를 삭제하지 않음
- ZIP 안에 없는 파일은 건드리지 않음

중요
- NAVER 실제 인터랙티브 지도를 사용하려면 js/site-config.js의 naverMapClientId 값에
  NAVER Cloud Platform Maps Dynamic Map의 Client ID(ncpKeyId)를 입력해야 함.
- Client ID가 비어 있으면 images/location-map.jpg를 표시하고, 클릭 시 네이버 지도 검색으로 이동함.
