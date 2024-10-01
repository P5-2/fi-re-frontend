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
    const router = useRouter();
    const isLoading = ref(true);

    const riskPointToQuery = computed(() => {
      const riskPoint = profileStore.user?.riskPoint;

      const keywords = {
        매우보수: ['안전자산', '국채', '고정금리', '안정성'],
        보수적: ['채권형 펀드', '안정형 상품', '배당주', '금리 인상'],
        중립적: ['혼합형 펀드', 'ETF', '투자 전략', '주식 시장 동향'],
        적극적: ['주식형 펀드', '해외 주식', '성장주', '시장 분석'],
        매우적극: ['암호화폐', '비트코인', '블록체인', '선물 거래'],
      };
      const getRandomKeyword = (array) => {
        const randomIndex = Math.floor(Math.random() * array.length);
        return array[randomIndex];
      };

      // 투자 성향에 따라 랜덤 키워드 리턴
      if (riskPoint <= 15) return getRandomKeyword(keywords.매우보수); // 매우 보수적
      if (riskPoint <= 21) return getRandomKeyword(keywords.보수적); // 보수적
      if (riskPoint <= 27) return getRandomKeyword(keywords.중립적); // 중립적
      if (riskPoint <= 33) return getRandomKeyword(keywords.적극적); // 적극적
      return getRandomKeyword(keywords.매우적극); // 매우 적극적
    });

    const fetchData = async () => {
      const tokenData = JSON.parse(sessionStorage.getItem('token'));
      const accessToken = tokenData?.accessToken;

      if (!accessToken) {
        alert('로그인이 필요합니다.');
        router.push('/');
        return;
      }

      try {
        const userResponse = await axios.get(`http://localhost:9000/profile`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const queryKeyword = riskPointToQuery.value;
        const newsResponse = await axios.get(
          `http://localhost:9000/profile/news?query=${queryKeyword}`
        );

        profileStore.setNews(newsResponse.data.items);
        profileStore.setUserTwo(userResponse.data);
      } catch (error) {
        console.error('데이터를 가져오는 데 실패했습니다:', error);
        alert('데이터를 가져오는 데 실패했습니다. 다시 시도해 주세요.');
      } finally {
        isLoading.value = false; // 로딩 종료
      }
    };

    onMounted(async () => {
      await userStore.checkLoginStatus(); // 로그인 상태 확인

      if (!userStore.isLoggedIn) {
        alert('로그인이 필요합니다.');
        router.push('/');
      } else {
        // 로컬 스토리지에서 데이터 복원
        const storedUser = JSON.parse(localStorage.getItem('user'));
        const storedNews = JSON.parse(localStorage.getItem('news'));

        if (storedUser) {
          profileStore.setUserTwo(storedUser);
        }

        if (storedNews) {
          profileStore.setNews(storedNews);
          isLoading.value = false; // 뉴스가 있는 경우 로딩 종료
        } else {
          await fetchData(); // 데이터가 없으면 API 호출
        }
      }
    });

    return {
      user: profileStore.user,
      news: profileStore.news,
      isLoading,
      riskPointToQuery,
    };
  },
});
</script>
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');

body {
  font-family: 'Roboto', sans-serif;
}

.container {
  margin-top: 20px;
  padding: 20px;
  background-color: #ffe7a5;
}

.loading {
  text-align: center;
  font-size: 1.5rem;
  margin-top: 20px;
}

/* 전체 블록 스타일 */
.content-block {
  background-color: #ffffff;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

/* 카드 기본 스타일 */
.card {
  background-color: #ffffff;
  border: none;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
}

.card:hover {
  transform: translateY(-5px);
}

/* 프로필 카드 스타일 */
.user-profile {
  background-color: #ffffff;
}

/* 뉴스 카드 스타일 */
.news-block {
  padding: 20px;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

/* 뉴스 제목 스타일 */
.news-title {
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 10px;
}

/* 뉴스 항목 스타일 */
.news-item {
  border-bottom: 1px solid #e0e0e0;
  padding: 10px 0;
  transition: background-color 0.3s;
}

.news-item:hover {
  background-color: #f1f1f1;
}

.news-item-title a {
  font-size: 1.2rem;
  color: #007bff;
  text-decoration: none;
}

.news-item-title a:hover {
  text-decoration: underline;
}

.news-description {
  color: #555;
  margin: 5px 0 0;
}

/* 진행률 바 스타일 */
.progress {
  height: 1.5rem;
  border-radius: 20px;
  background-color: #e0e0e0;
}

.progress-bar {
  background-color: #007bff;
  transition: width 0.4s;
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .container {
    padding: 10px;
  }

  .card {
    margin-bottom: 20px;
  }

  .news-title {
    font-size: 1.3rem;
  }
}
</style>
