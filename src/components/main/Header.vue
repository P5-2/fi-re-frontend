<template lang="">
  <div class="header container">
    <header
      class="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 mb-4 border-bottom"
    >
      <div class="d-flex align-items-center">
<<<<<<< HEAD
        <a href="/" style="margin-right: 36px">
          <img src="@/assets/header/logo.png" height="64" />
        </a>
=======
        <router-link :to="{ name: 'HotItemList' }" style="margin-right: 36px">
          <img src="@/assets/header/logo.png" height="64" />
        </router-link>
>>>>>>> f2017514c33cb3c0b542a760271038312000df65
        <ul class="nav col-md-autojustify-content-center">
          <li>
            <a href="/savings" class="nav-item nav-link px-2 link-dark"
              >예적금</a
            >
          </li>
          <li>
            <a href="/fund" class="nav-item nav-link px-2 link-dark">펀드</a>
          </li>
          <li>
            <a href="/GoldPrice" class="nav-item nav-link px-2 link-dark">금</a>
          </li>
          <li>
            <a href="/exchange" class="nav-item nav-link px-2 link-dark"
              >외화</a
            >
          </li>
        </ul>
      </div>

      <div class="member-wrapper text-end">
        <div class="login-wrapper">
<<<<<<< HEAD
          <div v-if="userStore.isLoggedIn">
            <b>{{ userStore.userName }}</b> 님<br />
            <p @click="logout">로그아웃</p>
          </div>

          <div v-else>
            <button @click="openModal" class="login-btn">로그인</button>
          </div>
        </div>

=======
          <div><!-- 김곰돌 님 환영합니다 --></div>
          <!-- <a href="/login">로그인</a> -->
          <button @click="openModal" class="login-btn">로그인</button>
        </div>
>>>>>>> f2017514c33cb3c0b542a760271038312000df65
        <img
          class="member-img"
          src="@/assets/header/unknown.png"
          width="64"
          height="64"
        />
      </div>
    </header>
<<<<<<< HEAD

    <!-- 로그인 모달창 -->
    <div v-if="isModalOpen" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <Login />
        <button class="close-btn" @click="closeModal">닫기</button>
      </div>
=======
  </div>
  <!-- 로그인 모달창 -->
  <div v-if="isModalOpen" class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <Login />
      <button class="close-btn" @click="closeModal">닫기</button>
>>>>>>> f2017514c33cb3c0b542a760271038312000df65
    </div>
  </div>
</template>

<script>
import Login from '../login/Login.vue';
import { useUserStore } from '@/stores/user';

export default {
  name: 'Header',
  components: {
    Login,
  },
  data() {
    return {
<<<<<<< HEAD
      isModalOpen: false,
    };
  },

  setup() {
    const userStore = useUserStore();
    userStore.checkLoginStatus(); // 로그인 상태 확인
    return {
      userStore,
=======
      isModalOpen: false, // 모달 상태
>>>>>>> f2017514c33cb3c0b542a760271038312000df65
    };
  },
  methods: {
    openModal() {
      this.isModalOpen = true;
    },
    closeModal() {
      this.isModalOpen = false;
    },
<<<<<<< HEAD
    logout() {
      this.userStore.logout();
      alert('로그아웃 되었습니다.');
      this.$router.push('/'); // main 페이지로 이동
    },
=======
>>>>>>> f2017514c33cb3c0b542a760271038312000df65
  },
};
</script>

<style scoped>
.header {
  background-color: #fefefe;
  position: sticky;
  top: 0px;
  width: 1200px;
}
<<<<<<< HEAD

header {
  width: 1176px;
}

=======
header {
  width: 1176px;
}
>>>>>>> f2017514c33cb3c0b542a760271038312000df65
.member-wrapper {
  width: fit-content;
  display: inline-flex;
  align-items: center;
}
.login-wrapper {
  display: inline-block;
  text-align: right;
  margin-right: 10px;
  font-size: 16px;
}
<<<<<<< HEAD

.member-img {
  border-radius: 20px;
}

.nav-item:hover {
  background-color: #dedede;
}

=======
.member-img {
  border-radius: 20px;
}
.nav-item:hover {
  background-color: #dedede;
}
>>>>>>> f2017514c33cb3c0b542a760271038312000df65
.nav-item {
  border-radius: 20px;
  width: 84px;
  font-size: large;
  text-align: center;
}

/* 로그인 버튼 */
.login-btn {
<<<<<<< HEAD
  background-color: #5a9;
  /* 버튼 배경색 */
  color: white;
  /* 글자 색 */
  border: none;
  /* 테두리 제거 */
  padding: 10px 20px;
  /* 여백 */
  font-size: 16px;
  /* 폰트 크기 */
  border-radius: 25px;
  /* 모서리 둥글게 */
  cursor: pointer;
  /* 마우스 커서 변경 */
  transition: background-color 0.3s ease;
  /* 호버 시 부드러운 전환 */
}

.login-btn:hover {
  background-color: #468a7f;
  /* 호버 시 배경색 */
}

.login-btn:active {
  background-color: #3e6f69;
  /* 클릭 시 배경색 */
=======
  background-color: #5a9; /* 버튼 배경색 */
  color: white; /* 글자 색 */
  border: none; /* 테두리 제거 */
  padding: 10px 20px; /* 여백 */
  font-size: 16px; /* 폰트 크기 */
  border-radius: 25px; /* 모서리 둥글게 */
  cursor: pointer; /* 마우스 커서 변경 */
  transition: background-color 0.3s ease; /* 호버 시 부드러운 전환 */
}

.login-btn:hover {
  background-color: #468a7f; /* 호버 시 배경색 */
}

.login-btn:active {
  background-color: #3e6f69; /* 클릭 시 배경색 */
>>>>>>> f2017514c33cb3c0b542a760271038312000df65
}

/* 모달 관련 스타일 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  position: relative;
<<<<<<< HEAD
  width: 500px;
  /* 가로 길이 조정 */
  min-height: 400px;
  /* 세로 길이 조정 */
=======
  width: 500px; /* 가로 길이 조정 */
  min-height: 400px; /* 세로 길이 조정 */
>>>>>>> f2017514c33cb3c0b542a760271038312000df65
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: transparent;
  border: none;
  font-size: 20px;
  cursor: pointer;
}
</style>
