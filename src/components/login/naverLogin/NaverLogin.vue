<template>
    <div>
        <h4>네이버 로그인 콜백 처리 중...</h4>
    </div>
</template>

<script>
import { onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';

export default {
    name: "NaverLogin",

    setup() {
        const router = useRouter(); // Access Vue Router
        const userStore = useUserStore(); // Pinia의 userStore 사용

        const handleNaverCallback = async (code, state) => {
            try {
                alert('네이버 로그인 중...');
                // 인증 코드를 서버에 전달하여 토큰 요청
                const response = await axios.get('http://localhost:9000/naver/callback', {
                    // 서버에서 토큰 처리할 엔드포인트
                    params: { code, state },
                });

                // Object를 JSON 문자열로 변환하여 sessionStorage에 저장
                sessionStorage.setItem("token", JSON.stringify(response.data));

                // 저장된 accessToken을 꺼내서 findName 호출 시 Authorization 헤더에 추가
                const tokenData = JSON.parse(sessionStorage.getItem("token"));
                const accessToken = tokenData.accessToken;

                const UserData = await axios.get("http://localhost:9000/naver/finduser", {
                    headers: {
                        Authorization: `Bearer ${accessToken}` // Authorization 헤더에 accessToken 포함
                    }
                });

                const { username, nickName } = UserData.data; // 서버에서 두 값을 함께 받음
                sessionStorage.setItem("nickname", nickName);
                    
                // Pinia의 login 함수 호출
                userStore.login(username, nickName); // 로그인 상태 업데이트
                
                alert('네이버 로그인 성공!');

                // 성공하면 메인화면으로 고!
                router.push('/');

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
