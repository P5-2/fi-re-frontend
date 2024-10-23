<template>
  <div class="recommend-container">
    <!-- 사용된 키워드 출력 -->
    <div v-if="usedKeywords.length" class="keywords-section">
      <h3 class="title">예금 추천 키워드</h3>
      <ul class="keyword-list">
        <li v-for="(keyword, index) in usedKeywords" :key="index" class="hashtag">{{ keyword }}</li>
      </ul>
    </div>

    <div class="deposit-section">
      <div v-if="depositList.length">
        <div v-for="(deposit, index) in depositList" :key="index" class="deposit-card"
          @click="savingsItemClick(deposit)">
          <img :src="getIcon(deposit.korCoNm)" alt="Deposit Icon" class="icon" />
          <div class="deposit-info">
            <h3 class="deposit-name">{{ deposit.finPrdtNm }}</h3>
            <p class="deposit-rate">
              기본 금리: <span class="rate">{{ deposit.intrRate }}%</span>, 최고 <span class="rate">{{ deposit.intrRate2
                }}%</span>
            </p>
            <p class="deposit-period">
              기간: <span class="period">{{ deposit.saveTrm }}개월</span>
            </p>
          </div>
        </div>
      </div>
      <div v-else>
        <div class="empty-message">
          <p>추천할 예금 상품이 없습니다.</p>
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

import DefaultIcon from '@/assets/bank/defaultbank.png';

export default {
  name: "DepositRecommendations",
  setup() {
    const depositList = ref([]);
    const usedKeywords = ref([]);
    const router = useRouter();
    const iconMap = ref({});

    const getBankIcon = async (bankName) => {
      const formats = ['png', 'jpg'];
      for (const format of formats) {
        try {
          const icon = await import(`@/assets/bank/${bankName}.${format}`);
          return icon.default;
        } catch (error) {
        }
      }
      return DefaultIcon;
    };

    const loadIcons = async () => {
      const banks = [
        '국민은행',
        '우리은행',
        '신한은행',
        '하나은행',
        '한국스탠다드차타드은행',
        '아이엠뱅크',
        '부산은행',
        '광주은행',
        '제주은행',
        '전북은행',
        '경남은행',
        '중소기업은행',
        '한국산업은행',
        '농협은행주식회사',
        '주식회사 케이뱅크',
        '수협은행',
        '주식회사 카카오뱅크',
        '토스뱅크 주식회사',
        '상상인플러스저축은행',
      ];

      const promises = banks.map(async (bank) => {
        iconMap.value[bank] = await getBankIcon(bank); 
      });

      await Promise.all(promises);
    };

    const fetchDeposits = async () => {
      const accessToken = getAccessToken();
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      try {
        const response = await axios.get('http://localhost:9000/recommend/deposit', config);
        depositList.value = response.data.savingsDeposits; 
        usedKeywords.value = response.data.usedKeywords; 
        console.log("deposits: ", depositList.value);
      } catch (error) {
        console.error("Error fetching deposits:", error);
      }
    };

    const getAccessToken = () => {
      const tokenData = JSON.parse(sessionStorage.getItem("token"));
      return tokenData?.accessToken;
    };

    const goToSurvey = () => {
      router.push('/survey/start');
    };

    const savingsItemClick = (deposit) => {
      router.push(`/itemDetail/savings/${deposit.finPrdtCd}/${deposit.intrRateTypeNm}/${null}`);
    };

    const getIcon = (bname) => {
      return iconMap.value[bname] || DefaultIcon; 
    };

    onMounted(() => {
      loadIcons();
      fetchDeposits();
    });

    return {
      depositList,
      usedKeywords,
      iconMap,
      goToSurvey,
      getIcon,
      savingsItemClick,
    };
  }
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

.deposit-section {
  display: flex;
  flex-direction: column;
  gap: 1em;
}

.deposit-card {
  display: flex;
  align-items: center;
  border: none;
  padding: 0.5em;
  border-radius: 12px;
  background-color: #ffffff;
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
  width: 100%;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  margin-bottom: 10px;
}

.deposit-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.icon {
  width: 60px;
  height: auto;
  margin-right: 20px;
}

.deposit-info {
  flex-grow: 1;
  text-align: left;
}

.deposit-name {
  margin: 0;
  font-size: 1.4em;
  font-weight: 700;
  color: #007BFF;
}

.deposit-rate,
.deposit-period {
  color: #0A3459;
  font-size: 0.9em;
  margin-bottom: 8px;
}

.rate {
  font-weight: bold;
  color: #333;
}

.period {
  font-style: italic;
  color: #007BFF;
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

.keywords-section {
  margin-top: 20px;
}

.keyword-list {
  display: flex;
  flex-wrap: wrap;
}

.hashtag {
  display: inline-block;
  background-color: #3C74A6;
  border-radius: 12px;
  padding: 6px 12px;
  margin-right: 6px;
  margin-top: 5px;
  font-size: 14px;
  color: #F2F2F2;
  transition: background-color 0.3s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}


.hashtag:hover {
  background-color: #d1d1d1;
}
</style>
