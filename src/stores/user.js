import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    userName: '',
    isLoggedIn: false,
  }),
  actions: {
    login(nickname) {
      this.userName = nickname;
      this.isLoggedIn = true;
    },
    logout() {
      this.userName = '';
      this.isLoggedIn = false;
      sessionStorage.setItem('token', 'invalidToken');
      sessionStorage.setItem('nickname', '');
    },
    checkLoginStatus() {
      let token = sessionStorage.getItem('token');
      if (token && token !== 'invalidToken') {
        const nickname = sessionStorage.getItem('nickname');
        this.login(nickname);
      } else {
        this.isLoggedIn = false;
      }
    },
  },
});
