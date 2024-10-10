<template>
  <div class="mt-4 text-center">
    <h1 class="text-title">금 시세 확인하기</h1>
    <div v-if="isLoading" class="loading-block">
      <div class="loading">Loading...</div>
    </div>
    <div v-else class="content-block">
      <div class="d-flex justify-content-between mb-4 mx-auto" style="max-width: 600px">
        <div class="info-box">
          <div class="text-center">
            <span class="info-date">{{ formatDate(lastestDate) }}</span>
            <p class="info-price">{{ formattedLastestPrice }}&#8361;/g</p>
            <p v-if="yesterdayPrice !== null" :style="{ color: priceChange >= 0 ? 'red' : 'blue' }">
              {{ priceChangeText }}
            </p>
          </div>
        </div>

        <div class="info-box">
          <div class="text-center">
            <input type="date" v-model="selectedDate" @change="fetchPriceByDate" class="form-control text-center" />
            <p class="info-price">{{ formattedPointPrice }}&#8361;/g</p>
          </div>
        </div>
      </div>
    </div>

    <div class="chart-container" style="max-width: 1440px; height: 810px; margin: 0 auto">
      <div class="d-flex justify-content-start mb-3">
        <button type="button" class="btn" @click="setPeriod(180)">6개월</button>
        <button type="button" class="btn" @click="setPeriod(365)">1년</button>
        <button type="button" class="btn" @click="setPeriod(1095)">3년</button>
      </div>
      <div class="text-right mb-3">
        <span class="gold-label">금 시세</span>
        <span class="predicted-label">예측 금 시세</span>
      </div>
      <canvas id="goldChart" v-if="goldData.length" style="width: auto; height: auto"></canvas>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed, nextTick } from 'vue';
import axios from 'axios';
import { Chart, registerables } from 'chart.js';

export default {
  setup() {
    const endBasDt = ref('');
    const numOfRows = ref(0);
    const goldData = ref([]);
    const predictedGoldData = ref([]);
    const chart = ref(null);
    const pointPrice = ref(0);
    const lastestDate = ref('');
    const lastestPrice = ref(0);
    const selectedDate = ref('');
    const priceChange = ref(0);
    const yesterdayPrice = ref(null);
    const isLoading = ref(true);

    const formattedLastestPrice = computed(() => {
      return lastestPrice.value
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    });

    const formattedPointPrice = computed(() => {
      return pointPrice.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    });

    const priceChangeText = computed(() => {
      return priceChange.value >= 0
        ? `어제 대비 +${priceChange.value.toLocaleString()}원`
        : `어제 대비 ${priceChange.value.toLocaleString()}원`;
    });

    const formatDate = (dateString) => {
      if (typeof dateString !== 'string') {
        dateString = String(dateString);
      }
      const regex = /^\d{8}$/;
      if (!regex.test(dateString)) {
        return '날짜 없음';
      }
      const year = parseInt(dateString.slice(0, 4), 10);
      const month = parseInt(dateString.slice(4, 6), 10) - 1;
      const day = parseInt(dateString.slice(6, 8), 10);
      const date = new Date(year, month, day);
      if (isNaN(date.getTime())) {
        return '날짜 없음';
      }
      const formattedMonth = String(date.getMonth() + 1).padStart(2, '0');
      const formattedDay = String(date.getDate()).padStart(2, '0');
      return `${year}.${formattedMonth}.${formattedDay}`;
    };

    const calculateYesterdayPrice = () => {
      if (goldData.value.length < 2) {
        yesterdayPrice.value = null;
        priceChange.value = 0;
        return;
      }
      const yesterdayData = goldData.value[goldData.value.length - 2];
      yesterdayPrice.value = yesterdayData ? yesterdayData.clpr : null;
      priceChange.value = lastestPrice.value - yesterdayPrice.value;
    };

    const setPeriod = (days) => {
      numOfRows.value = days;
      endBasDt.value = getTodayInYYMMDD();
      fetchGoldData();
      fetchPredictedGoldPrice();
    };

    const fetchGoldData = async () => {
      try {
        const response = await axios.get('http://localhost:9000/gold/info', {
          params: { endBasDt: endBasDt.value, numOfRows: numOfRows.value },
        });
        goldData.value = response.data;
        lastestDate.value = goldData.value[goldData.value.length - 1].basDt;
        lastestPrice.value = goldData.value[goldData.value.length - 1].clpr;
        calculateYesterdayPrice();
        await nextTick(); // DOM 업데이트 후 차트 렌더링
        renderChart();
      } catch (error) {
        console.error('Error fetching gold data:', error);
      } finally {
        isLoading.value = false; // 로딩 종료
      }
    };

    const fetchPriceByDate = () => {
      if (selectedDate.value) {
        const formattedDate = selectedDate.value.replace(/-/g, '');
        const data = goldData.value.find(
          (item) => item.basDt === Number(formattedDate)
        );
        pointPrice.value = data ? data.clpr : '데이터 없음';
      } else {
        pointPrice.value = '데이터 없음';
      }
    };

    const fetchPredictedGoldPrice = async () => {
      try {
        const response = await axios.get('http://localhost:9000/gold/predict');
        predictedGoldData.value = response.data;
      } catch (error) {
        console.error('Error fetching predicted gold price:', error);
      }
    };

    const renderChart = () => {
      if (!goldData.value.length || !predictedGoldData.value.length) return;

      const combinedData = [];
      goldData.value.forEach((item) => {
        combinedData.push({
          basDt: item.basDt,
          price: item.clpr,
          isPredicted: false,
        });
      });
      predictedGoldData.value.forEach((item) => {
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
      if (chart.value) {
        chart.value.destroy();
      }
      Chart.register(...registerables);

      const actualPrices = goldData.value.map((item) => item.clpr);
      const minIndex = actualPrices.indexOf(Math.min(...actualPrices));
      const maxIndex = actualPrices.indexOf(Math.max(...actualPrices));
      const canvasResolution = (canvas.width * canvas.height) / 1000;
      const size = canvasResolution * 0.05;
      const pointRadius = size > 3 ? 3 : size;

      chart.value = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            {
              label: '금 시세',
              data: prices,
              borderColor: 'rgba(245, 194, 66, 1)',
              backgroundColor: 'rgba(245, 194, 66, 0.1)',
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
                  const oneDayAgoPriceData = findPriceDataByDate(oneDayAgoStr);
                  const oneMonthAgoPriceData =
                    findPriceDataByDate(oneMonthAgoStr);
                  const sixMonthsAgoPriceData =
                    findPriceDataByDate(sixMonthsAgoStr);
                  const oneYearAgoPriceData =
                    findPriceDataByDate(oneYearAgoStr);

                  const changes = [];
                  if (oneYearAgoPriceData) {
                    const yearChange = price - oneYearAgoPriceData.clpr;
                    changes.push(
                      `1년 전 대비: ${yearChange >= 0 ? '+' : ''
                      }${yearChange.toLocaleString()}원`
                    );
                  } else {
                    changes.push('1년 전 데이터 없음');
                  }
                  if (sixMonthsAgoPriceData) {
                    const sixMonthsChange = price - sixMonthsAgoPriceData.clpr;
                    changes.push(
                      `6개월 전 대비: ${sixMonthsChange >= 0 ? '+' : ''
                      }${sixMonthsChange.toLocaleString()}원`
                    );
                  } else {
                    changes.push('6개월 전 데이터 없음');
                  }
                  if (oneMonthAgoPriceData) {
                    const monthChange = price - oneMonthAgoPriceData.clpr;
                    changes.push(
                      `1개월 전 대비: ${monthChange >= 0 ? '+' : ''
                      }${monthChange.toLocaleString()}원`
                    );
                  } else {
                    changes.push('1개월 전 데이터 없음');
                  }
                  if (oneDayAgoPriceData) {
                    const dayChange = price - oneDayAgoPriceData.clpr;
                    changes.push(
                      `하루 전 대비: ${dayChange >= 0 ? '+' : ''
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
    };

    const trackPageVisit = async () => {
      try {
        const tokenData = JSON.parse(sessionStorage.getItem('token'));
        const accessToken = tokenData?.accessToken;

        await axios.post(
          `http://localhost:9000/exp`,
          {
            page: 'goldprice', // 현재 페이지 이름
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
    };
    const findPriceDataByDate = (targetDateStr) => {
      return (
        goldData.value.find((item) => item.basDt === Number(targetDateStr)) ||
        null
      );
    };

    const getTodayInYYMMDD = () => {
      const today = new Date();
      const year = String(today.getFullYear()).slice(-2);
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      return `${year}${month}${day}`;
    };

    onMounted(() => {
      console.log('Mounted 호출됨');
      setPeriod(365);
      trackPageVisit();
    });

    return {
      endBasDt,
      numOfRows,
      goldData,
      lastestDate,
      lastestPrice,
      selectedDate,
      pointPrice,
      priceChange,
      yesterdayPrice,
      predictedGoldData,
      chart,
      formattedLastestPrice,
      formattedPointPrice,
      priceChangeText,
      fetchGoldData,
      fetchPriceByDate,
      fetchPredictedGoldPrice,
      setPeriod,
      renderChart,
      formatDate,
      isLoading,
    };
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
  border-radius: 15px;
  /* 둥근 모서리 */
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  /* 깊이감 있는 그림자 */
}

.text-title {
  color: #2c3e50;
  font-weight: 800;
  /* 두꺼운 글씨 */
  font-size: 2.5rem;
  text-transform: uppercase;
  margin-bottom: 30px;
  /* 여백 추가 */
}

.info-box {
  flex: 1;
  margin: 0 10px;
  padding: 30px;
  background-color: #ffffff;
  border-radius: 15px;
  /* 더 둥근 모서리 */
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  /* 부드러운 그림자 */
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
  border-radius: 15px;
  /* 둥근 모서리 */
  padding: 20px;
  border: none;
  /* 카드 테두리 제거 */
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  margin: 20px auto;
  /* 중앙 정렬 */
}

.btn {
  background-color: #3f72af;
  /* 단색 버튼 */
  color: white;
  border: none;
  border-radius: 10px;
  /* 둥근 모서리 */
  padding: 12px 20px;
  /* 패딩 조정 */
  margin-right: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
  /* 애니메이션 효과 */
}

.btn:hover {
  background-color: #112d4e;
  /* Hover 시 색상 변경 */
  transform: scale(1.02);
  /* Hover 시 크기 증가 */
  color: white;
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

.loading-block {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; /* 화면 전체 높이 */
  background-color: #ffffff; /* 하얀 배경 */
  position: absolute; /* 다른 요소 위에 위치 */
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000; /* 다른 요소들 위에 오도록 설정 */
}

.loading {
  font-size: 1.5rem;
  color: #333; /* 텍스트 색상 */
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
  text-align: right;
  /* 텍스트를 오른쪽으로 정렬 */
}
</style>
