<template>
  <div class="recommend-container">
    <div class="fund-section">
      <h3 class="title">펀드 추천 리스트</h3>
      <div v-if="fundList && fundList.length > 0">
        <div v-for="(fund, index) in fundList" :key="index" class="fund-card" @click="savingsItemClick(fund.prdNo)">
          <div class="logo-container">
            <!-- 위험도 섹션 -->
            <div class="grade-section">
              <div class="grade-icon" :style="{ backgroundColor: gradeColor(fund.dngrGrade) }">
                {{ fund.dngrGrade }}
              </div>
              <div class="grade-text" :style="{ color: gradeColor(fund.dngrGrade) }">
                {{ gradeText(fund.dngrGrade) }}
              </div>
            </div>
            <div class="fund-info">
              <h3 class="fund-name">{{ fund.pname }}</h3>
              <div class="info-row">
                <div class="type-rate-container">
                  <!-- 유형과 수익률을 감싸는 컨테이너 -->
                  <p class="fund-type">유형: <span class="type">{{ fund.type }}</span></p>
                  <div class="rate-container">
                    <p class="fund-rate">3개월 수익률: <span class="rate">{{ fund.rate }}%</span></p>
                    <p class="fund-rate">6개월 수익률: <span class="rate">{{ fund.sixMRate }}%</span></p>
                    <p class="fund-rate">12개월 수익률: <span class="rate">{{ fund.oneYRate }}%</span></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        <div class="empty-message">
          <p>추천할 펀드 상품이 없습니다.</p>
          <p>더 나은 추천을 위해 간단한 설문조사를 진행해 주세요.</p>
          <button @click="goToSurvey">설문조사 시작하기</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

export default {
  name: "FundRecommendations",
  setup() {
    const fundList = ref([]);
    const router = useRouter();

    const fetchFunds = async () => {
      const accessToken = getAccessToken();
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      try {
        const response = await axios.get('http://localhost:9000/recommend/fund', config);
        fundList.value = response.data;
      } catch (error) {
        console.error("Error fetching funds:", error);
      }
    };

    const getAccessToken = () => {
      const tokenData = JSON.parse(sessionStorage.getItem("token"));
      return tokenData.accessToken;
    };

    const savingsItemClick = (prdNo) => {
      router.push('/itemDetail/fund/' + prdNo);
    };

    const goToSurvey = () => {
      router.push('/survey/start');
    };

    const gradeText = (grade) => {
      switch (grade) {
        case 6: return '매우 낮은 위험';
        case 5: return '낮은 위험';
        case 4: return '보통 위험';
        case 3: return '다소 높은 위험';
        case 2: return '높은 위험';
        case 1: return '매우 높은 위험';
        default: return '알 수 없음';
      }
    };

    const gradeColor = (grade) => {
      switch (grade) {
        case 6: return '#146138'; // 매우 낮은 위험
        case 5: return '#1D9A58'; // 낮은 위험
        case 4: return '#FBBF0A'; // 보통 위험
        case 3: return '#F79E07'; // 다소 높은 위험
        case 2: return '#EB5908'; // 높은 위험
        case 1: return '#DD1820'; // 매우 높은 위험
        default: return '#666'; // 기본 색상
      }
    };

    onMounted(() => {
      fetchFunds();
    });

    return {
      fundList,
      goToSurvey,
      savingsItemClick,
      gradeText,
      gradeColor,
    };
  },
};
</script>

<style scoped>
.recommend-container {
  padding: 20px;
  background-color: #DFE7F2;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin: 0 auto;
}

.title {
  font-size: 25px;
  font-weight: 600;
  margin-left: 20px;
  margin-bottom: 10px;
  color: #0A3459;
  text-align: left;
}

.fund-section {
  display: flex;
  flex-direction: column;
  gap: 1.0em;
}

.fund-card {
  display: flex;
  align-items: center;
  border: none;
  padding: 1em;
  border-radius: 12px;
  background-color: #ffffff;
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
  width: 100%;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  margin-bottom: 10px;
}

.fund-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.logo-container {
  display: flex;
  align-items: center;
  width: 100%;
}

.fund-info {
  flex-grow: 1;
  text-align: left;
}

.fund-name {
  margin: 0;
  font-size: 1.4em;
  font-weight: 700;
  color: #3C74A6;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.3em;
}

.type-rate-container {
  display: flex;
  flex-direction: column;
}

.rate-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.fund-type,
.fund-rate {
  color: #000000;
  font-size: 0.9em;
  font-weight: 600;
  flex: 1 1 auto;
  min-width: 100px;
  margin: 5px;
}

.rate {
  color: #3C74A6;
}

.empty-message {
  color: #999;
  font-style: italic;
  text-align: center;
  padding: 1em;
  border: 1px dashed #0A3459;
  border-radius: 8px;
  background-color: #F2F2F2;
}

button {
  background-color: #0A3459;
  color: white;
  border: none;
  padding: 0.6em 1.2em;
  font-size: 1em;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s;
  margin-top: 1em;
}

button:hover {
  background-color: #3C74A6;
  transform: scale(1.05);
}

.grade-section {
  flex: 0 0 100px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 50px;
}

.grade-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  font-weight: 600;
  text-align: center;
  line-height: 40px;
  font-size: 18px;
  color: white;
  background-color: #0A3459;
}

.grade-text {
  font-weight: bold;
  margin-top: 0.5em;
  font-size: 0.8em;
}

@media (max-width: 600px) {
  .rate-container {
    flex-direction: column;
  }
}
</style>
