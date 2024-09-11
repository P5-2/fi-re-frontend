<template>
    <div>
        <!-- 네이버 로그인 버튼 및 사용자 정보 확인 -->
        <div id="naver_id_login"></div>
    </div>
</template>

<script>
export default {
    name: "NaverLogin",
    mounted() {
        this.initializeNaverLogin();
    },
    methods: {
        initializeNaverLogin() {
            const naver_id_login = new window.naver_id_login(
                "wHXxK_xfYQJP4U42Ueey",
                "http://localhost:9000/naverLogin"
            );

            // 네이버 사용자 프로필 조회 이후 프로필 정보를 처리할 callback function
            const naverSignInCallback = () => {
                alert(naver_id_login.getProfileData('email'));
                alert(naver_id_login.getProfileData('nickname'));
                alert(naver_id_login.getProfileData('age'));
            };

            // 접근 토큰 값 출력
            alert("token : "+naver_id_login.oauthParams.access_token);

            // 네이버 사용자 프로필 조회
            naver_id_login.get_naver_userprofile(naverSignInCallback);
        },
    },
};
</script>

<style scoped>
/* 스타일을 여기에 추가할 수 있습니다 */
</style>