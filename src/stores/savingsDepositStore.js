import { defineStore } from "pinia";
import axios from "axios";

export const useSavingsDepositStore = defineStore("savingsDeposit", {
  state: () => ({
    products: [],
    currentPage: 1,
    totalPages: 0,
  }),
  actions: {
    async fetchProducts(page = 1, size = 5, productType = null) {
      try {
        const response = await axios.get("/finance/pageAll", {
          params: { page, size, productType },
        });
        this.products = response.data.products || [];
        this.totalPages = response.data.totalPages || 0;
        this.currentPage = response.data.currentPage || 1;
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    },
  },
});
