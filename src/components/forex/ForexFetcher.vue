<template>
  <div>
    <slot :exchangeRates="exchangeRates"></slot>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      exchangeRates: [],
    };
  },
  mounted() {
    this.fetchExchangeRates();
    this.trackPageVisit();
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
        const response = await axios.get(
          `http://localhost:9000/forex/date/${formattedDate}`
        );
        this.exchangeRates = response.data;
      } catch (error) {
        console.error('환율 데이터를 가져오는 중 오류 발생:', error);
      }
    },
    async trackPageVisit() {
      try {
        const tokenData = JSON.parse(sessionStorage.getItem('token'));
        const accessToken = tokenData?.accessToken;

        await axios.post(
          `http://localhost:9000/exp`,
          {
            page: 'forex', // 현재 페이지 이름
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
    },
  },
};
</script>
