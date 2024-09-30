<template>
  <div class="recommend-container">
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
                  <p class="fund-rate">3개월 수익률: <span class="rate">{{ fund.rate }}%</span></p>
                  <p class="fund-rate">6개월 수익률: <span class="rate">{{ fund.sixMRate }}%</span></p>
                  <p class="fund-rate">12개월 수익률: <span class="rate">{{ fund.oneYRate }}%</span></p>
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

    // 펀드 목록을 가져오는 비동기 함수
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

    // 세션에서 액세스 토큰을 가져오는 함수
    const getAccessToken = () => {
      const tokenData = JSON.parse(sessionStorage.getItem("token"));
      return tokenData.accessToken;
    };

    // 펀드 카드 클릭 시 상세 페이지로 이동
    const savingsItemClick = (prdNo) => {
      router.push('/itemDetail/fund/' + prdNo);
      console.log(prdNo);
    };

    // 설문조사 페이지로 이동
    const goToSurvey = () => {
      router.push('/survey/start');
    };

    // 위험 등급 텍스트 반환
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

    // 위험 등급에 따른 색상 반환
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

    // 컴포넌트가 마운트될 때 펀드 목록 가져오기
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
  background-color: #DFE7F2; /* 배경 색상 */
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin: 0 auto;
}

.title {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 15px;
  color: #0A3459; /* 제목 색상 */
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
  background-color: #ffffff; /* 카드 배경 색상 */
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
  color: #3C74A6; /* 펀드 이름 색상 */
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
  color: #0A3459; /* 펀드 유형 및 수익률 색상 */
  font-size: 0.9em;
  font-weight: 600;
  margin: 0;
}

.empty-message {
  color: #999; /* 빈 메시지 색상 */
  font-style: italic;
  text-align: center;
  padding: 1em;
  border: 1px dashed #0A3459; /* 경계 색상 */
  border-radius: 8px;
  background-color: #F2F2F2; /* 빈 메시지 배경 색상 */
}

button {
  background-color: #0A3459; /* 버튼 색상 */
  color: white;
  border: none;
  padding: 0.6em 1.2em; /* 버튼 패딩 조정 */
  font-size: 1em;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s;
  margin-top: 1em; /* 버튼과 텍스트 간 간격 */
}

button:hover {
  background-color: #3C74A6; /* 버튼 hover 색상 */
  transform: scale(1.05); /* 버튼 hover 시 확대 효과 */
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
  background-color: #0A3459; /* 등급 아이콘 배경 색상 */
}

.grade-text {
  font-weight: bold;
  margin-top: 0.5em;
  font-size: 0.8em;
}
</style>
