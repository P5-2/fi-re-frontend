<template>
  <div class="start-survey container">
    <div class="title-box">
      <h1 class="text-title">설문조사 시작</h1>
    </div>
    <div class="info-box mt-4">
      <div class="card-body">
        <p class="lead">
          당신의 투자 성향을 파악하기 위한 설문조사입니다. 아래 버튼을 클릭하여
          설문을 시작하세요.
        </p>
        <button class="btn btn-success btn-lg" @click="startSurvey">
          설문 시작하기
        </button>
        <h5 class="mt-3">설문조사 안내</h5>
        <ul class="list-group">
          <li class="list-group-item">
            🔍 본 설문은 투자 성향을 분석하기 위한 것입니다.
          </li>
          <li class="list-group-item">
            📈 설문에 소요되는 시간은 약 2분입니다.
          </li>
          <li class="list-group-item">💡 모든 응답은 익명으로 처리됩니다.</li>
          <li class="list-group-item">
            📊 설문 결과는 개인 맞춤형 투자 전략을 제공하는 데 사용됩니다.
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router';
import { useSurveyStore } from '../../stores/surveyStore';
import { onMounted } from 'vue';
import { useUserStore } from '@/stores/user';

export default {
  setup() {
    const userStore = useUserStore();

    onMounted(() => {
      userStore.checkLoginStatus(); // 로그인 상태 확인

      // 로그인 상태에 따라 알림 띄우기
      if (!userStore.isLoggedIn) {
        alert('로그인이 필요합니다.');

        router.push('/');
      }
    });
    const router = useRouter();
    const surveyStore = useSurveyStore(); // 스토어 초기화

    const startSurvey = () => {
      surveyStore.resetSurvey(); // 설문 초기화
      router.push({ name: 'Survey' }); // 설문 페이지로 이동
    };

    return {
      startSurvey,
      userStore,
    };
  },
};
</script>

<style scoped>
.start-survey {
  text-align: center;
  margin-top: 50px;
}

.title-box {
  display: inline-block; /* 글자 길이에 맞게 박스 크기 조정 */
  background-color: rgba(255, 255, 224, 0.8); /* 연한 노란색 배경 */
  padding: 10px; /* 패딩 조정 */
  border-radius: 10px; /* 모서리 둥글게 */
  margin-bottom: 20px; /* 아래쪽 여백 */
  border: 2px solid rgba(128, 128, 128, 0.8); /* 회색 테두리 추가 */
}

.text-title {
  color: black; /* 글자 색상을 검은색으로 설정 */
  text-shadow: none; /* 그림자 제거 */
}

.info-box {
  max-width: 600px; /* 박스 최대 너비를 충분히 크게 설정 */
  margin: 0 auto; /* 중앙 정렬 */
  border-radius: 10px; /* 모서리 둥글게 */
  border: 2px solid rgba(128, 128, 128, 0.8); /* 회색 테두리 */
  padding: 20px; /* 내부 패딩 추가 */
  background-color: white; /* 배경색 추가 */
}

.card-body {
  padding: 0; /* 카드 내부 패딩 제거 */
}
</style>
