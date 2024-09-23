import NaverLogin from "@/components/login/naverLogin/NaverLogin.vue";
import KakaoLogin from "@/components/login/kakaoLogin/KakaoLogin.vue";
import Main from "@/pages/Main.vue";

export default [
  {
    path: "/",
    name: "Main",
    component: Main,
  },
  {
    path: "/naver/callback",
    name: "NaverLogin",
    component: NaverLogin,
  },
  {
    path: "/kakao/callback",
    name: "KakaoLogin",
    component: KakaoLogin,
  },
];
