<template>
  <div class="container mt-4">
    <div v-if="isLoading" class="loading-block">
      <div class="loading">Loading...</div>
    </div>
    <div v-else class="content-block">
      <div class="row">
        <div class="col-md-6 col-sm-12 mb-4">
          <div class="profile-section p-4 card">
            <UserProfile v-if="user" :user="user" />
            <RiskChart v-if="user" :riskPoint="user.riskPoint" />
          </div>
        </div>
        <div class="col-md-6 col-sm-12 mb-4">
          <div class="news-section p-4 card">
            <NewsSection
              v-if="user && user.exp >= 6 && news.length > 0"
              :news="news"
            />
            <div v-else-if="user && user.exp < 6" class="level-warning">
              <p>뉴스는 레벨 2 이상부터 이용 가능합니다.</p>
            </div>
          </div>
        </div>
        <div>
          <FinancialGoals
            v-if="user"
            :goalAmount="user.goalAmount"
            :currentAmount="user.assets"
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

    // console.log(riskPoint);
    const riskPointToQuery = computed(() => {
      const riskPoint = profileStore.user?.riskPoint ?? 0; // 기본값 0 설정

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

        // 사용자 정보를 설정
        profileStore.setUserTwo(userResponse.data);

        // riskPointToQuery를 사용하여 쿼리 키워드 생성
        const queryKeyword = riskPointToQuery.value;
        const newsResponse = await axios.get(
          `http://localhost:9000/profile/news?query=${queryKeyword}`
        );

        profileStore.setNews(newsResponse.data.items);
        await axios.post(
          `http://localhost:9000/exp`,
          {
            page: 'profile', // 현재 페이지 이름
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
        isLoading.value = false; // 로딩 종료
      }
    };

    onMounted(async () => {
      await userStore.checkLoginStatus(); // 로그인 상태 확인
      await fetchData();
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
  background-color: #3f72af;
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

.loading-block {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; /* 화면 전체 높이 */
  background-color: #ffffff; /* 하얀 배경 */
  position: absolute; /* 다른 요소 위에 위치 */
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000; /* 다른 요소들 위에 오도록 설정 */
}

.loading {
  font-size: 1.5rem;
  color: #333; /* 텍스트 색상 */
}

.level-warning {
  background-color: #ffe4e1; /* 연한 빨간색 배경 */
  border: 1px solid #ff6347; /* 토마토 색상 테두리 */
  border-radius: 10px; /* 모서리 둥글게 */
  padding: 15px; /* 내부 여백 */
  color: #ff6347; /* 텍스트 색상 */
  font-weight: bold; /* 텍스트 굵게 */
  text-align: center; /* 가운데 정렬 */
  margin-top: 20px; /* 위쪽 마진 */
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2); /* 그림자 효과 */
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
