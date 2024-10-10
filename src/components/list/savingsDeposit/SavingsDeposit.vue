<template>
  <div class="product-card" @click="viewDetails">
    <div class="product-content">
      <!-- 상품명과 은행로고-->
      <div class="product-main-info">
        <img
          :src="getBankLogo(savingsDeposit.kor_co_nm)"
          :alt="savingsDeposit.kor_co_nm"
          class="bank-logo"
          :title="savingsDeposit.kor_co_nm"
        />
        <div class="product-info">
          <!-- 상품명 위에 위치한 정보 박스들 -->
          <div class="info-boxes">
            <span class="info-box1">{{ options[0].intr_rate_type_nm }}</span>
            <span class="info-box2">{{
              getRsrvTypeLabel(options[0].rsrv_type)
            }}</span>
            <span class="info-box3">12개월 기준</span>
          </div>
          <h2 class="product-title">{{ savingsDeposit.fin_prdt_nm }}</h2>
        </div>
      </div>

      <!-- 금리 관련 -->
      <div class="product-details" v-if="options && options.length">
        <div class="interest-rates">
          <p class="interest-rate highest-rate">
            최고 <span>{{ options[0].intr_rate2 }}%</span>
          </p>
          <p class="interest-rate base-rate">
            기본 <span>{{ options[0].intr_rate }}%</span>
          </p>
        </div>
      </div>
    </div>
    <div class="button-group">
      <button @click.stop.prevent="toggleFavorite" class="action-btn cart-btn">
        <img :src="cartImage" alt="cart" class="icon" />
      </button>
      <button @click.stop.prevent="calculateProfit" class="action-btn calc-btn">
        <img src="@/assets/calculator/calc.png" alt="Calculate" class="icon" />
      </button>
    </div>
  </div>
</template>

<script>
import { useRouter } from "vue-router";
import { mapActions } from "pinia";
import { calculatorStore } from "@/stores/calculator";
import {
  checkSavingsInCart,
  addSavingsToCart,
  removeSavingsFromCart,
  checkDepositInCart,
  addDepositToCart,
  removeDepositFromCart,
} from "@/services/cartServiceSD.js";

// 이미지 파일을 미리 불러오기
const images = import.meta.glob("@/assets/bank/*.png", { eager: true });
const imageMap = Object.fromEntries(
  Object.entries(images).map(([key, value]) => [
    key.split("/").pop().replace(".png", ""),
    value.default,
  ])
);

export default {
  name: "SavingsDeposit",
  props: ["savingsDeposit", "options"],
  setup(props) {
    const router = useRouter();

    const viewDetails = () => {
      const productId = props.savingsDeposit.fin_prdt_cd;
      const intrRateTypeNm = props.options[0].intr_rate_type_nm;
      const rsrvType = props.options[0].rsrv_type;

      router.push(
        `/itemDetail/savings/${productId}/${intrRateTypeNm}/${rsrvType}`
      );
    };

    const getBankLogo = (bankName) => {
      const formattedBankName = bankName.replace(/\s+/g, "");
      return imageMap[formattedBankName] || imageMap["bluebank"];
    };

    return {
      viewDetails,
      getBankLogo,
    };
  },
  data() {
    return {
      isInCart: false, // 좋아요 상태 관리
      productId: this.savingsDeposit.fin_prdt_cd, // 상품 ID
      intrRateTypeNm: this.options[0].intr_rate_type_nm, // 단리/복리 구분
    };
  },
  computed: {
    cartImage() {
      // 좋아요 상태에 따라 다른 이미지를 반환
      return this.isInCart
        ? "/src/assets/calculator/heart.png" // 장바구니에 있는 경우의 이미지
        : "/src/assets/calculator/gray-heart.png"; // 기본 이미지;
    },
  },

  methods: {
    ...mapActions(calculatorStore, ["addSavings"]),

    getRsrvTypeLabel(rsrvType) {
      if (rsrvType === "F") {
        return "자유적금";
      } else if (rsrvType === "S") {
        return "정기적금";
      } else {
        return "예금";
      }
    },

    calculateProfit() {
      const savingsData = {
        savingsDeposit: {
          fin_prdt_cd: this.savingsDeposit.fin_prdt_cd,
          fin_prdt_nm: this.savingsDeposit.fin_prdt_nm,
          kor_co_nm: this.savingsDeposit.kor_co_nm,
          prdt_div: this.savingsDeposit.prdt_div,
        },
        options: [
          {
            intr_rate: this.options[0].intr_rate,
            intr_rate2: this.options[0].intr_rate2,
            save_trm: this.options[0].save_trm,
            rsrv_type: this.options[0].rsrv_type, // 추가된 부분
            intr_rate_type_nm: this.options[0].intr_rate_type_nm,
          },
        ],
        amount: 0, // 필요에 따라 설정
      };

      this.addSavings(savingsData);
      // alert("상품을 계산기에 추가했습니다");
    },
    getUsername() {
      // 로컬 스토리지에서 user 데이터를 가져옴
      const userData = JSON.parse(localStorage.getItem("user"));

      // user 데이터가 존재하고, username이 있을 경우 반환
      if (userData && userData.username) {
        return userData.username;
      } else {
        console.error("Username not found in localStorage");
        return null;
      }
    },
    async toggleFavorite() {
      const username = this.getUsername();
      if (this.savingsDeposit.prdt_div === "S") {
        const alreadyInCart = await checkSavingsInCart(
          username,
          this.productId,
          this.intrRateTypeNm
        );

        if (alreadyInCart) {
          await removeSavingsFromCart(
            username,
            this.productId,
            this.intrRateTypeNm
          );
          alert("장바구니에 삭제되었습니다.");
          this.isInCart = false;
        } else {
          await addSavingsToCart(username, this.productId, this.intrRateTypeNm);
          alert("장바구니에 추가되었습니다.");
          this.isInCart = true;
        }
      } else if (this.savingsDeposit.prdt_div === "D") {
        // 예금 상품일 경우
        const alreadyInCart = await checkDepositInCart(
          username,
          this.productId,
          this.intrRateTypeNm
        );

        if (alreadyInCart) {
          await removeDepositFromCart(
            username,
            this.productId,
            this.intrRateTypeNm
          );
          alert("장바구니에 삭제되었습니다.");
          this.isInCart = false;
        } else {
          await addDepositToCart(username, this.productId, this.intrRateTypeNm);
          alert("장바구니에 추가되었습니다.");
          this.isInCart = true;
        }
      }
    },
  },

  async mounted() {
    const username = this.getUsername();
    // 적금/예금 상품에 따라 초기 장바구니 상태 확인
    if (this.savingsDeposit.prdt_div === "S") {
      this.isInCart = await checkSavingsInCart(
        username,
        this.productId,
        this.intrRateTypeNm
      );
    } else if (this.savingsDeposit.prdt_div === "D") {
      this.isInCart = await checkDepositInCart(
        username,
        this.productId,
        this.intrRateTypeNm
      );
    }
  },
};
</script>

<style scoped>
.info-boxes {
  display: flex;
  gap: 12px;
  margin-bottom: 10px;
}

.info-box1 {
  background-color: #3f72af;
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 12px;
  font-weight: bold;
}
.info-box2 {
  background-color: #dbe2ef;
  color: #112d4e;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 12px;
  font-weight: bold;
}
.info-box3 {
  background-color: #112d4e;
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 12px;
  font-weight: bold;
}

.product-info {
  display: flex;
  flex-direction: column;
}
.product-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  margin-bottom: 25px;
  background-color: #f9f7f7;
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.product-card:hover {
  transform: translateY(-5px);
}

.product-content {
  display: flex;
  align-items: center;
  justify-content: space-between; /* 요소들 간의 공간 분배 */
  width: 100%; /* 전체 너비 사용 */
}

.product-main-info {
  display: flex;
  align-items: center; /* 수평 정렬 */
}

.bank-logo {
  width: 50px; /* 로고 크기 조정 */
  height: 50px; /* 로고 크기 조정 */
  border-radius: 50%; /* 동그랗게 만들기 */
  margin-right: 20px; /* 텍스트와의 간격 */
}

.product-title {
  font-size: 20px;
  color: #112d4e;
  text-align: left;
}

.bank-name {
  font-weight: bold;
}

.product-details {
  flex-grow: 1;
}

.interest-rates {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.highest-rate {
  font-size: 30px;
  color: #0080ff;
  font-weight: bold;
  /* 글씨체를 굵게 설정 */
}

.base-rate {
  font-size: 16px;
  color: #3f72af;
}

.button-group {
  display: flex;
  gap: 5px;
  /* 버튼 간의 간격 */
  align-items: center;
  /* 수직 정렬 */
}

.action-btn {
  padding: 10px 15px;
  border-radius: 5px;
}

.calc-btn,
.cart-btn {
  background-color: transparent;
  /* 배경 제거 */
  border: none;
  cursor: pointer;
}

.calc-btn .icon {
  width: 35px;
  height: auto;
  filter: brightness(0) saturate(100%) invert(60%) sepia(10%) saturate(800%)
    hue-rotate(180deg) brightness(85%) contrast(95%);
  transition: filter 0.3s ease-in-out, transform 0.3s ease-in-out;
}

.calc-btn:hover .icon {
  filter: brightness(0) saturate(100%) invert(20%) sepia(100%) saturate(8000%)
    hue-rotate(200deg) brightness(95%) contrast(110%);
  transform: scale(1.1); /* 호버 시 확대 효과 */
}

.cart-btn .icon {
  width: 33px;
  /* 아이콘 크기 조정 */
  height: auto;
  margin-right: 1px;
}
.calc-btn:hover {
}
</style>
