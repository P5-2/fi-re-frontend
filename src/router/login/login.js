import Main from "@/pages/Main.vue"
import NaverLogin from "@/components/login/naverLogin/NaverLogin.vue"


export default [
    {
        path:'/',
        name:"Main",
        component: Main
    }
    ,
    {
        path: '/naver-login',
        name: 'NaverLogin',
        component: NaverLogin
    }
]