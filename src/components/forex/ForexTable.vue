<template>
  <div class="exchange-rate-container">
    <!-- <h2 class="main-currencies">주요 통화</h2> -->
    <div class="highlighted-currencies">
      <div class="currency-list">
        <div v-for="currency in mainCurrencies" :key="currency.curUnit" class="currency-item">
          <div class="flag-container">
            <img :src="getFlagUrl(currency.curUnit)" alt="국기" class="flag-icon" />
          </div>
          <div class="currency-info">
            <h3>{{ currency.curNm }} ({{ currency.curUnit }})</h3>
            <p>매도율: <strong>{{ formatCurrency(currency.ttb) }}</strong></p>
            <p>매입율: <strong>{{ formatCurrency(currency.tts) }}</strong></p>
            <p>기준율: <strong>{{ formatCurrency(currency.dealBasR) }}</strong></p>
          </div>
        </div>
      </div>
    </div>
    <!-- 기준 일자 및 요청 일자 -->
    <div class="dateInfo">
      <p>기준 일자: <strong>{{ searchDate }}</strong></p>
      <p>요청 일자: <strong>{{ formattedRequestDate }}</strong></p>
    </div>

    <!-- <h1 class="title">환율 데이터</h1> -->
    <table class="exchange-rate-table">
      <thead>
        <tr>
          <th>통화명</th>
          <th>통화 단위</th>
          <th>매도율 (TTB)</th>
          <th>매입율 (TTS)</th>
          <th>기준율 (Deal Bas Rate)</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="rate in sortedExchangeRates" :key="rate.curUnit">
          <tr v-if="rate.curUnit !== 'KRW'">
            <td>{{ rate.curNm }}</td>
            <td>{{ rate.curUnit }}</td>
            <td>{{ formatCurrency(rate.ttb) }}</td>
            <td>{{ formatCurrency(rate.tts) }}</td>
            <td>{{ formatCurrency(rate.dealBasR) }}</td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      exchangeRates: [],
      mainCurrencies: [],
      searchDate: '', // 기준 일자
      formattedRequestDate: '', // 요청 일자
    };
  },
  mounted() {
    this.fetchExchangeRates();
  },
  computed: {
    sortedExchangeRates() {
      const majorCurrencies = ['USD', 'EUR', 'JPY(100)'];
      const majorRates = this.exchangeRates.filter(rate => majorCurrencies.includes(rate.curUnit));
      const otherRates = this.exchangeRates.filter(rate => !majorCurrencies.includes(rate.curUnit));

      return [...majorRates, ...otherRates];
    }
  },
  methods: {
    async fetchExchangeRates() {
      try {
        const today = new Date();
        today.setDate(today.getDate());
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const formattedDate = `${year}${month}${day}`;

        const response = await axios.get(`http://localhost:9000/forex/date/${formattedDate}`);
        this.exchangeRates = response.data;
        this.searchDate = response.data[0]?.searchDate || formattedDate; // 첫 번째 데이터에서 기준 일자 가져오기
        this.mainCurrencies = response.data.filter(rate => ['USD', 'EUR', 'JPY(100)'].includes(rate.curUnit));
        // 요청 일자 포맷팅
        this.formattedRequestDate = `${year}-${month}-${day}`;
      } catch (error) {
        console.error('환율 데이터를 가져오는 중 오류 발생:', error);
      }

    },
    getFlagUrl(curUnit) {
      const flags = {
        'USD': 'https://flagcdn.com/us.svg',
        'EUR': 'https://flagcdn.com/eu.svg',
        'JPY(100)': 'https://flagcdn.com/jp.svg',
      };
      return flags[curUnit] || '';
    },
    formatCurrency(value) {
      return new Intl.NumberFormat().format(value);
    }
  },
};
</script>

<style>
.exchange-rate-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.main-currencies {
  font-size: 24px;
  margin-bottom: 10px;
  color: #333;
  text-align: center;
}

.highlighted-currencies {
  background-color: white;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
}

.currency-list {
  display: flex;
  /* 가로로 나열 */
  flex-wrap: wrap;
  /* 줄 바꿈 허용 */
  justify-content: space-between;
  /* 균등하게 배치 */
}

.currency-item {
  margin: 10px;
  /* 간격 설정 */
  padding: 15px;
  background-color: #f5df65;
  border: 1px solid #ddd;
  border-radius: 8px;
  width: calc(33% - 20px);
  /* 3개가 한 줄에 배치되도록 조정 */
  display: flex;
  /* 플렉스 박스 사용 */
}

.flag-container {
  margin-right: 10px;
  /* 국기와 텍스트 사이의 간격 */
}

.flag-icon {
  width: 60px;
  /* 국기 이미지 크기 조정 */
  height: auto;
}

.currency-info {
  display: flex;
  flex-direction: column;
  /* 정보 세로 방향으로 정렬 */
}

.title {
  font-size: 28px;
  margin-top: 30px;
  margin-bottom: 20px;
  color: #333;
  text-align: center;
}

.exchange-rate-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 70px;
}

.exchange-rate-table th,
.exchange-rate-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.exchange-rate-table th {
  background-color: #f2f2f2;
  font-weight: bold;
}

.exchange-rate-table tr:hover {
  background-color: #f1f1f1;
}

@media (max-width: 600px) {
  .exchange-rate-table {
    font-size: 14px;
  }

  .main-currencies,
  .title {
    font-size: 20px;
  }

  .currency-item {
    width: 100%;
    /* 모바일에서 전체 너비 사용 */
  }
}
</style>
