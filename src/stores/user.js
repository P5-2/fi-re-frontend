import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    NickName: '',
    username: '',
    isLoggedIn: false,
  }),
  actions: {
    login(username, nickname) {
      this.username = username;
      this.NickName = nickname;
      this.isLoggedIn = true;
    },
    logout() {
      this.NickName = '';
      this.username = '';
      this.isLoggedIn = false;

      sessionStorage.setItem('token', 'invalidToken'); // token은 필요하면 유지
    },
    checkLoginStatus() {
      const token = sessionStorage.getItem('token');
      // token이 유효하면 상태 복원 (username과 nickname은 Pinia에 영구 저장됨)
      if (token && token !== 'invalidToken') {
        this.isLoggedIn = true;
      } else {
        this.isLoggedIn = false;
        this.username = '';
        this.NickName = '';
      }
    },
  },

  // 상태를 localStorage에 영구적으로 저장
  persist: {
    enabled: true,
    strategies: [
      {
        key: 'user',
        storage: localStorage, // 상태를 localStorage에 저장
        paths: ['username', 'NickName', 'isLoggedIn'], // localStorage에 저장할 상태 명시
      }
    ]
  }
});
