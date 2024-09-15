import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"

const pinia = createPinia();

const app = createApp(App);

app.use(pinia);
app.mount('#app');
