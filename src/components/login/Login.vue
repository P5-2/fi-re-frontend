<!-- 로그인 버튼이 오면 되는 곳 -->
<!-- 카카오, 네이버 로그인 버튼 -->
<template>
    <div>
        <h4>로그인</h4><br />
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
            naver_id_login.setButton("green", 4, 40);
            naver_id_login.setDomain("http://localhost:9000/");
            naver_id_login.setState(state);
            naver_id_login.setPopup();
            naver_id_login.init_naver_id_login();
        },
    },
};
</script>

<style></style>