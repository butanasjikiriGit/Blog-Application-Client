<script setup>
	
	import { ref, onBeforeMount } from 'vue';
	import { useRouter } from 'vue-router';
	import { Notyf } from 'notyf';
	import api from '../api.js';




	const notyf = new Notyf({
		position: {
			x: 'center',
			y: 'bottom'
		}
	})
	const router = useRouter();



	const email = ref('');
	const password = ref('');
	const isLoading = ref(false);






	async function loginFunc() {
		try {

			isLoading.value = true;

			if (!email.value.trim() || !password.value.trim()){
				notyf.error('All field must not be empty');
				return;
			} else if (!email.value.includes('@')){
				notyf.error('Invalid email format');
				return;
			}

			const response = await api.post('/users/login', {
				email: email.value,
				password: password.value
			});

			localStorage.setItem('token', response.data.access);

			if (response.status === 200){
				notyf.success('Logged In successfully');
			}

			router.push({path:'/home'});

		} catch (err) {

			notyf.error(err.response.data.error);

		} finally {

			isLoading.value = false;

		}
	}






	onBeforeMount(() => {
		const token = localStorage.getItem('token');
		if (token){
			router.push({path:'/home'});
		}
	});

</script>

<template>
	
	<div class="body">
		
		<div class="login-body">

			<div class="image">
				<p><i class="bi bi-pencil-square"></i></p>
				<p>WELCOME TO JOURNAL SPHERE</p>
				<p>Your gateway to insightful stories and creativity. Log in to continue your journey.</p>
			</div>

			<form @submit.prevent="loginFunc">
				<div class="login-box">
					
					<h2>Sign In</h2>
					<p>Welcome back! Access your blog dashboard.</p>

					<div class="text-box">
						<label><i class="bi bi-person-fill"></i></label>
						<input type="text" v-model="email" placeholder="Email or Username" autocomplete="off">
					</div>

					<div class="text-box">
						<label><i class="bi bi-lock-fill"></i></label>
						<input type="password" v-model="password" placeholder="Password" autocomplete="off">
					</div>

					<div class="remember-forgot">
						<span><input type="checkbox">Remember me</span>
						<a href="#">Forgot password?</a>
					</div>

					<button type="submit" :disabled="isLoading">{{isLoading ? 'SIGNING IN. . . . .' : 'SIGN IN'}} <i class="bi bi-arrow-right"></i></button>

					<hr>

					<p>Or sign in with</p>

					<div class="icon">
						<i class="bi bi-google"></i>
						<i class="bi bi-facebook"></i>
						<i class="bi bi-github"></i>
					</div>

					<div class="register">
						<p>Don't have account?</p>
						<router-link to="/register">Sign Up Now</router-link>
					</div>

				</div>
			</form>

		</div>

	</div>

</template>

<style scoped>
	
	.body{
		height: 100vh;
		width: 100vw;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.login-body{
		display: flex;
		flex-direction: row;
		width: 100%;
		height: 100%;
		max-height: 650px;
		max-width: 1200px;
		box-shadow: 0px 0px 30px lightslategray;
		border-radius: 20px;
		overflow: hidden;
		animation: anim .5s;
	}

	.image{
		background-image: url('/images/background.jpg');
		background-size: cover;
		background-repeat: no-repeat;
		height: 100%;
		width: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 30px;
		color: white;
	}

	.login-box{
		width: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 30px;
	}

	.login-box h2{
		font-weight: bold;
		font-size: 50px;
	}

	.login-box p:nth-child(2){
		font-size: 14px;
		color: gray;
	}

	.text-box{
		width: 100%;
		display: flex;
		position: relative;
		justify-content: center;
		align-items: center;
		border-radius: 10px;
		border: solid 1px lightgray;
		margin: 10px 0px;
		overflow: hidden;
	}

	.text-box label{
		padding: 0px 20px;
		color: gray;
	}

	.text-box label i{
		font-size: 20px;
	}

	.text-box input{
		width: 100%;
		padding: 10px 0px;
		font-size: 16px;
		outline: none;
		border: none;
	}

	.remember-forgot{
		display: flex;
		justify-content: space-around;
		width: 100%;
		margin: 10px 0px;
		font-size: 14px;
	}

	.remember-forgot a{
		color: #004385;
		font-size: 14px;
		font-weight: bold;
		text-decoration: none;
	}

	.remember-forgot input{
		margin-right: 10px;
	}

	button{
		width: 100%;
		background-color: #004385;
		color: white;
		font-weight: bold;
		font-size: 15px;
		padding: 8px;
		border:none;
		border-radius: 5px;
		margin: 10px 0px;
		transition: .2s;
	}

	button:hover{
		background-color: #002F5C;
	}

	hr{
		width: 100%;
	}

	.login-box p:nth-child(8){
		font-size: 14px;
		color: gray;
	}

	.icon{
		display: flex;
		gap: 30px;
	}

	.icon i{
		font-size: 20px;
		padding: 10px 40px;
		border: solid 1px lightgray;
		border-radius: 5px;
		cursor: pointer;
		transition: .2s;
	}

	.icon i:hover{
		translate: -3px -3px;
		box-shadow: 3px 3px 5px gray;
		background-color: #004385;
		color: white;
	}

	.register{
		display: flex;
		width: 100%;
		justify-content: space-around;
		margin-top: 20px;
		font-size: 14px;
		color: gray;
	}

	.register :nth-child(2){
		color: #004385;
		font-weight: bold;
		text-decoration: none;
	}

	.image p:nth-child(1){
		font-size: 50px;
		margin: 0;
	}

	.image p:nth-child(2){
		font-size: 40px;
		font-weight: bold;
		margin: 0;
	}

	.image p:nth-child(3){
		font-size: 14px;
		font-weight: 300;
		margin: 0;
	}

	form{
		display: contents;
	}

	@media (max-width: 768px){
		.login-body{
			max-width: 700px;
		}
	}

	@media (max-width: 407px){
		.body{
			display: relative;
			height: 1000px;
		}

		.login-body{
			flex-direction: column;
			max-width: 500px;
			max-height: 1000px;
			border-radius: 0px;
		}

		.login-box{
			padding: 10px;
			margin-bottom: 100px;
		}

		.login-box h2, .login-box p:nth-child(2){
			margin: 0;
		}
	}

	@keyframes anim{
		from{
			translate: 0px -5px;
			opacity: 0;
		}
		to{
			translate: 0px 0px;
			opacity: 1;
		}
	}

</style>