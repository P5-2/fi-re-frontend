<template>
  <div class="product-card" @click="viewDetails">
    <div class="product-content">
      <div class="product-main-info">
        <h2 class="product-title">{{ savingsDeposit.fin_prdt_nm }}</h2>
        <p class="bank-name">{{ savingsDeposit.kor_co_nm }}</p>
      </div>
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

export default {
  name: "SavingsDeposit",
  props: ["savingsDeposit", "options"],
  setup(props) {
    const router = useRouter();

    const viewDetails = () => {
      router.push("/itemDetail/finance/" + props.savingsDeposit.fin_prdt_cd);
    };

    return {
      viewDetails,
    };
  },
  data() {
    return {
      isInCart: false, // 좋아요 상태 관리
      productId: this.savingsDeposit.fin_prdt_cd, // 상품 ID
      intrRateTypeNm: this.options[0].intr_rate_type_nm // 단리/복리 구분
    }
  },
  computed: {
    cartImage() {
      // 좋아요 상태에 따라 다른 이미지를 반환
      return this.isInCart
        ? '/src/assets/calculator/heart.png' // 장바구니에 있는 경우의 이미지
        : '/src/assets/calculator/gray-heart.png'; // 기본 이미지;
    }
  },
  methods: {
    ...mapActions(calculatorStore, ["addSavings"]),
    calculateProfit() {
      const savingsData = {
        prdNo: this.savingsDeposit.fin_prdt_cd,
        pname: this.savingsDeposit.fin_prdt_nm,
        bname: this.savingsDeposit.kor_co_nm,
        minRate: this.options[0].intr_rate,
        maxRate: this.options[0].intr_rate2,
        subPeriod: this.options[0].save_trm,
        amount: 0,
      };
      this.addSavings(savingsData);
      alert("상품을 계산기에 추가했습니다");
    },
    getUsername() {
      // 로컬 스토리지에서 user 데이터를 가져옴
      const userData = JSON.parse(localStorage.getItem('user'));

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
      // 적금/예금 상품에 따라 다른 API 호출
      if (this.savingsDeposit.prdt_div === 'S') {
        // 적금 상품일 경우
        const alreadyInCart = await checkSavingsInCart(username, this.productId, this.intrRateTypeNm);

        if (alreadyInCart) {
          await removeSavingsFromCart(username, this.productId, this.intrRateTypeNm);
          alert("장바구니에 삭제되었습니다.")
          this.isInCart = false; // 장바구니에서 제거됨
        } else {
          await addSavingsToCart(username, this.productId, this.intrRateTypeNm);
          alert("장바구니에 추가되었습니다.")
          this.isInCart = true; // 장바구니에 추가됨
        }
      } else if (this.savingsDeposit.prdt_div === 'D') {
        // 예금 상품일 경우
        const alreadyInCart = await checkDepositInCart(username, this.productId, this.intrRateTypeNm);

        if (alreadyInCart) {
          await removeDepositFromCart(username, this.productId, this.intrRateTypeNm);
          alert("장바구니에 삭제되었습니다.")
          this.isInCart = false; // 장바구니에서 제거됨
        } else {
          await addDepositToCart(username, this.productId, this.intrRateTypeNm);
          alert("장바구니에 추가되었습니다.")
          this.isInCart = true; // 장바구니에 추가됨
        }
      }
    },
  },

  async mounted() {
    const username = this.getUsername();
    // 적금/예금 상품에 따라 초기 장바구니 상태 확인
    if (this.savingsDeposit.prdt_div === 'S') {
      this.isInCart = await checkSavingsInCart(username, this.productId, this.intrRateTypeNm);
    } else if (this.savingsDeposit.prdt_div === 'D') {
      this.isInCart = await checkDepositInCart(username, this.productId, this.intrRateTypeNm);
    }
  }
};
</script>

<style scoped>
.product-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  margin-bottom: 25px;
  /* 컴포넌트 간의 간격 추가 */
  background-color: #f9f7f7;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  /* 애니메이션 효과 추가 */
}

.product-card:hover {
  transform: translateY(-5px);
  /* 호버 시 위로 살짝 이동 */
}

.product-content {
  display: flex;
  align-items: center;
  /* 수직 정렬 */
  justify-content: space-between;
  /* 요소들 간의 공간 분배 */
  width: 100%;
  /* 전체 너비 사용 */
}

.product-main-info {
  width: auto;
  /* 너비를 자동으로 조정하여 공간 활용 */
}

.product-title {
  font-size: 20px;
  color: #112d4e;
  white-space: nowrap;
  margin-bottom: 5px;
}

.bank-name {
  font-weight: bold;
  color: #3f72af;
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
  font-size: 24px;
  color: #112d4e;
  font-weight: bold;
  /* 글씨체를 굵게 설정 */
}

.base-rate {
  font-size: 16px;
  color: #3f72af;
}

.button-group {
  display: flex;
  gap: 1px;
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
  /* 아이콘 크기 조정 */
  height: auto;
  filter: brightness(0) saturate(100%) invert(83%) sepia(6%) saturate(748%) hue-rotate(180deg) brightness(92%) contrast(90%);
  transition: filter 0.3s ease-in-out;
  /* 부드러운 전환 효과 */
}

.calc-btn:hover .icon {
  filter: brightness(0) saturate(100%) invert(13%) sepia(100%) saturate(7496%) hue-rotate(199deg) brightness(92%) contrast(106%);
}

.cart-btn .icon {
  width: 33px;
  /* 아이콘 크기 조정 */
  height: auto;
  margin-right: 1px;
}

.cart-btn:hover {}
</style>
