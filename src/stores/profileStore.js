// src/stores/userStore.js
import { defineStore } from 'pinia';

export const useProfileStore = defineStore('profile', {
  state: () => ({
    user: null,
    news: [],
  }),
  actions: {
    setUserTwo(userData) {
      this.user = userData;
    },
    setNews(newsData) {
      this.news = newsData;
    },
    // getImagePath(platform)
    getImagePath() {
      //   return require(`@/assets/header/${platform}.png`);
      return '@/assets/header/unknown.png';
    },
  },
});
