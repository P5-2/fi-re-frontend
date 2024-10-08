import { createApp } from 'vue';
import App from './App.vue';
import router from './router/index';
import { createPinia } from 'pinia'; // npm install pinia
import piniaPersist from 'pinia-plugin-persistedstate';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';

//카카오 SDK를 초기화 하는 메서드
window.Kakao.init('a2069fa41d81960a679ca66e6d2aa20a');

const pinia = createPinia();
const app = createApp(App);
pinia.use(piniaPersist);

app.use(router);
app.use(pinia);


app.mount('#app');
