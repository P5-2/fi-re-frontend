<template>
    <div>
        <h4>로그인</h4><br />
        <!-- 네이버 로그인 버튼 이미지 -->
        <img src="@/assets/login/naver_login_button.png" @click="doNaverLogin" style="width: 200px;" alt="네이버 로그인" />
        <img
            src="@/assets/login/kakao_login_medium_narrow.png"
            @click="doKakaoLogin"
            style="width: 200px"
            alt="카카오 로그인"
        />
    </div>

</template>

<script>
export default {
    name: "Login",

    methods: {
        doNaverLogin() {
            const clientId = 'wHXxK_xfYQJP4U42Ueey';
            const redirectUri = 'http://localhost:5173/naver/callback'; // 콜백 페이지 주소
            const state = Math.random().toString(36).substring(7); // CSRF 방지를 위한 난수
            const url = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}`;

            // 팝업 대신 페이지를 네이버 로그인 URL로 리다이렉트
            window.location.href = url;
        },
        doKakaoLogin() {
            const clientId = "3ac8e4957835e3e46a6bbce90bdee2e7";
            const redirectUri = "http://localhost:5173/kakao/callback"; // 콜백 페이지 주소
            const url = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}`;

            window.location.href = url;
        },
    }
};
</script>

<style scoped>
/* 스타일 설정 */
</style>
