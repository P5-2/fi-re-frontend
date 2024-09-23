<template>
  <div class="container mt-4">
    <!-- 금 시세 정보 블록 -->
    <div class="card bg-light mb-4">
      <div class="card-body d-flex justify-content-between">
        <div>
          <h1>금 시세</h1>
          <p><strong>국내 금 9.99Kg</strong></p>
          <div class="d-flex justify-content-between">
            <div>
              <p>
                최신 날짜: <strong>{{ lastestDate }}</strong>
              </p>
              <p>
                최신 시세: <strong>{{ lastestPrice }}</strong> /KG
              </p>
            </div>
            <div>
              <p>
                기준 날짜: <strong>{{ pointDate }}</strong>
              </p>
              <p>
                기준 시세: <strong>{{ pointPrice }}</strong> /KG
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 날짜 및 데이터 양 입력 블록 -->
    <div class="card bg-light mb-4">
      <div class="card-body">
        <div class="mb-3 d-flex justify-content-center">
          <div class="me-2">
            <label for="pointDate">기준 날짜 (YYYYMMDD):</label>
            <input
              type="text"
              v-model="pointDate"
              class="form-control"
              placeholder="20240807"
            />
          </div>
          <div class="me-2">
            <label for="numOfRows" class="d-block">데이터 양:</label>
            <input
              type="number"
              v-model="numOfRows"
              class="form-control"
              readonly
            />
          </div>
          <button @click="fetchGoldData" class="btn btn-primary align-self-end">
            데이터 출력
          </button>
        </div>
      </div>
    </div>

    <!-- 차트 블록 -->
    <div class="card bg-light mb-4">
      <div class="card-body">
        <div class="text-center mb-3">
          <button
            type="button"
            class="btn btn-primary me-2"
            @click="setPeriod(180)"
          >
            6개월
          </button>
          <button
            type="button"
            class="btn btn-primary me-2"
            @click="setPeriod(365)"
          >
            1년
          </button>
          <button
            type="button"
            class="btn btn-primary"
            @click="setPeriod(1095)"
          >
            3년
          </button>
        </div>
        <!-- 금 시세 차트 -->
        <h2 class="text-center">Gold Prices</h2>
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
    };
  },
  methods: {
    setPeriod(days) {
      this.numOfRows = days;
      this.endBasDt = this.getTodayInYYMMDD();
      this.fetchGoldData();
      this.fetchPredictedGoldPrice();
    },
    //controller의 gold/info를 가져오는 함수
    async fetchGoldData() {
      try {
        const response = await axios.get('http://localhost:9000/gold/info', {
          params: {
            endBasDt: this.endBasDt,
            numOfRows: this.numOfRows,
          },
        });
        this.goldData = response.data;

        // 최신 날짜 업데이트
        if (this.goldData.length) {
          this.pointDate = this.goldData[0].basDt; // 최신 날짜
          this.pointPrice = this.goldData[0].clpr; // 최신 가격
        }
        this.lastestDate = this.goldData[this.goldData.length - 1].basDt;
        this.lastestPrice = this.goldData[this.goldData.length - 1].clpr;

        // 데이터 양 업데이트
        this.numOfRows = this.goldData.length;
        this.goldJsonData = JSON.stringify(this.goldData, null, 2);
        localStorage.setItem('goldData', this.goldJsonData);

        // 금 시세 차트를 업데이트
        this.$nextTick(() => {
          this.renderChart();
        });
      } catch (error) {
        console.error('Error fetching gold data:', error);
      }
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
        console.log('last gold data:', response.data[0]);
        if (response.data) {
          this.lastGoldDate = response.data[0].basDt;
        }
      } catch (error) {
        console.error('Error fetching gold data:', error);
      }
    },
    //차트 그리기(로컬스토리지에서 받아온 데이터로 그림)
    async renderChart() {
      // 데이터가 없으면 리턴
      if (!this.goldData.length || !this.predictedGoldData.length) return;
      const combinedData = [];
      // 기존 금 시세 데이터 추가
      this.goldData.forEach((item) => {
        combinedData.push({
          basDt: item.basDt,
          price: item.clpr,
          isPredicted: false,
        });
      });
      // 예측된 금 시세 데이터 추가
      this.predictedGoldData.forEach((item) => {
        combinedData.push({
          price: item.dayPrc,
          basDt: item.pbasDt,
          isPredicted: true,
        });
      });
      // 날짜 기준으로 정렬
      combinedData.sort((a, b) => new Date(a.basDt) - new Date(b.basDt));
      const labels = combinedData.map((item) => item.basDt);
      const prices = combinedData.map((item) => item.price);
      const canvas = document.getElementById('goldChart');
      if (!canvas) {
        console.error('Canvas not found');
        return; // canvas가 존재하지 않으면 종료
      }
      const ctx = canvas.getContext('2d');
      if (this.chart) {
        this.chart.destroy();
      }
      Chart.register(...registerables);
      const actualPrices = this.goldData.map((item) => item.clpr);
      const minIndex = actualPrices.indexOf(Math.min(...actualPrices));
      const maxIndex = actualPrices.indexOf(Math.max(...actualPrices));
      const canvasResolution = (canvas.width * canvas.height) / 1000;
      const size = canvasResolution * 0.05;
      const pointRadius = size > 2.25 ? 2.25 : size;
      // const today = this.getTodayInYYMMDD(); // 오늘 날짜 (YYYY-MM-DD 형식)
      this.chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            {
              label: '금 시세',
              // data: combinedData.map(item => item.price),
              // borderColor: combinedData.map(item => item.isPredicted ? 'rgba(66, 245, 81, 1)' : 'rgba(245, 194, 66, 1)'),
              // backgroundColor: combinedData.map(item => item.isPredicted ? 'rgba(66, 245, 81, 0.1)' : 'rgba(245, 194, 66, 0.1)'),
              data: prices,
              borderColor: 'rgba(245, 194, 66, 1)',
              backgroundColor: 'rgba(245, 194, 66, 0.1)',
              fill: true,
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
                return index === minIndex || index === maxIndex
                  ? pointRadius
                  : 0;
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
              backgroundColor: 'rgba(0, 0, 0, 0.7)', // 툴팁 배경색
              titleColor: 'white', // 툴팁 제목 색상
              bodyColor: 'white', // 툴팁 본문 색상
              callbacks: {
                title: function (tooltipItems) {
                  const date = tooltipItems[0].label;
                  //  "2024.07.08" 형태로 변환
                  return date.replace(/(\d{4})(\d{2})(\d{2})/, '$1.$2.$3');
                },
                label: function (tooltipItem) {
                  // 툴팁에 가격 표시
                  const price = tooltipItem.raw; // 해당 데이터 포인트의 가격
                  // "100,000" 형태로 변환
                  return `가격: ${price
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
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
        plugins: [
          {
            afterDraw: (chart) => {
              const ctx = chart.ctx;
              ctx.fillStyle = 'blue';
              ctx.fillText(
                `최저점: ${prices[minIndex].toLocaleString()}`,
                chart.scales.x.getPixelForValue(minIndex),
                chart.scales.y.getPixelForValue(prices[minIndex]) - 10
              );
              ctx.fillStyle = 'red';
              ctx.fillText(
                `최고점: ${prices[maxIndex].toLocaleString()}`,
                chart.scales.x.getPixelForValue(maxIndex),
                chart.scales.y.getPixelForValue(prices[maxIndex]) - 10
              );
            },
          },
        ],
      });
      // // 최고점과 최저점에 텍스트 레이블 추가
      // ctx.fillStyle = 'blue';
      // ctx.fillText(`최저점: ${actualPrices[minIndex]}`, this.chart.scales.x.getPixelForValue(minIndex), this.chart.scales.y.getPixelForValue(actualPrices[minIndex]) - 10);
      // ctx.fillStyle = 'red';
      // ctx.fillText(`최고점: ${actualPrices[maxIndex]}`, this.chart.scales.x.getPixelForValue(maxIndex), this.chart.scales.y.getPixelForValue(actualPrices[maxIndex]) - 10);
    },
    getTodayInYYMMDD() {
      const today = new Date();
      const year = String(today.getFullYear()).slice(-2); //연도 자르기
      const month = String(today.getMonth() + 1).padStart(2, '0'); // 1월은 0부터 시작하므로 +1
      const day = String(today.getDate()).padStart(2, '0'); // 날짜는 항상 2자리로 맞추기
      return `${year}${month}${day}`; // yymmdd 형식으로 반환
    },
  },
  mounted() {
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
          } else {
            this.endBasDt = this.getTodayInYYMMDD();
            this.numOfRows = 365; // 1년
            await this.fetchGoldData(); // 데이터 가져오기
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
};
</script>
<style scoped>
input {
  margin: 10px;
  padding: 5px;
  font-size: 1em;
}
button {
  margin: 10px;
  padding: 5px 10px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 1em;
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
canvas {
  margin-top: 20px;
}
</style>
