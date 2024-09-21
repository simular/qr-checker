import { createApp } from 'vue';
import './style.css';
import 'bootstrap/dist/css/bootstrap.css';
import ToastPlugin from 'vue-toast-notification';
import App from './App.vue';
import 'vue-toast-notification/dist/theme-bootstrap.css';

const app = createApp(App);

app.use(
  ToastPlugin,
  {
    position: 'bottom'
  }
);
app.mount('#app');
