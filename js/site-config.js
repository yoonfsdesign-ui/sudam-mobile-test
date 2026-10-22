/*
 * 수담한정식 v5.8 공통 경로 설정
 * GitHub Pages 저장소 경로를 현재 script 위치에서 자동 계산합니다.
 * 메인/서브/상세 어느 깊이에서도 동일한 링크를 사용합니다.
 */
(function(){
  'use strict';
  const scriptUrl = document.currentScript
    ? document.currentScript.src
    : new URL('js/site-config.js', document.baseURI).href;
  const root = new URL('../', scriptUrl);
  const path = relative => {
    const u = new URL(relative, root);
    return u.pathname + u.search + u.hash;
  };

  window.SUDAM_CONFIG = {
    // NAVER Cloud Platform Maps > Dynamic Map Client ID (ncpKeyId).
    // 비워두면 location-map.jpg를 보여주고 클릭 시 네이버 지도 검색으로 이동합니다.
    naverMapClientId: '',
    urls: {
      reservation: '',
      kakao: '',
      wechat: '',
      naver_map: 'https://map.naver.com/p/search/%EC%88%98%EB%8B%B4%ED%95%9C%EC%A0%95%EC%8B%9D',
      kakao_map: 'https://map.kakao.com/?q=%EC%88%98%EB%8B%B4%ED%95%9C%EC%A0%95%EC%8B%9D',

      kr: path(''), en:'', cn:'', jp:'',

      nav_sudam: path('about/'),
      nav_menu: path('menu/'),
      nav_meeting: path('occasions/'),
      nav_reviews: path('reviews/'),
      nav_reservation: path('reservation/'),

      strength_room: path('about/#space'),
      strength_food: path('about/#story'),
      b2b: path('about/#partnership'),

      meeting_family: path('occasions/family/'),
      meeting_formal: path('occasions/formal/'),
      meeting_baby: path('occasions/baby/'),
      meeting_vip: path('occasions/vip/'),
      meeting_corporate: path('occasions/corporate/'),
      meeting_group: path('occasions/group/'),
      meeting_wedding: path('occasions/wedding/'),

      course_daegam: path('menu/course/daegam/'),
      course_jinyeon: path('menu/course/jinyeon/'),
      course_sura: path('menu/course/sura/'),
      menu_all: path('menu/'),
      course_consult: path('reservation/'),
      space_all: path('about/#space'),

      reviews_all: path('reviews/'),
      review_1: path('reviews/detail/?id=r01'),
      review_2: path('reviews/detail/?id=r02'),
      review_3: path('reviews/detail/?id=r03'),
      review_4: path('reviews/detail/?id=r04'),

      invitation: path('reservation/invitation/'),

      blog:'', instagram:'', youtube:'',
      family_sudam: path(''), family_guryong:'', family_food:'', family_group:'', family_yfs:'', family_ym:'',
      privacy:'', email_policy:'', recruit:'',
      partnership: path('about/#partnership'),
      menu_pdf:'', proposal_pdf:''
    }
  };
})();
