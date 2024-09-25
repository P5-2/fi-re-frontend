import { createWebHistory, createRouter } from "vue-router"; // npm i vue-router@next

import login from "@/router/login/login.js";
import HotItemList from "@/router/hotItem/hotItemList.js";
import itemDetail from "./itemDetail/itemDetail.js";
import GoldPrice from "@/router/gold/gold.js";
import Forex from "@/router/forex/forex.js";
import SavingsList from "@/router/list/savingsList.js";
import fund from "@/router/list/fund.js";

<<<<<<< HEAD
import login from '@/router/login/login.js';
import HotItemList from '@/router/hotItem/hotItemList.js';
import itemDetail from './itemDetail/itemDetail.js';
import GoldPrice from '@/router/gold/gold.js';
import fund from '@/router/list/fund.js';
import Survey from './survey/survey.js';
import Forex from '@/router/forex/forex.js';
=======
>>>>>>> 033a2666797bf1763e4372404b2e14013ab95a83
const router = createRouter({
  history: createWebHistory(),
  routes: [
    ...login,
    ...HotItemList,
    ...itemDetail,
    ...GoldPrice,
    ...Forex,
    ...SavingsList,
    ...fund,
<<<<<<< HEAD
    ...Survey,
    ...Forex,
=======
>>>>>>> 033a2666797bf1763e4372404b2e14013ab95a83
  ],
});

export default router;
