<template lang="">
  <div class="header">
    <header
      class="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 mb-2"
    >
    <div class="d-flex align-items-center">
        <router-link to="/" style="margin-right: 15px">
          <img src="@/assets/header/logo.png" height="64" />
        </router-link>
        <ul class="nav col-md-auto justify-content-center">
          <li>
            <router-link to="/savings" class="nav-item nav-link px-2">
              예적금
            </router-link>
          </li>
          <li>
            <router-link to="/fund" class="nav-item nav-link px-2">
              펀드
            </router-link>
          </li>
          <li>
            <router-link to="/GoldPrice" class="nav-item nav-link px-2">
              금
            </router-link>
          </li>
          <li>
            <router-link to="/exchange" class="nav-item nav-link px-2">
              외화
            </router-link>
          </li>
        </ul>
      </div>

      <div class="member-wrapper text-end">
        <div class="dropdown" v-if="userStore.isLoggedIn">
          <button class="dropbtn dropdown-toggle">
            마이페이지
          </button>
          <div class="dropdown-content">
            <router-link to="/profile">
              <img src="@/assets/remocon/info.png" width="20" height="20" class="dc-img"/>
              내 정보
            </router-link>
            <router-link to="/cart">
              <img src="@/assets/remocon/shopping.png" width="20" height="20" class="dc-img"/>
              즐겨찾기
            </router-link>
            <router-link to="/survey/start">
              <img src="@/assets/remocon/survey.png" width="20" height="20" class="dc-img"/>
              투자성향진단
            </router-link>
            <router-link to="/recmd">
              <img src="@/assets/remocon/recommend.png" width="20" height="20" class="dc-img"/>
              추천상품
            </router-link>
            <router-link to="/">
              <img src="@/assets/remocon/quiz.png" width="20" height="20" class="dc-img"/>
              오늘의 퀴즈
            </router-link>
          </div>
        </div>
        <div class="login-wrapper">
          <div v-if="userStore.isLoggedIn">
            <b>{{ userStore.NickName }}</b> 님<br />
            <span class="logout-btn" @click="logout">로그아웃</span>
          </div>

          <div v-else>
            <button @click="openModal" class="login-btn">로그인</button>
          </div>
        </div>

        <img
          class="member-img"
          src="@/assets/header/unknown.png"
          width="64"
          height="64"
        />
      </div>
    </header>
  </div>
  <!-- 로그인 모달창 -->
  <div v-if="isModalOpen" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <Login />
        <button class="close-btn" @click="closeModal">닫기</button>
      </div>
    </div>
</template>

<script>
import Login from '../login/Login.vue';
import { useUserStore } from '@/stores/user.js';

export default {
  name: "Header",
  components: {
    Login
  },
  data() {
    return {
      isModalOpen: false,
    };
  },

  setup() {
    const userStore = useUserStore();
    userStore.checkLoginStatus(); // 로그인 상태 확인
    return {
      userStore
    };
  },
  methods: {

    openModal() {
      this.isModalOpen = true;
    },
    closeModal() {
      this.isModalOpen = false;
    },
    logout() {
      this.userStore.logout();
      // 로컬 스토리지안의 개인정보 삭제하기
      ['likedFunds', 'auth', 'checkedFunds'].forEach(item => localStorage.removeItem(item));
      alert('로그아웃 되었습니다.');
      this.$router.push('/'); // main 페이지로 이동
    },
  },
};
</script>


<style scoped>
.header {
  background-color: white;
  position: sticky;
  top: 0px;
  width: 100%;
}

header {
  width: 1200px;
  margin: auto;
}

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

.member-img {
  border-radius: 20px;
}

.nav-item:hover {
  background-color: #F9F7F7;
  color: black;
}

.nav-item {
  border-radius: 10px;
  width: 84px;
  font-size: large;
  text-align: center;
  color: black;
  font-weight: bold;
}

/* 로그인 버튼 */
.login-btn {
  background-color: #5A9;
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
}

.logout-btn{
  cursor: pointer;
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
  width: 500px;
  /* 가로 길이 조정 */
  min-height: 400px;
  /* 세로 길이 조정 */
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

.dropdown{
  position : relative;
  display : inline-block;
  margin-right: 20px;
}

.dropbtn{
  border : none;
  font-size: 16px;
  border-radius : 3px;
  border : 3px solid #F9F7F7;
  background-color: white;
  padding : 12px;
  width :200px;
  text-align: right;
  cursor : pointer;
}
.dropdown-content{
  display : none;
  position : absolute;
  z-index : 2; /*다른 요소들보다 앞에 배치*/
  font-weight: 400;
  background-color: #F9F7F7;
  min-width : 200px;
}

.dropdown-content a{
  display : block;
  text-decoration : none;
  color : rgb(37, 37, 37);
  font-size: 14px;
  padding : 12px 20px;
}

.dropdown-content a:hover{
  background-color : #ececec
}

.dropdown:hover .dropdown-content {
  display: block;
}
.dc-img{
  float:left
}
</style>