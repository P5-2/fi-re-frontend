
import Login from "@/components/login/Login.vue"
import NaverLogin from "@/components/login/naverLogin/NaverLogin.vue"


export default [
    {
        path: "/login",
        name: "Login",
        component: Login
    },
    {
        path: '/naverLogin',
        name: 'NaverLogin',
        component: NaverLogin
    }
]