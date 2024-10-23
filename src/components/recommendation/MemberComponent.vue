<template>
  <div class="member-info">
    <h2 class="greeting">
      <span class="customer-name">{{ memberInfo.nickname }}</span> 고객님
    </h2>
    <div class="info-section">
      <div class="info-row">
        <p><strong class="label">연령대:</strong> <span class="hashtag">{{ memberInfo.age }}대</span></p>
        <p><strong class="label">급여:</strong> <span class="hashtag">{{ formattedSalary }} 만원</span></p>
        <p><strong class="label">자산:</strong> <span class="hashtag">{{ formattedAssets }} 만원</span></p>
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
        const response = await axios.get('http://localhost:9000/recommend/member', config);
        memberInfo.value = response.data;
        console.log(response.data);
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
  background-color: #FFFFFF;
  color: #333333;
  min-width: 800px;
  max-width: 60%;
  margin: 20px auto;
}

.greeting {
  font-size: 20px;
  color: #3C74A6;
  text-align: left;
  margin-bottom: 20px;
  font-weight: bold;
  background: linear-gradient(90deg, black, #A6C2E5);
  -webkit-background-clip: text;
  padding: 10px;
  border-radius: 5px;
}

.customer-name {
  font-size: 30px;
  color: #0A3459;
  font-weight: 700;
}

.info-section {
  margin-bottom: 20px;
}

.info-row {
  display: flex;
  flex-wrap: wrap;
  gap: 15px; 
}

.keywords-section {
  margin-top: 20px;
  border-top: 1px solid #E0E0E0; 
  padding-top: 10px; 
  text-align: left;
}

h3 {
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 10px;
  color: #000000; 
}

.label {
  font-weight: 600;
  color: #000000; 
}

.keyword-list {
  display: flex;
  flex-wrap: wrap; 
  justify-content: left;
  padding: 0; 
  list-style: none;
}

.hashtag {
  display: inline-block;
  background-color: #DFE7F2; 
  border-radius: 20px;
  padding: 8px 15px;
  margin: 5px;
  font-size: 16px;
  color: #0A3459; 
  transition: background-color 0.3s ease, transform 0.2s ease; 
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.hashtag:hover {
  background-color: #BDBDBD; 
  transform: scale(1.05); 
}
</style>
