<template>
  <div class="container mt-4">
    <div v-if="isLoading" class="loading">로딩 중...</div>
    <div v-else class="content-block">
      <div class="row">
        <div class="col-md-6 col-sm-12 mb-4">
          <div class="profile-section p-4 card">
            <UserProfile v-if="user" :user="user" />
            <RiskChart v-if="user" :riskPoint="user.riskPoint" />
            <FinancialGoals
              v-if="user"
              :goalAmount="user.goalAmount"
              :currentAmount="user.assets"
            />
          </div>
        </div>
        <div class="col-md-6 col-sm-12 mb-4">
          <div class="news-section p-4 card">
            <NewsSection v-if="news.length > 0" :news="news" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useProfileStore } from '../../stores/profileStore';
import { useUserStore } from '@/stores/user';
import { defineComponent, onMounted, ref } from 'vue';
import axios from 'axios';
import UserProfile from '../../components/profile/UserProfile.vue';
import RiskChart from '../../components/profile/RiskChart.vue';
import FinancialGoals from '../../components/profile/FinancialGoals.vue';
import NewsSection from '../../components/profile/NewsSection.vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  components: {
    UserProfile,
    RiskChart,
    FinancialGoals,
    NewsSection,
  },
  setup() {
    const profileStore = useProfileStore();
    const userStore = useUserStore();
    const router = useRouter(); // router 초기화
    const isLoading = ref(true); // 로딩 상태 변수

    const fetchData = async () => {
      const tokenData = JSON.parse(sessionStorage.getItem('token'));
      const accessToken = tokenData.accessToken; // accessToken 추출

      try {
        const userResponse = await axios.get(`http://localhost:9000/profile`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const newsResponse = await axios.get(
          'http://localhost:9000/profile/news?query=금융'
        );

        profileStore.setNews(newsResponse.data.items); // 뉴스 데이터 저장
        profileStore.setUserTwo(userResponse.data); // API 데이터 저장
      } catch (error) {
        console.error('데이터를 가져오는 데 실패했습니다:', error);
        alert('데이터를 가져오는 데 실패했습니다. 다시 시도해 주세요.');
      } finally {
        isLoading.value = false; // 데이터 로드 완료 후 로딩 상태 변경
      }
    };

    onMounted(() => {
      userStore.checkLoginStatus(); // 로그인 상태 확인

      // 로그인 상태에 따라 알림 띄우기
      if (!userStore.isLoggedIn) {
        alert('로그인이 필요합니다.');
        router.push('/'); // router 사용
      }

      fetchData();
    });

    return {
      user: profileStore.user,
      news: profileStore.news,
      isLoading, // 로딩 상태를 반환
    };
  },
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');

body {
  font-family: 'Roboto', sans-serif; /* 폰트 설정 */
}

.container {
  margin-top: 20px;
  padding: 20px; /* 패딩 추가 */
  background-color: #ffe7a5;
}

.loading {
  text-align: center;
  font-size: 1.5rem;
  margin-top: 20px;
}

/* 전체 블록 스타일 */
.content-block {
  background-color: #ffffff; /* 부드러운 흰색 배경 */
  border-radius: 15px; /* 둥근 모서리 */
  padding: 20px; /* 내부 패딩 */
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1); /* 그림자 효과 */
}

/* 카드 기본 스타일 */
.card {
  background-color: #ffffff; /* 흰색 배경 */
  border: none; /* 테두리 제거 */
  border-radius: 10px; /* 모서리 둥글게 */
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1); /* 그림자 효과 */
  transition: transform 0.3s; /* 부드러운 변환 효과 */
}

.card:hover {
  transform: translateY(-5px); /* 카드가 살짝 떠오르는 효과 */
}

/* 프로필 카드 스타일 */
.user-profile {
  background-color: #ffffff; /* 흰색 배경 */
}

/* 뉴스 카드 스타일 */
.news-block {
  padding: 20px;
  background-color: #ffffff; /* 흰색 배경 */
  border-radius: 10px; /* 모서리 둥글게 */
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); /* 그림자 효과 */
}

/* 뉴스 제목 스타일 */
.news-title {
  font-size: 1.5rem; /* 제목 크기 조정 */
  color: #333;
  margin-bottom: 10px;
}

/* 뉴스 항목 스타일 */
.news-item {
  border-bottom: 1px solid #e0e0e0;
  padding: 10px 0;
  transition: background-color 0.3s; /* 부드러운 배경색 전환 */
}

.news-item:hover {
  background-color: #f1f1f1; /* 마우스 오버 시 배경색 변경 */
}

.news-item-title a {
  font-size: 1.2rem; /* 제목 크기 조정 */
  color: #007bff; /* 강조 색상 */
  text-decoration: none; /* 링크 밑줄 제거 */
}

.news-item-title a:hover {
  text-decoration: underline; /* 마우스 오버 시 밑줄 추가 */
}

.news-description {
  color: #555;
  margin: 5px 0 0; /* 위쪽 마진 추가 */
}

/* 진행률 바 스타일 */
.progress {
  height: 1.5rem; /* 진행률 바 높이 */
  border-radius: 20px; /* 둥근 모서리 */
  background-color: #e0e0e0; /* 배경색 */
}

.progress-bar {
  background-color: #007bff; /* 진행률 색상 */
  transition: width 0.4s; /* 부드러운 진행률 변화 */
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .container {
    padding: 10px; /* 모바일 패딩 조정 */
  }

  .card {
    margin-bottom: 20px; /* 카드 간 간격 */
  }

  .news-title {
    font-size: 1.3rem; /* 모바일 제목 크기 조정 */
  }
}
</style>
