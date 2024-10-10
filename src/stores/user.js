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
      // 로그아웃 처리 로직 (예: 로컬 스토리지 지우기 등)
      localStorage.removeItem('user');
      this.isLoggedIn = false;
      this.$reset();
      sessionStorage.setItem('token', 'invalidToken'); // token은 필요하면 유지
    },
    checkLoginStatus() {
      const token = sessionStorage.getItem('token');
      // token이 유효하면 상태 복원 (username과 nickname은 Pinia에 영구 저장됨)
      if (token && token !== 'invalidToken') {
        this.isLoggedIn = true;
        // 로컬 스토리지에서 username과 NickName을 복원
        const userData = JSON.parse(localStorage.getItem('user'));
        if (userData && userData.username && userData.NickName) {
          this.username = userData.username;
          this.NickName = userData.NickName;
        } else {
          // user 데이터가 없으면 초기화
          this.username = '';
          this.NickName = '';
        }
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
