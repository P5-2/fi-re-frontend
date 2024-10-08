<template>
  <div class="start-survey container">
    <div class="title-box">
      <h1 class="text-title">나의 투자성향 알아보기</h1>
    </div>
    <div class="info-box mt-4">
      <div class="card-body">
        <div class="lead">
          <p class="survey-description">
            당신의 투자 성향을 파악하기 위한 설문조사입니다.
          </p>
          <p class="survey-instruction">
            아래 버튼을 클릭하여 설문을 시작하세요.
          </p>
          <hr class="divider" />
        </div>
        <button class="btn btn-success btn-lg" @click="startSurvey">
          테스트 시작하기
        </button>
        <h5 class="mt-3">테스트 안내</h5>
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
    const router = useRouter();
    const surveyStore = useSurveyStore(); // 스토어 초기화

    onMounted(() => {
      userStore.checkLoginStatus(); // 로그인 상태 확인

      // 로그인 상태에 따라 알림 띄우기
      if (!userStore.isLoggedIn) {
        alert('로그인이 필요합니다.');
        router.push('/');
      }
    });

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
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');

.start-survey {
  text-align: center;
  margin-top: 50px;
  padding: 20px; /* 패딩 추가 */
  font-family: 'Poppins', sans-serif; /* Poppins 글꼴 사용 */
}

.title-box {
  display: inline-block; /* 글자 길이에 맞게 박스 크기 조정 */
  background-color: #dbe2ef; /* 연한 파란색 배경 */
  padding: 10px; /* 패딩 조정 */
  border-radius: 10px; /* 모서리 둥글게 */
  margin-bottom: 20px; /* 아래쪽 여백 */
  margin: 20px 0; /* 제목 상하 여백 조정 */
  text-align: center; /* 제목 중앙 정렬 */
}

.text-title {
  color: #112d4e; /* 글자 색상을 어두운 색으로 설정 */
  text-shadow: none; /* 그림자 제거 */
  font-family: 'Roboto', sans-serif; /* Roboto 글꼴 사용 */
  font-size: 2rem; /* 제목 크기 조정 */
  margin: 0; /* 기본 마진 제거 */
  padding: 10px 0; /* 위아래 패딩 추가 */
}

.info-box {
  max-width: 600px; /* 박스 최대 너비를 충분히 크게 설정 */
  margin: 0 auto; /* 중앙 정렬 */
  border-radius: 10px; /* 모서리 둥글게 */
  padding: 20px; /* 내부 패딩 추가 */
  background-color: white; /* 배경색 추가 */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2); /* 부드러운 그림자 추가 */
}

.card-body {
  padding: 0; /* 카드 내부 패딩 제거 */
}

.btn {
  background-color: #3f72af; /* 버튼 색상 */
  color: white; /* 버튼 글자 색상 */
  border: none; /* 테두리 제거 */
  border-radius: 10px; /* 둥글게 처리 */
  padding: 12px 20px; /* 패딩 조정 */
  transition: background-color 0.3s ease, transform 0.2s ease; /* 애니메이션 효과 */
}

.btn:hover {
  background-color: #112d4e; /* Hover 시 색상 변경 */
  transform: scale(1.002); /* Hover 시 크기 증가 */
}

.list-group-item {
  background-color: #f9f7f7; /* 리스트 항목 배경색 */
  border: none; /* 테두리 제거 */
  color: #112d4e; /* 리스트 항목 글자 색상 */
  padding: 10px 15px; /* 패딩 추가 */
  border-radius: 5px; /* 둥글게 처리 */
  margin-bottom: 10px; /* 항목 간 간격 추가 */
}

.list-group-item:not(:last-child) {
  border-bottom: none; /* 항목 간 구분선 제거 */
}

.survey-description,
.survey-instruction {
  font-size: 1.2rem;
  font-family: 'Arial', sans-serif;
  margin: 0;
  font-weight: bold;
}
.divider {
  border: 1px solid #ccc; /* 선 색상 */
  margin: 20px 0; /* 위아래 마진 */
}
</style>
