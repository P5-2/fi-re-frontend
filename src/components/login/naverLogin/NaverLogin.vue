<template>
    <div>
        <h4>네이버 로그인 콜백 처리 중...</h4>
    </div>
</template>

<script>
import { onMounted } from 'vue';
import axios from 'axios';

export default {
    name: "NaverLogin",

    setup() {
        const handleNaverCallback = async (code, state) => {
            //alert(handleNaverCallback);
            try {
                alert('네이버 로그인 중...');
                // 인증 코드를 서버에 전달하여 토큰 요청
                const response = await axios.get('http://localhost:9000/naver/callback', {
                    // 서버에서 토큰 처리할 엔드포인트
                    params: { code, state },
                });
                console.log(response.data); // 서버에서 받은 토큰 정보 처리

                const { access_token }= response.data;
                console.log(access_token)

                // access_token을 서버로 보내어 프로필 정보 요청
                const profileResponse = await axios.get('http://localhost:9000/naver/profile', {
                    headers: {
                        Authorization: `Bearer ${access_token}`,
                    },
                });

                console.log(profileResponse.data); // 프로필 정보 처리
                //alert('프로필 정보 가져오기 성공!');

                alert('네이버 로그인 성공!');
            } catch (error) {
                console.error('Error fetching the token:', error);
                alert('네이버 로그인 실패!');
            }
        };

        onMounted(() => {
            // URL에서 네이버가 전달한 code와 state 값 가져오기
            const urlParams = new URLSearchParams(window.location.search);
            const code = urlParams.get('code');
            const state = urlParams.get('state');

            if (code && state) {
                // 서버로 인증 코드와 상태 값을 전달하여 토큰 요청
                console.log(code, state);
                handleNaverCallback(code, state);
            } else {
                alert('네이버 로그인에 실패하였습니다.');
            }
        });

        return {};
    }
};
</script>

<style scoped>
/* 스타일 설정 */
</style>
