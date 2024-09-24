<template>
  <div class="exchange-rate-container">
    <h2 class="main-currencies">주요 통화</h2>
    <div class="highlighted-currencies">
      <div class="currency-list">
        <div
          v-for="currency in mainCurrencies"
          :key="currency.curUnit"
          class="currency-item"
        >
          <h3>{{ currency.curNm }} ({{ currency.curUnit }})</h3>
          <p>매도율: <strong>{{ formatCurrency(currency.ttb) }}</strong></p>
          <p>매입율: <strong>{{ formatCurrency(currency.tts) }}</strong></p>
          <p>기준율: <strong>{{ formatCurrency(currency.dealBasR) }}</strong></p>
          <p>10일환가료율: <strong>{{ currency.tenDdEfeeR }}%</strong></p>
        </div>
      </div>
    </div>

    <h1 class="title">환율 데이터</h1>
    <table class="exchange-rate-table">
      <thead>
        <tr>
          <th>통화명</th>
          <th>통화 단위</th>
          <th>매도율 (TTB)</th>
          <th>매입율 (TTS)</th>
          <th>기준율 (Deal Bas Rate)</th>
          <th>10일환가료율</th>
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
            <td>{{ rate.tenDdEfeeR }}%</td>
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
      mainCurrencies: [], // 주요 통화 리스트
    };
  },
  mounted() {
    this.fetchExchangeRates();
  },
  computed: {
    // 주요 통화 (USD, EUR, JPY)
    sortedExchangeRates() {
      const majorCurrencies = ['USD', 'EUR', 'JPY'];
      const majorRates = this.exchangeRates.filter(rate => majorCurrencies.includes(rate.curUnit));
      const otherRates = this.exchangeRates.filter(rate => !majorCurrencies.includes(rate.curUnit));

      return [...majorRates, ...otherRates]; // 주요 통화를 먼저, 나머지를 그 다음에
    }
  },
  methods: {
    async fetchExchangeRates() {
      try {
        // 오늘 날짜를 가져오고 하루 전 날짜를 계산
        const today = new Date();
        today.setDate(today.getDate());

        // 날짜를 'yyyyMMdd' 형식으로 변환
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0'); // 0부터 시작하므로 +1
        const day = String(today.getDate()).padStart(2, '0');
        const formattedDate = `${year}${month}${day}`;

        // API 호출
        const response = await axios.get(`http://localhost:9000/forex/date/${formattedDate}`);
        this.exchangeRates = response.data;

        // 주요 통화 데이터를 설정
        this.mainCurrencies = response.data.filter(rate => ['USD', 'EUR', 'JPY(100)'].includes(rate.curUnit));
      } catch (error) {
        console.error('환율 데이터를 가져오는 중 오류 발생:', error);
      }
    },
    formatCurrency(value) {
      return new Intl.NumberFormat().format(value);
    }
  },
};
</script>

<style>
.exchange-rate-container {
  max-width: 800px;
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
  background-color: #f9f9f9;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
}

.currency-list {
  display: flex;
  justify-content: space-around; /* 균등하게 배치 */
  flex-wrap: wrap; /* 줄 바꿈 허용 */
}

.currency-item {
  margin: 10px;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  width: 150px; /* 고정 너비 설정 */
  text-align: center; /* 중앙 정렬 */
  background-color: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
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
  margin-top: 20px;
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
    width: 120px; /* 모바일에서의 너비 조정 */
  }
}
</style>
