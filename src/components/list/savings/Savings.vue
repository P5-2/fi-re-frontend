<template>
  <div class="savings-card" @click="viewDetails">
    <div class="savings-content">
      <div class="savings-main-info">
        <h2 class="savings-title">{{ pname }}</h2>
        <p class="bank-name">{{ bname }}</p>
      </div>
      <div class="savings-details">
        <p class="interest-rate">
          금리: <span>{{ minRate }}% ~ {{ maxRate }}%</span>
        </p>
        <p class="period">
          가입기간: <span>{{ subPeriod }}개월</span>
        </p>
        <p class="description">{{ description }}</p>
      </div>
    </div>
    <div class="button-group">
      <button @click.stop="calculateProfit" class="action-btn calc-btn">
        수익 계산
      </button>
      <button @click.stop="compareProduct" class="action-btn cart-btn">
        상품 비교
      </button>
    </div>
  </div>
</template>

<script>
import { calculatorStore } from "@/stores/calculator";
import { useRouter } from "vue-router";
import { mapActions } from "pinia";
import axios from "axios";

export default {
  name: "Savings",
  props: [
    "prdNo",
    "pname",
    "bname",
    "minRate",
    "maxRate",
    "subPeriod",
    "description",
  ],
  setup(props) {
    const router = useRouter();

    const viewDetails = () => {
      router.push("/itemDetail/savings/" + props.prdNo);
    };

    return {
      viewDetails,
    };
  },
  methods: {
    ...mapActions(calculatorStore, ["addSavings"]),
    calculateProfit() {
      const savingsData = {
        prdNo: this.prdNo,
        pname: this.pname,
        bname: this.bname,
        minRate: this.minRate,
        maxRate: this.maxRate,
        subPeriod: this.subPeriod,
        description: this.description,
        amount: 0, // 초기 금액을 0으로 설정
      };
      this.addSavings(savingsData);
      alert("상품을 계산기에 추가했습니다");
    },
    compareProduct(event) {
      event.stopPropagation();

      // Axios GET 요청을 통해 상품을 장바구니에 추가
      axios.get('http://localhost:9000/cart/savings/add', {
        params: {
          prdNo: this.prdNo
        },
        headers: {
          'Accept': 'text/plain;charset=UTF-8' // 한글 깨짐 방지
        }
      })
        .then(response => {
          console.log(this.prdNo + "번 상품을 비교함에 담았습니다.");
          alert(response.data); // 성공 응답 처리
        })
        .catch(error => {
          if (error.response && error.response.data) {
            alert(error.response.data); // 서버로부터 받은 에러 메시지 출력
          } else {
            alert('Failed to add savings item to cart.'); // 기본 에러 메시지 출력
          }
        });
    }
  },
};
</script>

<style scoped>
.savings-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  cursor: pointer;
}

.savings-content {
  flex-grow: 1;
  display: flex;
  gap: 20px;
}

.savings-main-info {
  width: 200px;
}

.savings-title {
  font-size: 20px;
  color: #333;
  margin-bottom: 5px;
}

.bank-name {
  font-weight: bold;
  color: #0080ff;
}

.savings-details {
  flex-grow: 1;
}

.interest-rate,
.period {
  margin: 5px 0;
}

.interest-rate span,
.period span {
  font-weight: bold;
  color: #0080ff;
}

.description {
  font-size: 14px;
  color: #666;
  margin-top: 10px;
  width: 660px;
}

.button-group {
  display: flex;
  gap: 10px;
}

.action-btn {
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s ease;
}

.calc-btn {
  background-color: #f0f0f0;
  color: #333;
}

.calc-btn:hover {
  background-color: #e0e0e0;
}

.cart-btn {
  background-color: #0080ff;
  color: white;
}

.cart-btn:hover {
  background-color: #0066cc;
}
</style>
