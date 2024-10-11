// src/stores/profileStore.js
import { defineStore } from 'pinia';

export const useProfileStore = defineStore('profile', {
  state: () => ({
    usertwo: JSON.parse(localStorage.getItem('usertwo')) || null,
    news: JSON.parse(localStorage.getItem('news')) || [],
  }),
  actions: {
    async checkLoginStatus() {
      const tokenData = JSON.parse(sessionStorage.getItem('token'));
      this.isLoggedIn = !!tokenData?.accessToken; // 로그인 상태 설정
    },
    setUserTwo(userData) {
      this.user = userData;
      localStorage.setItem('usertwo', JSON.stringify(userData)); // 로컬 스토리지에 저장
    },
    setNews(newsData) {
      this.news = newsData;
      localStorage.setItem('news', JSON.stringify(newsData)); // 로컬 스토리지에 저장
    },
    clearData() {
      this.user = null;
      this.news = [];
      localStorage.removeItem('usertwo'); // 로컬 스토리지에서 제거
      localStorage.removeItem('news'); // 로컬 스토리지에서 제거
    },
  },
});
