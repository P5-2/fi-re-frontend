<template>
    <div>
        <!-- 네이버 로그인 버튼 노출 영역 -->
        <div id="naver_id_login"></div>
    </div>
</template>
<script>
export default {
    name: "Login",
    mounted() {
        this.initializeNaverLogin();
    },
    methods: {
        initializeNaverLogin() {
            const naver_id_login = new window.naver_id_login(
                "wHXxK_xfYQJP4U42Ueey",
                "http://localhost:9000/naverLogin"
            );
            const state = naver_id_login.getUniqState();
            naver_id_login.setButton("white", 2, 40);
            naver_id_login.setDomain("http://localhost:9000/");
            naver_id_login.setState(state);
            naver_id_login.setPopup();
            naver_id_login.init_naver_id_login();
        },
    },
};
</script>



<!-- "wHXxK_xfYQJP4U42Ueey", "http://localhost:9000/naverLogin" -->
<style></style>