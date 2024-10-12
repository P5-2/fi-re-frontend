import { createWebHistory, createRouter } from "vue-router"; // npm i vue-router@next

import login from "@/router/login/login.js";
import main from "@/router/main/main.js";
import itemDetail from "./itemDetail/itemDetail.js";
import GoldPrice from "@/router/gold/gold.js";
import Forex from "@/router/forex/forex.js";
import SavingsDepositList from "@/router/list/savingsDepositList.js";
import fund from "@/router/list/fund.js";
import Survey from "./survey/survey.js";
import RecommendationPage from "@/router/recommendation/recommendation.js";
import Cart from "@/router/cart/cart.js";
import profile from "./profile/profile.js";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    ...login,
    ...main,
    ...itemDetail,
    ...GoldPrice,
    ...Forex,
    ...fund,
    ...Survey,
    ...RecommendationPage,
    ...Cart,
    ...SavingsDepositList,
    ...profile,
  ],
});

router.beforeEach((to)=>{
  if(to.path == '/cart' || to.path.includes('survey') || to.path == '/recmd' || to.path == '/profile'){
    const user = JSON.parse(localStorage.getItem('user'));
    if(user == null){//로그인 안한 경우 접근을 막음
      alert("로그인이 필요한 페이지입니다");
      return { name : 'MainPage' }
    }
  }
})
export default router;
