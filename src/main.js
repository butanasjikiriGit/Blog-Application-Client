import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'notyf/notyf.min.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia';
import './style.css'
import App from './App.vue'
import { createRouter, createWebHistory  } from 'vue-router';


const router = createRouter({
	history: createWebHistory(),
	routes: [
		{
			path: '/',
			name: 'login',
			component: Login
		},
		{
			path: '/home',
			name: 'home',
			component: Home
		},
		{
			path: '/register',
			name: 'register',
			component: Register
		},
		{
			path: '/blog/:id',
			name: 'blog',
			component: Blog
		}
	]
});





// Routes
import Login from './pages/Login.vue';
import Home from './pages/Home.vue';
import Register from './pages/Register.vue';
import Blog from './pages/Blog.vue';





const app = createApp(App);

app.use(createPinia());
app.use(router);
app.mount('#app');
