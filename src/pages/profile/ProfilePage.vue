<template>
  <div class="container mt-4">
    <div v-if="isLoading" class="loading-block">
      <div class="loading">Loading...</div>
    </div>
    <div v-else class="content-block">
      <div class="row">
        <div class="col-md-6 col-sm-12 mb-4">
          <div class="profile-section p-4 card">
            <UserProfile v-if="usertwo" :usertwo="usertwo" />
            <RiskChart
              v-if="usertwo"
              :nickname="usertwo.nickname"
              :riskPoint="usertwo.riskPoint"
            />
          </div>
        </div>
        <div class="col-md-6 col-sm-12 mb-4">
          <div class="news-section p-4 card">
            <NewsSection
              v-if="usertwo && usertwo.exp >= 6 && news.length > 0"
              :news="news"
            />
            <div v-else-if="usertwo && usertwo.exp < 6" class="level-warning">
              <p>뉴스는 레벨 2 이상부터 이용 가능합니다.</p>
            </div>
          </div>
        </div>
        <div>
          <FinancialGoals
            v-if="usertwo"
            :goalAmount="usertwo.goalAmount"
            :currentAmount="usertwo.assets"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useProfileStore } from '../../stores/profileStore';
import { useUserStore } from '@/stores/user';
import { defineComponent, onMounted, ref, computed } from 'vue';
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
      const riskPoint = profileStore.usertwo?.riskPoint ?? 0; 

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

        profileStore.setUserTwo(userResponse.data);

        const queryKeyword = riskPointToQuery.value;
        const newsResponse = await axios.get(
          `http://localhost:9000/profile/news?query=${queryKeyword}`
        );

        profileStore.setNews(newsResponse.data.items);
        await axios.post(
          `http://localhost:9000/exp`,
          {
            page: 'profile',
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
      } catch (error) {
        console.error('데이터를 가져오는 데 실패했습니다:', error);
        alert('데이터를 가져오는 데 실패했습니다. 다시 시도해 주세요.');
      } finally {
        isLoading.value = false;
      }
    };
    const trackPageVisit = async () => {
      try {
        const tokenData = JSON.parse(sessionStorage.getItem('token'));
        const accessToken = tokenData?.accessToken;

        await axios.post(
          `http://localhost:9000/exp`,
          {
            page: 'profile',
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
      } catch (error) {
        console.error('Error tracking page visit:', error);
      }
    };

    onMounted(async () => {
      await userStore.checkLoginStatus();
      await trackPageVisit();
      await fetchData();

      if (!userStore.isLoggedIn) {
        alert('로그인이 필요합니다.');
        router.push('/');
      } else {
        const storedUser = JSON.parse(localStorage.getItem('usertwo'));
        const storedNews = JSON.parse(localStorage.getItem('news'));

        if (storedUser) {
          profileStore.setUserTwo(storedUser);
        }

        if (storedNews) {
          profileStore.setNews(storedNews);
          isLoading.value = false; 
        } else {
          await fetchData(); 
        }
      }
    });

    return {
      usertwo: profileStore.usertwo,
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
  background-color: #3f72af;
}

.loading {
  text-align: center;
  font-size: 1.5rem;
  margin-top: 20px;
}

.content-block {
  background-color: #ffffff;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.card {
  background-color: #ffffff;
  border: none;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.user-profile {
  background-color: #ffffff;
}

.news-block {
  padding: 20px;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.news-title {
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 10px;
}

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

.progress {
  height: 1.5rem;
  border-radius: 20px;
  background-color: #e0e0e0;
}

.progress-bar {
  background-color: #007bff;
  transition: width 0.4s;
}

.loading-block {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; 
  background-color: #ffffff; 
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
}

.loading {
  font-size: 1.5rem;
  color: #333;
}

.level-warning {
  background-color: #ffe4e1;
  border: 1px solid #ff6347;
  border-radius: 10px; 
  padding: 15px;
  color: #ff6347;
  font-weight: bold;
  text-align: center;
  margin-top: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

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
