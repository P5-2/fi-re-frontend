<template>
  <div class="recommend-container">
    <h2 class="title">펀드 추천</h2>
    <div class="fund-section">
      <div v-if="fundList && fundList.length > 0">
        <div
          v-for="(fund, index) in fundList"
          :key="index"
          class="fund-card"
          @click="savingsItemClick(fund.prdNo)"
        >
          <div class="logo-container">
            <!-- 위험도 섹션 -->
            <div class="grade-section">
              <div
                class="grade-icon"
                :style="{ backgroundColor: gradeColor(fund.dngrGrade) }"
              >
                {{ fund.dngrGrade }}
              </div>
              <div
                class="grade-text"
                :style="{ color: gradeColor(fund.dngrGrade) }"
              >
                {{ gradeText(fund.dngrGrade) }}
              </div>
            </div>
            <div class="fund-info">
              <h3 class="fund-name">{{ fund.pname }}</h3>
              <div class="info-row">
                <div class="type-rate-container">
                  <!-- 유형과 수익률을 감싸는 컨테이너 -->
                  <p class="fund-type">유형: <span class="type">{{ fund.type }}</span></p>
                  <p class="fund-rate">수익률: <span class="rate">{{ fund.rate }}%</span></p>
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
        console.log(fundList.value);
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
      console.log(prdNo);
    };

    const goToSurvey = () => {
      router.push('/survey/start');
    };

    const gradeText = (grade) => {
      switch (grade) {
        case 6: return '매우낮은위험';
        case 5: return '낮은위험';
        case 4: return '보통위험';
        case 3: return '다소높은위험';
        case 2: return '높은위험';
        case 1: return '매우높은위험';
        default: return '알 수 없음';
      }
    };

    const gradeColor = (grade) => {
      switch (grade) {
        case 6: return '#146138';
        case 5: return '#1D9A58';
        case 4: return '#FBBF0A';
        case 3: return '#F79E07';
        case 2: return '#EB5908';
        case 1: return '#DD1820';
        default: return '#666';
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
  background-color: #e9ecef;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  margin: 0 auto;
}

.title {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 15px;
  color: #333;
  text-align: center;
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

.logo {
  width: 60px;
  height: auto;
  margin-right: 20px;
}

.fund-info {
  flex-grow: 1;
  text-align: left;
}

.fund-name {
  margin: 0;
  font-size: 1.4em;
  font-weight: 700;
  color: #007BFF;
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

.fund-type,
.fund-rate {
  color: #555;
  font-size: 0.9em;
  font-weight: 600;
  margin: 0;
}

.empty-message {
  color: #999;
  font-style: italic;
  text-align: center;
  padding: 1em;
  border: 1px dashed #ccc;
  border-radius: 8px;
  background-color: #f8f9fa;
}

button {
  background-color: #007BFF;
  color: white;
  border: none;
  padding: 0.7em 1.5em;
  font-size: 1em;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s;
  margin-top: 1em;
}

button:hover {
  background-color: #0056b3;
  transform: scale(1.05);
}

.grade-section {
  flex: 1;
  min-width: 150px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
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
}

.grade-text {
  font-weight: bold;
  margin-top: 5px;
}
</style>
