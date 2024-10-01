<template>
  <div class="member-info">
    <h2 class="greeting">
      <span class="customer-name">{{ memberInfo.nickname }}</span> 고객님
    </h2>
    <div class="info-section">
      <div class="info-row">
        <p><strong class="label">연령대:</strong> <span class="hashtag">{{ memberInfo.age }}대</span></p>
        <p><strong class="label">급여:</strong> <span class="hashtag">{{ formattedSalary }} 원</span></p>
        <p><strong class="label">자산:</strong> <span class="hashtag">{{ formattedAssets }} 원</span></p>
        <p><strong class="label">위험 선호도:</strong> <span class="hashtag">{{ memberRiskLevel }}</span></p>
      </div>
    </div>

    <div class="keywords-section">
      <h3>연관 키워드</h3>
      <ul class="keyword-list">
        <li v-for="(keyword, index) in memberInfo.keywordList" :key="index" class="hashtag">
          #{{ keyword }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';

export default {
  name: "MemberInfo",
  setup() {
    const memberInfo = ref({
      nickname: '',
      age: 0,
      salary: 0,
      assets: 0,
      riskPoint: 0,
      goalAmount: 0,
      keyword: '',
      keywordList: []
    });

    const fetchMemberInfo = async () => {
      const accessToken = getAccessToken();
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      try {
        const response = await axios.get('http://localhost:9000/recommend/member', config); // 유저 정보 가져오기
        memberInfo.value = response.data;
        console.log(response.data);
        // 키워드 파싱
        parseKeywords();
      } catch (error) {
        console.error('회원 정보 로드 실패:', error);
      }
    };

    const getAccessToken = () => {
      const tokenData = JSON.parse(sessionStorage.getItem("token"));
      return tokenData?.accessToken;
    };

    const parseKeywords = () => {
      if (memberInfo.value.keyword) {
        memberInfo.value.keywordList = memberInfo.value.keyword.split(',').map(k => k.trim());
      }
    };

    // 리스크 포인트에 따라 리스크 레벨 변환
    const memberRiskLevel = computed(() => {
      const riskPoint = memberInfo.value.riskPoint;
      if (riskPoint >= 34) {
        return "매우 높은 위험";
      } else if (riskPoint >= 28) {
        return "높은 위험";
      } else if (riskPoint >= 22) {
        return "중간 위험";
      } else if (riskPoint >= 16) {
        return "낮은 위험";
      } else {
        return "매우 낮은 위험";
      }
    });

    // 금액 포맷팅
    const formatCurrency = (value) => {
      return new Intl.NumberFormat('ko-KR').format(value);
    };

    const formattedSalary = computed(() => formatCurrency(memberInfo.value.salary));
    const formattedAssets = computed(() => formatCurrency(memberInfo.value.assets));
    const formattedGoalAmount = computed(() => formatCurrency(memberInfo.value.goalAmount));

    onMounted(() => {
      fetchMemberInfo();
    });

    return {
      memberInfo,
      memberRiskLevel,
      formattedSalary,
      formattedAssets,
      formattedGoalAmount
    };
  }
};
</script>

<style scoped>
.member-info {
  padding: 20px;
  background-color: #FFFFFF; /* 흰색 배경 */
  /* border-radius: 10px; */
  /* box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); */
  color: #333333; /* 어두운 회색 글자 */
  min-width: 800px;
  max-width: 60%;
  margin: 20px auto; /* 가운데 정렬 */
}

.greeting {
  font-size: 20px;
  color: #3C74A6;
  text-align: left;
  margin-bottom: 20px;
  font-weight: bold;
  background: linear-gradient(90deg, black, #A6C2E5);
  -webkit-background-clip: text;
  padding: 10px; /* 패딩 추가 */
  border-radius: 5px; /* 모서리 둥글게 */
}

.customer-name {
  font-size: 30px;
  color: #0A3459; /* 고객 이름을 위한 눈에 띄는 색상 */
  font-weight: 700; /* 두꺼운 글씨 */
}

.info-section {
  margin-bottom: 20px;
}

.info-row {
  display: flex; /* 가로 정렬을 위해 flexbox 사용 */
  flex-wrap: wrap; /* 줄바꿈을 허용하여 공간에 맞게 정렬 */
  gap: 15px; /* 요소 간의 간격 설정 */
}

.keywords-section {
  margin-top: 20px;
  border-top: 1px solid #E0E0E0; /* 구분선 추가 */
  padding-top: 10px; /* 패딩 추가 */
  text-align: left;
}

h3 {
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 10px;
  color: #000000; /* 중간 파란색 제목 */
}

.label {
  font-weight: 600;
  color: #000000; 
}

.keyword-list {
  display: flex;
  flex-wrap: wrap; /* 줄바꿈 허용 */
  justify-content: left; /* 가운데 정렬 */
  padding: 0; /* 패딩을 제거 */
  list-style: none; /* 기본 리스트 스타일 제거 */
}

.hashtag {
  display: inline-block;
  background-color: #DFE7F2; /* 연한 파란색 배경 */
  border-radius: 20px;
  padding: 8px 15px;
  margin: 5px;
  font-size: 16px; /* 해시태그 폰트 크기 조정 */
  color: #0A3459; /* 어두운 파란색 글자 */
  transition: background-color 0.3s ease, transform 0.2s ease; /* 배경 색상 전환 효과 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 그림자 추가 */
}

.hashtag:hover {
  background-color: #BDBDBD; /* 호버 시 다소 어두운 회색으로 변화 */
  transform: scale(1.05); /* 호버 시 크기 변화 효과 */
}
</style>
