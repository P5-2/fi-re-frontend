import { createWebHistory, createRouter } from 'vue-router'; // npm i vue-router@next

import login from '@/router/login/login.js';
import HotItemList from '@/router/hotItem/hotItemList.js';
import GoldPrice from '@/router/gold/gold.js';
<<<<<<< HEAD
import itemDetail from './itemDetail/itemDetail.js';

const router = createRouter({
  history: createWebHistory(),
  routes: [...login, ...HotItemList, ...GoldPrice, ...itemDetail],
=======

const router = createRouter({
  history: createWebHistory(),
  routes: [...login, ...HotItemList, ...GoldPrice],
>>>>>>> f2017514c33cb3c0b542a760271038312000df65
});

export default router;
