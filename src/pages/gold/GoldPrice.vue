<template>
  <div class="mt-4 text-center">
    <h1 class="text-title">Gold Price</h1>

    <div
      class="d-flex justify-content-between mb-4 mx-auto"
      style="max-width: 600px"
    >
      <div class="info-box">
        <div class="text-center">
          <span class="info-date">{{ formatDate(lastestDate) }}</span>
          <p class="info-price">{{ formattedLastestPrice }} /KG</p>
        </div>
      </div>

      <div class="info-box">
        <div class="text-center">
          <input
            type="date"
            v-model="selectedDate"
            @change="fetchPriceByDate"
            class="form-control text-center"
          />
          <p class="info-price">{{ formattedPointPrice }} /KG</p>
        </div>
      </div>
    </div>

    <div class="chart-container">
      <div class="d-flex justify-content-start mb-3">
        <button type="button" class="btn" @click="setPeriod(180)">6개월</button>
        <button type="button" class="btn" @click="setPeriod(365)">1년</button>
        <button type="button" class="btn" @click="setPeriod(1095)">3년</button>
      </div>
      <div class="text-right">
        <span class="gold-label">금 시세</span>
        <span class="predicted-label">예측 금 시세</span>
      </div>
      <div class="chart-wrapper" style="margin: 0 auto">
        <canvas id="goldChart" v-if="goldData.length"></canvas>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { Chart, registerables } from 'chart.js';
export default {
  data() {
    return {
      endBasDt: '', // 기준 날짜
      numOfRows: 0, // 데이터 양(일수)
      goldData: [], // 금 시세 데이터 배열
      goldJsonData: '', // JSON 형태로 저장할 데이터
      predictedGoldData: [], //예측 금 값 데이터 배열
      predictedGoldJsonData: '',
      chart: null, // Chart.js 인스턴스
      pointDate: '',
      pointPrice: 0,
      lastestDate: '',
      lastestPrice: 0,
      selectedDate: '',
    };
  },
  computed: {
    formattedLastestPrice() {
      return this.lastestPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },
    formattedPointPrice() {
      return this.pointPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },
  },
  methods: {
    formatDate(dateString) {
      // dateString이 문자열인지 확인하고, 숫자일 경우 문자열로 변환
      if (typeof dateString !== 'string') {
        dateString = String(dateString);
      }

      // YYYYMMDD 형식인지 확인
      const regex = /^\d{8}$/; // 8자리 숫자
      if (!regex.test(dateString)) {
        return '날짜 없음'; // 기본값 반환
      }

      // YYYYMMDD 형식에서 Date 객체 생성
      const year = parseInt(dateString.slice(0, 4), 10);
      const month = parseInt(dateString.slice(4, 6), 10) - 1; // 월은 0부터 시작하므로 -1
      const day = parseInt(dateString.slice(6, 8), 10);

      const date = new Date(year, month, day);

      // 유효한 날짜인지 확인
      if (isNaN(date.getTime())) {
        return '날짜 없음'; // 기본값 반환
      }

      // YYYY.MM.DD 형식으로 변환
      const formattedMonth = String(date.getMonth() + 1).padStart(2, '0');
      const formattedDay = String(date.getDate()).padStart(2, '0');

      return `${year}.${formattedMonth}.${formattedDay}`;
    },
    setPeriod(days) {
      this.numOfRows = days;
      this.endBasDt = this.getTodayInYYMMDD();
      this.fetchGoldData();
      this.fetchPredictedGoldPrice();
    }, //controller의 gold/info를 가져오는 함수
    async fetchGoldData() {
      try {
        const response = await axios.get('http://localhost:9000/gold/info', {
          params: { endBasDt: this.endBasDt, numOfRows: this.numOfRows },
        });

        this.goldData = response.data;

        this.lastestDate = this.goldData[this.goldData.length - 1].basDt;
        this.lastestPrice = this.goldData[this.goldData.length - 1].clpr;

        // 데이터 양 업데이트
        this.numOfRows = this.goldData.length;

        // 차트 렌더링
        this.$nextTick(() => {
          this.renderChart();
        });
      } catch (error) {
        console.error('Error fetching gold data:', error);
      }
    },

    async fetchPriceByDate() {
      if (this.selectedDate) {
        const formattedDate = this.selectedDate.replace(/-/g, ''); // YYYYMMDD 형식으로 변환
        const data = this.goldData.find(
          (item) => item.basDt === Number(formattedDate)
        );
        this.pointPrice = data ? data.clpr : '데이터 없음';
      } else {
        this.pointPrice = '데이터 없음'; // 선택된 날짜가 없을 때의 처리
      }
    },
    getPriceByDate(date) {
      const data = this.goldData.find((item) => item.basDt === date);
      return data ? data.clpr : '데이터 없음';
    },
    //예측된 금 값을 받아오는 함수
    async fetchPredictedGoldPrice() {
      try {
        const response = await axios.get('http://localhost:9000/gold/predict');
        const predictedData = response.data;
        // 로컬 스토리지에 저장
        localStorage.setItem(
          'predictedGoldData',
          JSON.stringify(predictedData, null, 2)
        );
        // 필요에 따라 상태 업데이트
        this.predictedGoldData = predictedData;
      } catch (error) {
        console.error('Error fetching predicted gold price:', error);
      }
    },
    async getLastGoldData() {
      try {
        const response = await axios.get('http://localhost:9000/gold/info', {
          params: {
            endBasDt: this.endBasDt,
            numOfRows: 1,
          },
        });

        if (response.data) {
          this.lastGoldDate = response.data[0].basDt;
        }
      } catch (error) {
        console.error('Error fetching gold data:', error);
      }
    },
    //차트 그리기(로컬스토리지에서 받아온 데이터로 그림)
    async renderChart() {
      const self = this; // Vue 인스턴스의 this를 self로 바인딩
      if (!self.goldData.length || !self.predictedGoldData.length) return;

      const combinedData = [];
      self.goldData.forEach((item) => {
        combinedData.push({
          basDt: item.basDt,
          price: item.clpr,
          isPredicted: false,
        });
      });
      self.predictedGoldData.forEach((item) => {
        combinedData.push({
          price: item.dayPrc,
          basDt: item.pbasDt,
          isPredicted: true,
        });
      });

      combinedData.sort((a, b) => new Date(a.basDt) - new Date(b.basDt));
      const labels = combinedData.map((item) => item.basDt);
      const prices = combinedData.map((item) => item.price);

      const canvas = document.getElementById('goldChart');
      if (!canvas) {
        console.error('Canvas not found');
        return;
      }
      const ctx = canvas.getContext('2d');
      if (self.chart) {
        self.chart.destroy();
      }
      Chart.register(...registerables);

      const actualPrices = self.goldData.map((item) => item.clpr);
      const minIndex = actualPrices.indexOf(Math.min(...actualPrices));
      const maxIndex = actualPrices.indexOf(Math.max(...actualPrices));
      const canvasResolution = (canvas.width * canvas.height) / 1000;
      const size = canvasResolution * 0.05;
      const pointRadius = size > 3 ? 3 : size;

      self.chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            {
              label: '',
              data: prices,
              pointBackgroundColor: (ctx) => {
                const index = ctx.dataIndex;
                return index === maxIndex
                  ? 'red'
                  : index === minIndex
                  ? 'blue'
                  : 'rgba(0, 0, 0, 0)';
              },
              pointRadius: (ctx) => {
                const index = ctx.dataIndex;
                return index === minIndex || index === maxIndex ? 4 : 0;
              },
              pointHoverRadius: (ctx) => {
                const index = ctx.dataIndex;
                return index === minIndex || index === maxIndex
                  ? pointRadius * 1.5
                  : 0;
              },
              segment: {
                borderColor: (ctx) => {
                  const isPredict = combinedData[ctx.p0DataIndex].isPredicted;
                  return isPredict
                    ? 'rgba(66, 245, 81, 1)'
                    : 'rgba(245, 194, 66, 1)';
                },
                backgroundColor: (ctx) => {
                  const isPredict = combinedData[ctx.p0DataIndex].isPredicted;
                  return isPredict
                    ? 'rgba(66, 245, 81, 0.1)'
                    : 'rgba(245, 194, 66, 0.1)';
                },
              },
            },
          ],
        },
        options: {
          responsive: true,
          animation: false,
          plugins: {
            tooltip: {
              enabled: true,
              mode: 'index',
              intersect: false,
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              titleColor: 'white',
              bodyColor: 'white',
              callbacks: {
                title: (tooltipItems) => {
                  const date = tooltipItems[0].label;
                  return date.replace(/(\d{4})(\d{2})(\d{2})/, '$1.$2.$3'); // 날짜 형식 변환
                },
                label: (tooltipItem) => {
                  const price = tooltipItem.raw;
                  const formattedPrice = `가격: ${price
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;

                  const currentDate = tooltipItem.label; // currentDate가 YYYYMMDD 형식인지 확인
                  console.log(`Current Date: ${currentDate}`); // 확인용 로그

                  // YYYYMMDD 형식에서 Date 객체로 변환
                  const parsedCurrentDate = new Date(
                    currentDate.slice(0, 4), // 연도
                    currentDate.slice(4, 6) - 1, // 월 (0부터 시작)
                    currentDate.slice(6, 8) // 일
                  );

                  // 유효한 날짜인지 확인
                  if (isNaN(parsedCurrentDate.getTime())) {
                    console.error('Invalid currentDate:', currentDate);
                    return [formattedPrice, '유효하지 않은 날짜입니다.'];
                  }

                  // 날짜 계산
                  const oneDayAgo = new Date(parsedCurrentDate);
                  oneDayAgo.setDate(parsedCurrentDate.getDate() - 1);

                  const oneMonthAgo = new Date(parsedCurrentDate);
                  oneMonthAgo.setMonth(parsedCurrentDate.getMonth() - 1);

                  const sixMonthsAgo = new Date(parsedCurrentDate);
                  sixMonthsAgo.setMonth(parsedCurrentDate.getMonth() - 6);

                  const oneYearAgo = new Date(parsedCurrentDate);
                  oneYearAgo.setFullYear(parsedCurrentDate.getFullYear() - 1);

                  // YYYYMMDD 형식으로 변환
                  const oneDayAgoStr = oneDayAgo
                    .toISOString()
                    .slice(0, 10)
                    .replace(/-/g, '');
                  const oneMonthAgoStr = oneMonthAgo
                    .toISOString()
                    .slice(0, 10)
                    .replace(/-/g, '');
                  const sixMonthsAgoStr = sixMonthsAgo
                    .toISOString()
                    .slice(0, 10)
                    .replace(/-/g, '');
                  const oneYearAgoStr = oneYearAgo
                    .toISOString()
                    .slice(0, 10)
                    .replace(/-/g, '');

                  // 로컬 스토리지에서 데이터 검색
                  const oneDayAgoPriceData =
                    this.findPriceDataByDate(oneDayAgoStr);
                  const oneMonthAgoPriceData =
                    this.findPriceDataByDate(oneMonthAgoStr);
                  const sixMonthsAgoPriceData =
                    this.findPriceDataByDate(sixMonthsAgoStr);
                  const oneYearAgoPriceData =
                    this.findPriceDataByDate(oneYearAgoStr);

                  const changes = [];
                  if (oneYearAgoPriceData) {
                    const yearChange = price - oneYearAgoPriceData.clpr;
                    changes.push(
                      `1년 전 대비: ${
                        yearChange >= 0 ? '+' : ''
                      }${yearChange.toLocaleString()}원`
                    );
                  } else {
                    changes.push('1년 전 데이터 없음');
                  }
                  if (sixMonthsAgoPriceData) {
                    const sixMonthsChange = price - sixMonthsAgoPriceData.clpr;
                    changes.push(
                      `6개월 전 대비: ${
                        sixMonthsChange >= 0 ? '+' : ''
                      }${sixMonthsChange.toLocaleString()}원`
                    );
                  } else {
                    changes.push('6개월 전 데이터 없음');
                  }
                  if (oneMonthAgoPriceData) {
                    const monthChange = price - oneMonthAgoPriceData.clpr;
                    changes.push(
                      `1개월 전 대비: ${
                        monthChange >= 0 ? '+' : ''
                      }${monthChange.toLocaleString()}원`
                    );
                  } else {
                    changes.push('1개월 전 데이터 없음');
                  }
                  if (oneDayAgoPriceData) {
                    const dayChange = price - oneDayAgoPriceData.clpr;
                    changes.push(
                      `하루 전 대비: ${
                        dayChange >= 0 ? '+' : ''
                      }${dayChange.toLocaleString()}원`
                    );
                  } else {
                    changes.push('하루 전 데이터 없음');
                  }

                  return [formattedPrice, ...changes];
                },
              },
            },
          },
          scales: {
            x: {
              title: {
                display: true,
                text: '날짜',
              },
            },
            y: {
              title: {
                display: true,
                text: '종가',
              },
            },
          },
        },
      });
    },
    loadGoldDataFromLocalStorage() {
      const storedData = localStorage.getItem('goldData'); // 로컬 스토리지에서 데이터 가져오기
      if (storedData) {
        this.goldData = JSON.parse(storedData); // JSON 문자열을 객체로 변환
      } else {
        console.error('No data found in local storage');
      }
    },
    // 특정 날짜에서 daysBefore 만큼 이전 날짜의 시세를 찾는 함수
    findPriceDataByDate(targetDateStr) {
      return (
        this.goldData.find((item) => item.basDt === Number(targetDateStr)) ||
        null
      );
    },

    getTodayInYYMMDD() {
      const today = new Date();
      const year = String(today.getFullYear()).slice(-2);
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      return `${year}${month}${day}`;
    },

    mounted() {
      this.setPeriod(365);

      const storedData = localStorage.getItem('goldData');
      const storedPredictedData = localStorage.getItem('predictedGoldData');
      const loadGoldData = async () => {
        if (storedData) {
          const lastElement =
            JSON.parse(storedData)[JSON.parse(storedData).length - 1];
          if (lastElement) {
            const lastBasDt = lastElement.basDt;
            console.log('마지막 basDt:', lastBasDt);
            if (lastBasDt == this.lastGoldDate) {
              this.goldData = JSON.parse(storedData);
              // 최신 날짜와 가격 설정
              this.lastestDate = this.goldData[this.goldData.length - 1].basDt;
              this.lastestPrice = this.goldData[this.goldData.length - 1].clpr;
            } else {
              this.endBasDt = this.getTodayInYYMMDD();
              this.numOfRows = 365; // 1년
              await this.fetchGoldData().then(() => {
                console.log('Gold Data after fetching:', this.goldData); // 데이터 확인
                this.renderChart(); // 차트 렌더링
              });
            }
          }
        } else {
          this.endBasDt = this.getTodayInYYMMDD();
          this.numOfRows = 365; // 1년
          await this.fetchGoldData(); // 데이터 가져오기
        }
      };

      const loadPredictedData = async () => {
        if (storedPredictedData) {
          this.predictedGoldData = JSON.parse(storedPredictedData);
        } else {
          console.log('예측 금 시세 데이터가 없습니다.');
          await this.fetchPredictedGoldPrice(); // 예측 데이터 가져오기
        }
      };

      // 데이터 로드 후 차트 렌더링
      Promise.all([loadGoldData(), loadPredictedData()]).then(() => {
        console.log('Data loaded, rendering chart...'); // 데이터 로드 후 차트 렌더링
        if (this.goldData.length && this.predictedGoldData.length) {
          this.renderChart(); // 차트 렌더링
        }
      });
    },
    beforeUnmount() {
      if (this.chart) {
        this.chart.destroy(); // 차트 인스턴스 정리
      }
    },
  },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');

body {
  font-family: 'Roboto', sans-serif;
}

.container {
  padding: 30px;
  border-radius: 15px; /* 둥근 모서리 */
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1); /* 깊이감 있는 그림자 */
}

.text-title {
  color: #2c3e50;
  font-weight: 800; /* 두꺼운 글씨 */
  font-size: 2.5rem;
  text-transform: uppercase;
  margin-bottom: 30px; /* 여백 추가 */
}

.info-box {
  flex: 1;
  margin: 0 10px;
  padding: 30px;
  background-color: #ffffff;
  border-radius: 15px; /* 더 둥근 모서리 */
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15); /* 부드러운 그림자 */
}

.info-date {
  font-weight: bold;
  color: #112d4e;
  font-size: 1.6rem;
}

.info-price {
  font-weight: bold;
  color: #112d4e;
  font-size: 1.6rem;
}

.chart-container {
  background-color: #ffffff;
  border-radius: 15px; /* 둥근 모서리 */
  padding: 20px;
  border: none; /* 카드 테두리 제거 */
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  margin: 20px auto; /* 중앙 정렬 */
}

.btn {
  background-color: #3f72af; /* 단색 버튼 */
  color: white;
  border: none;
  border-radius: 10px; /* 둥근 모서리 */
  padding: 12px 20px; /* 패딩 조정 */
  margin-right: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease; /* 애니메이션 효과 */
}

.btn:hover {
  background-color: #112d4e; /* Hover 시 색상 변경 */
  transform: scale(1.05); /* Hover 시 크기 증가 */
}

.gold-label,
.predicted-label {
  font-weight: bold;
  font-size: 1.2rem;
  margin: 10px 0;
}

/* 추가 스타일 */
.loading {
  text-align: center;
  font-size: 1.5rem;
  margin-top: 20px;
}

.progress {
  height: 1.5rem;
  border-radius: 20px;
  background-color: #e0e0e0;
}

.progress-bar {
  background-color: #007bff;
  transition: width 0.4s;
}

.gold-label {
  color: rgba(245, 194, 66, 1);
  font-weight: bold;
}

.predicted-label {
  color: rgba(66, 245, 81, 1);
  margin-left: 10px;
  font-weight: bold;
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .container {
    padding: 10px;
  }

  .card {
    margin-bottom: 20px;
  }

  .news-title {
    font-size: 1.3rem;
  }
}
.text-right {
  text-align: right; /* 텍스트를 오른쪽으로 정렬 */
}
</style>
