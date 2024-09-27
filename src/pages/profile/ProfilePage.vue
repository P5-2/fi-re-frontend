<template>
  <div class="container mt-4">
    <div class="row">
      <div class="col-md-6">
        <div class="profile-section p-4">
          <UserProfile v-if="user" :user="user" />
          <RiskChart v-if="user" :riskPoint="user.riskPoint" />
          <FinancialGoals
            v-if="user"
            :goalAmount="user.goalAmount"
            :currentAmount="user.assets"
          />
        </div>
      </div>
      <div class="col-md-6">
        <div class="news-section p-4">
          <NewsSection v-if="news.length > 0" :news="news" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useProfileStore } from '../../stores/profileStore';
import { defineComponent, onMounted } from 'vue';
import axios from 'axios';
import UserProfile from '../../components/profile/UserProfile.vue';
import RiskChart from '../../components/profile/RiskChart.vue';
import FinancialGoals from '../../components/profile/FinancialGoals.vue';
import NewsSection from '../../components/profile/NewsSection.vue';

export default defineComponent({
  components: {
    UserProfile,
    RiskChart,
    FinancialGoals,
    NewsSection,
  },
  setup() {
    const profileStore = useProfileStore();

    const fetchData = async () => {
      const tokenData = JSON.parse(sessionStorage.getItem('token'));
      const accessToken = tokenData.accessToken; // accessToken 추출

      try {
        const userResponse = await axios.get(`http://localhost:9000/profile`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        console.log('User data:', userResponse.data); // API 응답 데이터 확인
        profileStore.setUserTwo(userResponse.data); // API 데이터 저장

        const newsResponse = await axios.get(
          'http://localhost:9000/profile/news?query=금융'
        );
        console.log('News data:', newsResponse.data);
        profileStore.setNews(newsResponse.data.items); // 뉴스 데이터 저장
        console.log('Stored news:', profileStore.news);
      } catch (error) {
        console.error('데이터를 가져오는 데 실패했습니다:', error);
        alert('데이터를 가져오는 데 실패했습니다. 다시 시도해 주세요.');
      }
    };

    onMounted(() => {
      fetchData();
    });

    return {
      user: profileStore.user,
      news: profileStore.news,
    };
  },
});
</script>

<style scoped>
.container {
  margin-top: 20px;
}

.profile-section {
  background-color: #f8f9fa;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.news-section {
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

h3 {
  font-size: 1.75rem;
  color: #333;
  margin-bottom: 20px;
  font-weight: bold;
}

.news-item {
  padding: 15px;
  border: 1px solid #e0e0e0;
  border-radius: 5px;
  background-color: #f9f9f9;
  transition: background-color 0.3s;
  margin-bottom: 15px;
}

.news-item:hover {
  background-color: #f1f1f1;
}

.risk-chart {
  background-color: #c9ced3;
  color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.risk-chart h4 {
  margin-bottom: 10px;
}

@media (max-width: 768px) {
  .container {
    padding: 10px;
  }
}
</style>
