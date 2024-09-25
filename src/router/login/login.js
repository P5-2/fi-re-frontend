import NaverLogin from '@/components/login/naverLogin/NaverLogin.vue';
import KakaoLogin from '@/components/login/kakaoLogin/KakaoLogin.vue';

export default [
  {
    path: '/naver/callback',
    name: 'NaverLogin',
    component: NaverLogin,
  },
  {
    path: '/kakao/callback',
    name: 'KakaoLogin',
    component: KakaoLogin,
  },
];
