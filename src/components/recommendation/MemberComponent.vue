<template>
    <div class="member-info">
      <h2>회원 정보</h2>
      <div class="info-section">
        <div class="info-row">
          <p><strong>사용자:</strong> <span class="hashtag">{{ memberInfo.nickname }}</span></p>
          <p><strong>연령대:</strong> <span class="hashtag">{{ memberInfo.age }}대</span></p>
          <p><strong>급여:</strong> <span class="hashtag">{{ formattedSalary }} 원</span></p>
          <p><strong>자산:</strong> <span class="hashtag">{{ formattedAssets }} 원</span></p>
          <p><strong>위험 선호도:</strong> <span class="hashtag">{{ memberRiskLevel }}</span></p>
        </div>
      </div>
  
      <div class="keywords-section">
        <h3>관련 키워드</h3>
        <ul class="keyword-list">
          <li v-for="(keyword, index) in memberInfo.keywordList" :key="index" class="hashtag">
            {{ keyword }}
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
    background-color: #F2F2F2; /* 연한 회색 배경 */
    border-radius: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    color: #0A3459; /* 어두운 파란색 글자 */
  }
  
  .info-section {
    margin-bottom: 20px;
  }
  
  .info-row {
    display: flex; /* 가로 정렬을 위해 flexbox 사용 */
    flex-wrap: wrap; /* 줄바꿈을 허용하여 공간에 맞게 정렬 */
    gap: 10px; /* 요소 간의 간격 설정 */
  }
  
  .keywords-section {
    margin-top: 20px;
  }
  
  h2 {
    font-size: 24px;
    margin-bottom: 10px;
    color: #3C74A6; /* 중간 파란색 제목 */
  }
  
  h3 {
    font-size: 20px;
    margin-bottom: 10px;
    color: #3C74A6; /* 중간 파란색 제목 */
  }
  
  .keyword-list {
    display: flex; /* 가로 정렬을 위해 flexbox 사용 */
    flex-wrap: wrap; /* 줄바꿈을 허용하여 공간에 맞게 정렬 */
  }
  
  .hashtag {
    display: inline-block;
    background-color: #DFE7F2; /* 연한 파란색 배경 */
    border-radius: 12px;
    padding: 6px 12px;
    margin-right: 6px;
    margin-top: 5px;
    font-size: 14px; /* 해시태그 폰트 크기 조정 */
    color: #0A3459; /* 어두운 파란색 글자 */
    transition: background-color 0.3s ease; /* 배경 색상 전환 효과 */
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2); /* 그림자 추가 */
  }
  
  .hashtag:hover {
    background-color: #BDBDBD; /* 호버 시 다소 어두운 회색으로 변화 */
  }
  </style>
  