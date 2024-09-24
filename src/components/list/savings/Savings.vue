<template>
  <div
    class="savings-item"
    @click="viewDetails"
    style="
      width: 1176px;
      margin: 20px auto;
      padding: 20px;
      border: 1px solid #ddd;
      border-radius: 8px;
      cursor: pointer;
    "
  >
    <h2>{{ pname }}</h2>
    <p>은행: {{ bname }}</p>
    <p>금리: {{ minRate }}% ~ {{ maxRate }}%</p>
    <p>가입기간: {{ subPeriod }}개월</p>
    <p>설명: {{ description }}</p>
    <!-- click.stop을 이용해 버튼 클릭 시 이벤트가 상위로 전파되지 않게 해서 상세페이지로 이동하지 않도록 함 -->
    <div class="button-group" @click.stop>
      <button @click="calculateProfit">수익 계산</button>
      <button @click="addToCart">상품 담기</button>
    </div>
  </div>
</template>

<script>
import { useRouter } from "vue-router";

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

    const calculateProfit = (event) => {
      event.stopPropagation();
      // 수익계산 로직( 계산기 로직 불러오기?)
      console.log("수익계산:", props.prdNo);
    };

    const addToCart = (event) => {
      event.stopPropagation();
      // 상품담기 로직
      console.log("상품담기:", props.prdNo);
    };

    return {
      viewDetails,
      calculateProfit,
      addToCart,
    };
  },
};
</script>

<style scoped>
.savings-item:hover {
  background-color: #f0f0f0;
}

.button-group {
  margin-top: 10px;
}

button {
  margin-right: 10px;
}
</style>
