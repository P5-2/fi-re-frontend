import { createApp } from "vue";
import App from "./App.vue";
import router from "./router/index";
import { createPinia } from "pinia";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";

// 프로덕션 모드에서 개발 관련 팁을 콘솔에 출력하지 않도록 함
// Vue.config.productionTip = false;

//카카오 SDK를 초기화 하는 메서드
window.Kakao.init("a2069fa41d81960a679ca66e6d2aa20a");

const app = createApp(App);

app.use(router);
app.use(createPinia());

app.mount("#app");
