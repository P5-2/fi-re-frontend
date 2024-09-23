<template>
    <div class="exchange-rate-container">
      <h1 class="title">환율 데이터</h1>
      <table class="exchange-rate-table">
        <thead>
          <tr>
            <th>통화 단위</th>
            <th>매도율 (TTB)</th>
            <th>매입율 (TTS)</th>
            <th>기준율 (Deal Bas Rate)</th>
            <th>은행 고시율 (BKPR)</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="rate in exchangeRates" :key="rate.cur_unit">
            <td>{{ rate.cur_unit }}</td>
            <td>{{ formatCurrency(rate.ttb) }}</td>
            <td>{{ formatCurrency(rate.tts) }}</td>
            <td>{{ formatCurrency(rate.deal_bas_r) }}</td>
            <td>{{ formatCurrency(rate.bkpr) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      exchangeRates: {
        type: Array,
        required: true,
      },
    },
    methods: {
      formatCurrency(value) {
        return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(value);
      },
    },
  };
  </script>
  
  <style scoped>
  .exchange-rate-container {
    padding: 20px;
    max-width: 800px;
    margin: auto;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
  
  .title {
    text-align: center;
    margin-bottom: 20px;
    font-size: 24px;
    color: #333;
  }
  
  .exchange-rate-table {
    width: 100%;
    border-collapse: collapse;
  }
  
  .exchange-rate-table th,
  .exchange-rate-table td {
    padding: 10px;
    text-align: center;
    border: 1px solid #ddd;
  }
  
  .exchange-rate-table th {
    background-color: #4CAF50;
    color: white;
  }
  
  .exchange-rate-table tr:nth-child(even) {
    background-color: #f2f2f2;
  }
  
  .exchange-rate-table tr:hover {
    background-color: #ddd;
  }
  </style>
  