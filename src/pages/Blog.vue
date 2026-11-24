<script setup>
	
	import { ref, onMounted } from 'vue';
	import { useGlobalStore } from '../stores/global.js';
	import { Notyf } from 'notyf';
	import { useRouter, useRoute } from 'vue-router';
	import api from '../api.js';




	const notyf = new Notyf({
		position: {
			x: 'center',
			y: 'bottom'
		}
	})
	const { getUserDetails, user } = useGlobalStore();
	const router = useRouter();
	const route = useRoute();
	const blogId = route.params.id;



	import Home from './Home.vue';




	const blog = ref({});
	const comment = ref('');
	const isLoading = ref(false);








	async function commentFunc(blogId) {
		try {
			isLoading.value = true;

			const response = await api.patch(`/blogs/comment/${blogId}` ,{
				name: user.username,
				comment: comment.value
			})

			if (response.status === 200){
				notyf.success('Comment added');
			}

			comment.value = '';
			fetchSingleBlog();

		} catch (err) {

			notyf.error(err.response?.data?.error || 'Failed to post comment');

		} finally {

			isLoading.value = false;

		}
	}








	async function fetchSingleBlog() {
		try {

			const response = await api.get(`/blogs/singleBlog/${blogId}`);
			blog.value = response.data;

		} catch (err) {

			notyf.error(err.response.data.error);

		}
	}









	onMounted(() => {
		const token = localStorage.getItem('token');
		if (!token){
			router.push({path:'/'});
			return;
		}

		getUserDetails(token);
	});

	fetchSingleBlog();

</script>

<template>
	
	<div class="body" @click.self="router.push('/home')">
		
		<div class="blog">

			<div class="profile">
				<img src="/images/profile4.jpg">
				<p><strong>Author:</strong> {{blog.author}}</p>
			</div>
			
			<p><strong>Title:</strong> {{blog.title}}</p>
			<p>{{blog.content}}</p>

			<p>Comments:</p>

			<div class="comments" v-for="coms in blog.comments" :key="coms._id">
				
				<p><i class="bi bi-person-fill"></i> {{coms.name}}</p>
				<p><strong>Comment:</strong> {{coms.comment}}</p>

			</div>

			<form @submit.prevent="commentFunc(blog._id)">
				<div class="input-box" v-if="user.isAdmin === false">
					<label><i class="bi bi-chat-left-text-fill"></i></label>
					<input v-model="comment" type="text" placeholder="Enter comment" required>
					<button type="submit"><i class="bi bi-send-fill"></i></button>
				</div>
			</form>

			<button class="view-blog" @click="router.push('/home')"><i class="bi bi-arrow-left"></i></button>

		</div>

	</div>

	<Home />

</template>

<style scoped>

	.body{
		position: fixed;
		z-index: 1;
		margin: 0;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		height: 100%;
		width: 100%;
		background-color: rgba(0, 0, 0, .4);
	}
	
	.blog{
		border: solid 5px #004385;
		border-left: none;
		border-bottom: none;
		border-right: none;
		position: fixed;
		width: 100%;
		max-width: 800px;
		left: 30%;
		top: 20%;
		z-index: 1;
		background-color: white;
		padding: 20px 170px;
		border-radius: 10px;
		box-shadow: 0px 0px 5px gray;
		display: flex;
		flex-direction: column;
		align-items: center;
		z-index: 2;
		animation: anim .5s;
	}

	@keyframes anim{
		from{
			translate: 0px -10px;
			opacity: 0;
		} 
		to {
			transition: 0px 0px;
			opacity: 1;
		}
	}

	.blog p:nth-child(3){
		font-weight: 500;
	}

	.blog p:nth-child(4){
		font-weight: bold;
	}

	.profile{
		position: absolute;
		left: 10px;
		top: 10px;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.profile img{
		height: 60px;
		width: 60px;
		border-radius: 100px;
		border: solid 2px green;
	}

	.profile p{
		font-size: 12px;
	}







	.comments{
		display: flex;
		flex-direction: column;
		width: 90%;
		padding: 3px;
		border: solid 1px lightgray;
		border-top: none;
		border-left: none;
		border-right: none;
	}

	.comments p:nth-child(1){
		font-size: 16px;
		font-weight: bold;
		margin: 0;
	}

	.comments p:nth-child(1) i{
		font-size: 20px;
	}

	.comments p:nth-child(2){
		font-size: 12px;
		margin: 0;
	}

	.input-box{
		width: 140%;
		margin-top: 10px;
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 5px;
		border: solid 1px lightgray;
		border-radius: 5px;
	}

	.input-box input{
		outline: none;
		border: none;
		width: 100%;
		font-size: 14px;
		font-weight: 500;
	}

	.input-box button{
		color: gray;
		padding: 0px 20px;
		font-size: 20px;
		transition: .2s;
		cursor: pointer;
		border: none;
		background-color: transparent;
		border-radius: 5px;
	}

	.input-box button:hover{
		background-color: #004385;
		color: white;
	}

	.input-box label i{
		color: gray;
		padding: 0px 10px;
		font-size: 20px;
		transition: .2s;
		cursor: pointer;
	}

	.input-box label i:hover{
		color: black;
	}

	form{
		display: contents;
	}

	@media (max-width: 768px){
		.blog{
			left: 10%;
			max-width: 600px;
			padding: 20px 30px;
		}

		.profile{
			position: relative;
			width: 100%;
		}

		.comments{
			width: 100%;
		}

		.input-box{
			width: 100%;
		}
	}

	@media (max-width: 407px){
		.blog{
			left: 0%;
			top: 5%;
			padding: 20px 20px;
			position: static;
		}

		.profile{
			position: relative;
			width: 100%;
		}

		.comments{
			width: 100%;
		}

		.input-box{
			width: 100%;
		}
	}


	.view-blog{
		position: absolute;
		top: 10px;
		right: 10px;
		padding: 2px 20px;
		font-size: 20px;
		font-weight: bold;
		border: none;
		background-color: transparent;
		border-radius: 5px;
		color: gray;
		letter-spacing: 3px;
		transition: .2s ease;
	}

	.view-blog:hover{
		background-color: #004385;
		translate: -2px -2px;
		box-shadow: 2px 2px 2px gray;
		color: white;
	}

</style>