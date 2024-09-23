import { createWebHistory, createRouter } from "vue-router"; // npm i vue-router@next

import login from "@/router/login/login.js"
import HotItemList from "@/router/hotItem/hotItemList.js"
import itemDetail from './itemDetail/itemDetail.js'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        ...login,
        ...HotItemList,
        ...itemDetail
    ]
})

export default router;
