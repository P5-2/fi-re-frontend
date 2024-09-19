<template>
  <div>
    <h1>Gold Price Data</h1>
    <label for="endBasDt">End Date (기준 날짜): </label>
    <input type="text" v-model="endBasDt" placeholder="YYYYMMDD" />

    <label for="numOfRows">Number of Rows (데이터 양): </label>
    <input type="number" v-model="numOfRows" placeholder="Rows" />

    <button @click="fetchGoldData">Fetch Gold Data</button>

    <div v-if="goldData.length">
      <h2>Gold Prices</h2>
      <pre>{{ jsonData }}</pre> <!-- JSON 형식으로 데이터 출력 -->
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      endBasDt: '', // 기준 날짜
      numOfRows: 0, // 데이터 양
      goldData: [], // 금 시세 데이터 배열
      jsonData: '', // JSON 형태로 저장할 데이터
    };
  },
  methods: {
    async fetchGoldData() {
      try {
        // 백엔드 API로부터 금 시세 데이터 요청
        const response = await axios.get('/gold/info', {
          params: {
            endBasDt: this.endBasDt,
            numOfRows: this.numOfRows,
          },
        });

        // 받아온 금 시세 데이터
        this.goldData = response.data;

        // 데이터를 JSON 형태로 변환
        this.jsonData = JSON.stringify(this.goldData, null, 2);

        // 로컬 스토리지에 JSON 데이터 저장
        localStorage.setItem('goldData', this.jsonData);

        // 데이터 성공적으로 가져옴
        console.log('Gold data fetched and stored as JSON:', this.jsonData);
      } catch (error) {
        console.error('Error fetching gold data:', error);
      }
    },
  },
  mounted() {
    // 로컬 스토리지에서 JSON 데이터 로드
    const storedData = localStorage.getItem('goldData');
    if (storedData) {
      this.jsonData = storedData;
      this.goldData = JSON.parse(storedData); // 로컬 스토리지에서 가져온 데이터를 객체로 파싱
    }
  },
};
</script>

<style scoped>
input {
  margin: 10px;
}

button {
  margin: 10px;
  padding: 5px 10px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

pre {
  background-color: #f4f4f4;
  padding: 10px;
  border-radius: 5px;
  white-space: pre-wrap;
}
</style>
