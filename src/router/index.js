import { createWebHistory, createRouter } from "vue-router"; // npm i vue-router@next

<<<<<<< HEAD
import login from "@/router/login/login.js";
import HotItemList from "@/router/hotItem/hotItemList.js";
import itemDetail from "./itemDetail/itemDetail.js";
import GoldPrice from "@/router/gold/gold.js";
import Forex from "@/router/forex/forex.js";
import SavingsDepositList from "@/router/list/savingsDepositList.js";
import fund from "@/router/list/fund.js";
import Survey from "./survey/survey.js";
=======
import login from '@/router/login/login.js';
import main from '@/router/main/main.js'
import itemDetail from './itemDetail/itemDetail.js';
import GoldPrice from '@/router/gold/gold.js';
import Forex from '@/router/forex/forex.js';
import SavingsList from '@/router/list/savingsList.js';
import fund from '@/router/list/fund.js';
import Survey from './survey/survey.js';
>>>>>>> dc11671670654a48537b61cffa49e08f092911c1
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

export default router;
