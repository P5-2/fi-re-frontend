import { createWebHistory, createRouter } from 'vue-router' // npm i vue-router@next

import login from "@/router/login/login.js"

const router = createRouter({
    history: createWebHistory(),
    routes: [
        ...login
    ]
})

export default router;