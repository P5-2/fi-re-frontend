<template>
  <div class="exchange-rate-container">
    <!-- 기준 일자 및 요청 일자 -->
    <div class="date-info">
      <p style="margin-bottom: 1px;">기준 일자: <strong>{{ searchDate }}</strong></p>
      <p style="font-size: 13px;">기준 일자는 현재 날짜와 차이가 있을 수 있습니다</p>
    </div>

    <!-- 주요 통화 -->
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

    <!-- 나머지 통화들 -->
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
      searchDate: '',
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
        const formattedDate = today.toISOString().split('T')[0].replace(/-/g, '');

        const response = await axios.get(`http://localhost:9000/forex/date/${formattedDate}`);
        this.exchangeRates = response.data;

        if (this.exchangeRates.length > 0) {
          this.searchDate = this.exchangeRates[0].searchDate || formattedDate;
          this.mainCurrencies = this.exchangeRates.filter(rate => ['USD', 'EUR', 'JPY(100)'].includes(rate.curUnit));
        }
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
  padding: 25px;
  background-color: #f9f9f9;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  font-family: 'Roboto', sans-serif;
}

.highlighted-currencies {
  background-color: #DBE2EF;
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 30px;
  width: 100%; /* 부모 컴포넌트의 너비만큼 설정 */
  /* box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1); */
}


.currency-list {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  justify-content: center;
}

.currency-item {
  width: 30%;
  padding: 15px;
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s ease-in-out;
}

.currency-item:hover {
  transform: scale(1.05);
}

.flag-container {
  margin-right: 15px;
}

.flag-icon {
  width: 50px;
  height: auto;
  border-radius: 5px;
}

.currency-info {
  display: flex;
  flex-direction: column;
  text-align: left; /* 좌측 정렬 적용 */
}

.currency-info h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.currency-info p {
  margin: 4px 0;
  font-size: 14px;
  color: #666;
}

.date-info {
  text-align: left;
  margin-bottom: 20px;
}

.date-info p {
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.exchange-rate-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 16px;
  margin-top: 30px;
}

.exchange-rate-table th,
.exchange-rate-table td {
  padding: 12px 20px;
  text-align: center;
  border-bottom: 1px solid #e0e0e0;
}

.exchange-rate-table th {
  background-color: #f0f0f0;
  font-weight: bold;
  text-transform: uppercase;
}

.exchange-rate-table tr:hover {
  background-color: #f9f9f9;
}

@media (max-width: 768px) {
  .currency-item {
    width: 45%;
  }

  .exchange-rate-table {
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .currency-item {
    width: 100%;
  }

  .exchange-rate-table th,
  .exchange-rate-table td {
    padding: 10px;
  }
}
</style>
