<template>
  <div class="savings-list">
    <h1>예적금 상품 리스트</h1>
    <table>
      <thead>
        <tr>
          <th>상품명</th>
          <th>은행</th>
          <th>유형</th>
          <th>최소이율</th>
          <th>최대이율</th>
          <th>가입기간</th>
          <th>상세보기</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in savingsProducts" :key="product.prdNo">
          <td>{{ product.pname }}</td>
          <td>
            <img
              :src="getBankLogo(product.bname)"
              :alt="product.bname"
              width="30"
              height="30"
            />
            {{ product.bname }}
          </td>
          <td>{{ product.type }}</td>
          <td>{{ product.minRate }}%</td>
          <td>{{ product.maxRate }}%</td>
          <td>{{ product.subPeriod }}개월</td>
          <td>
            <router-link
              :to="{
                name: 'SavingsItemDetail',
                params: { prdNo: product.prdNo },
              }"
            >
              상세보기
            </router-link>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "SavingsList",
  data() {
    return {
      savingsProducts: [],
    };
  },
  created() {
    this.fetchSavingsProducts();
  },
  methods: {
    fetchSavingsProducts() {
      axios
        .get("http://localhost:9000/finance/savings/all")
        .then((response) => {
          this.savingsProducts = response.data;
        })
        .catch((error) => {
          console.error("Error", error);
        });
    },
    getBankLogo(bankName) {
      return require(`@/assets/bank/${bankName}.png`);
    },
  },
};
</script>

<style scoped>
/* 스타일은 이전과 동일 */
</style>
