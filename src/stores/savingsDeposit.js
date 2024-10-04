import { defineStore } from "pinia";
import axios from "axios";

export const useProductStore = defineStore("product", {
  state: () => ({
    products: [],
    filter: "all",
    currentPage: 1,
    totalPages: 0,
  }),
  actions: {
    async fetchProducts(page = 1, size = 5, productType = null) {
      try {
        const response = await axios.get("/pageAll", {
          params: { page, size, productType },
        });
        this.products = response.data.products;
        this.totalPages = response.data.totalPages;
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    },
    setFilter(filter) {
      this.filter = filter;
      this.fetchProducts(this.currentPage, 5, filter === "all" ? null : filter);
    },
    setPage(page) {
      this.currentPage = page;
      this.fetchProducts(page, 5, this.filter === "all" ? null : this.filter);
    },
  },
});
