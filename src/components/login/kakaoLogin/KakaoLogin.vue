<template>
  <div>
    <h4>카카오 로그인 중 ...</h4>
  </div>
</template>

<script>
import { onMounted } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/user";

export default {
  name: "KaKaoLogin",

  setup() {
    const router = useRouter(); // Access Vue Router
    const userStore = useUserStore(); // Pinia의 userStore 사용

    const handleKakaoCallback = async (code) => {
      try {
        // alert("카카오 로그인 중");
        // 인증 코드를 서버에 전달하여 토큰 요청
        const response = await axios.get(
          "http://localhost:9000/kakao/callback",
          {
            // 서버에서 토큰 처리할 엔드포인트
            params: { code },
          }
        );

        console.log(response.data); //서버에서 받은 토큰 정보 처리
        // Object를 JSON 문자열로 변환하여 sessionStorage에 저장
        sessionStorage.setItem("token", JSON.stringify(response.data));

        // 저장된 accessToken을 꺼내서 findName 호출 시 Authorization 헤더에 추가
        const tokenData = JSON.parse(sessionStorage.getItem("token"));
        const accessToken = tokenData.accessToken;

        const UserData = await axios.get(
          "http://localhost:9000/kakao/finduser",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`, // Authorization 헤더에 accessToken 포함
            },
          }
        );

        const { username, nickName } = UserData.data; // 서버에서 두 값을 함께 받음
        sessionStorage.setItem("nickname", nickName);

        // Pinia의 login 함수 호출
        userStore.login(username, nickName); // 로그인 상태 업데이트

        // alert("카카오 로그인 성공!");

        // 성공하면 메인화면으로 감
        router.push("/");
      } catch (error) {
        console.error("Error fetching the token:", error);
        alert("카카오 로그인 실패!");
      }
    };

    onMounted(() => {
      // URL에서 카카오가 전달한 code와 state 값 가져오기
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");

      if (code) {
        // 서버로 인증 코드와 상태 값을 전달하여 토큰 요청
        console.log("code: " + code);
        handleKakaoCallback(code);
      } else {
        alert("카카오 로그인에 실패하였습니다.");
      }
    });

    return {};
  },
};
</script>

<style scoped></style>
