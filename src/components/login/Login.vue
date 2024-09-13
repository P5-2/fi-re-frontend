<template>
    <div>
        <h4>로그인</h4><br />
        <!-- 네이버 로그인 버튼 이미지 -->
        <img src="@/assets/login/naver_login_button.png" @click="doNaverLogin" style="width: 200px;" alt="네이버 로그인" />
    </div>
</template>

<script>
export default {
    name: "Login",

    methods: {
        doNaverLogin() {
            const clientId = 'wHXxK_xfYQJP4U42Ueey';
            const redirectUri = 'http://localhost:5173/naver-login'; // 콜백 페이지 주소
            const state = Math.random().toString(36).substring(7); // CSRF 방지를 위한 난수
            const url = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}`;

            /* this.openPopup(url); */
            // 팝업 대신 페이지를 네이버 로그인 URL로 리다이렉트
            window.location.href = url;
        },
        openPopup(url) {
            const popupHeight = '600';
            const popupWidth = '600';
            const popupX = window.screenX + (window.innerWidth / 2) - (popupWidth / 2);
            const popupY = window.screenY + (window.innerHeight / 2) - (popupHeight / 2);
            const popupOptions = `height=${popupHeight},width=${popupWidth},left=${popupX},top=${popupY},scrollbars=yes,resizable=yes`;

            // 팝업을 열고 네이버 로그인 URL로 리다이렉트
            window.open(url, '_blank', popupOptions);
        }
    }
}
</script>

<style scoped>
/* 스타일 설정 */
</style>