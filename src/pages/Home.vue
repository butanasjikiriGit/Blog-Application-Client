<script setup>
	
	import { ref, onMounted } from 'vue';
	import { useGlobalStore } from '../stores/global.js';
	import { Notyf } from 'notyf';
	import { useRouter } from 'vue-router';
	import api from '../api.js';



	const notyf = new Notyf({
		position: {
			x: 'center',
			y: 'bottom'
		}
	})
	const { getUserDetails, user } = useGlobalStore();
	const router = useRouter();





	const blogs = ref([]);
	const blogs2 = ref([]);
	const activeTab = ref('all');
	const isLoading = ref(false)
	const comment = ref({});
	const title = ref('');
	const content = ref('');
	const modal = ref(false);
	const editTitle = ref('');
	const editContent = ref('');
	const editBlogId = ref('');
	const authors = ref([]);








	async function addNewBlog() {
		try {

			const response = await api.post('/blogs/addBlog', {
				userId: user._id,
				title: title.value,
				content: content.value,
				author: user.username
			})

			if (response.status === 200){
				notyf.success(response.status.message || 'Added new post');
			}

			title.value = "";
			content.value = "";

			fetchAllBlog();
			fetchMyBlog();

		} catch (err) {

			notyf.error(err.response.data.error);

		}
	}






	async function commentFunc(blogId) {
		try {
			isLoading.value = true;

			const response = await api.patch(`/blogs/comment/${blogId}` ,{
				name: user.username,
				comment: comment.value[blogId]
			})

			if (response.status === 200){
				notyf.success('Comment added');
			}

			comment.value[blogId] = '';
			await fetchAllBlog();
			await fetchMyBlog();

		} catch (err) {

			notyf.error(err.response?.data?.error || 'Failed to post comment');

		} finally {

			isLoading.value = false;

		}
	}






	async function fetchAllBlog() {
		try {

			const response = await api.get('/blogs/getAllBlog');
			blogs.value = response.data;

		} catch (err) {

			notyf.error(err.response.data.error);

		}
	}








	async function fetchMyBlog() {
		try {

			const response = await api.get('/blogs/getUserBlog');
			blogs2.value = response.data;

		} catch (err) {

			notyf.error(err.response.data.error);

		}
	}







	function logoutFunc() {

		localStorage.removeItem('token');
		getUserDetails(null);
		router.push({path:'/'});
		notyf.success('Logged Out successfully');

	}







	async function deleteBlog(blogId) {
		try {

			const confirmDel = confirm('Are you sure you want to delete this post?');

			const response = await api.delete(`/blogs/deleteBlog/${blogId}`);

			if (response.status === 200){
				notyf.success(response.data.message);
			}

			fetchMyBlog();
			fetchAllBlog();

		} catch (err) {

			notyf.error(err.response.data.error);

		}
	}







	async function openModal(blogId) {
		try {

			modal.value = true;

			const response = await api.get(`/blogs/singleBlog/${blogId}`);
			editTitle.value = response.data.title;
			editContent.value = response.data.content;
			editBlogId.value = response.data._id;

		} catch (err) {

			notyf.error(err.response.data.error);

		}
	}








	async function editBlog() {
		try {

			const response = await api.patch(`/blogs/editBlog/${editBlogId.value}`, {
				title: editTitle.value,
				content: editContent.value
			})

			if (response.status === 200){
				notyf.success(response.data.message);
			}

			fetchMyBlog();
			fetchAllBlog();

		} catch (err) {

			notyf.error(err.response.data.error);

		} finally {

			modal.value = false;

		}
	}







	async function adminDeleteFunc(blogId) {
		try {

			const confirmDel = confirm('Are you sure you want to delete this post?');

			if(confirmDel){

				const response = await api.delete(`/blogs/deleteByAdmin/${blogId}`);

				if (response.status === 200){
					notyf.success(response.data.message);
				}

			}

			fetchMyBlog();
			fetchAllBlog();

		} catch (err) {

			notyf.error(err.response.data.error);

		}
	}








	async function fetchAllUsers() {
		try {

			const response = await api.get('/users/allUser');
			authors.value = response.data;

		} catch (err) {

			console.error('Hello daddy'+ err);

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

	fetchAllBlog();
	fetchMyBlog();
	fetchAllUsers();

</script>

<template>
	
	<div class="container mt-3">
		<div class="row">
			<div class="col-12">
				
				<form @submit.prevent="addNewBlog">
					<div class="add-blog" v-if="user.isAdmin === false">
						<h3>Add your blog here:</h3>
						<div class="add-blog-box">
							<div class="add-blog-box2">
								<label>Title</label>
								<input type="text" v-model="title" placeholder="Title" autocomplete="off" required>
							</div>
							<div class="add-blog-box2">
								<label>Content</label>
								<input type="text" v-model="content" placeholder="Add content" autocomplete="off" required>
							</div>
						</div>
						<button type="submit">POST</button>
					</div>
				</form>

				<div class="admin-dashboard" v-if="user.isAdmin">
					<h3>Admin Dashboard</h3>
					<div class="total-author-blogs">
						<div class="inner-total">
							<label>Authors:</label>
							<p>{{authors.length}}</p>
						</div>
						<div class="inner-total">
							<label>Blogs:</label>
							<p>{{blogs.length}}</p>
						</div>
					</div>
				</div>

				<form @submit.prevent="editBlog">
					<div class="modals" v-if="modal === true">
						
						<div class="blog-details">
							<label>Title</label>
							<input type="text" v-model="editTitle" required>
							<label>Content</label>
							<input type="text" v-model="editContent" required>
						</div>

						<div class="save-exit-btn">
							<button class="btn bg-danger" @click.prevent="modal = false">Close</button>
							<button type="submit">Save</button>
						</div>

					</div>
				</form>

			</div>
		</div>
		<div class="row">
			
			<div class="col-12 order-1 col-md-4">
				
				<div class="navbar-box">
					
					<div class="side-nav">

						<button @click.prevent="logoutFunc"><i class="bi bi-door-open"></i> Log Out</button>

						<p class="role" v-if="user.isAdmin">Admin <i class="bi bi-check-circle-fill"></i></p>
						<p class="role" v-else>User <i class="bi bi-check-circle-fill"></i></p>
						
						<img src="/images/profile.jpg">

						<p><strong>Username:</strong> {{user.username}}</p>
						<p><strong>Email:</strong> {{user.email}}</p>

					</div>

					<div class="actions mt-4" v-if="user.isAdmin === false">
						
						<h3>Actions</h3>

						<div class="btn-options">
							<button :class="{ active: activeTab === 'all' }" @click="activeTab='all'">All Blog</button>
							<button :class="{ active: activeTab === 'mine' }" @click="activeTab='mine'">My Blog</button>
						</div>

					</div>

				</div>

			</div>

			<div class="col-12 order-2 col-md-8" v-if="activeTab === 'all'">
				
				<div class="display-blog" v-for="blog in blogs" :key="blog._id">
					
					<div class="blog-profile">
						<img src="/images/profile2.jpg">
						<p><strong>Author:</strong> {{blog.author}}</p>
					</div>

					<p class="text"><strong>Title:</strong> {{blog.title}}</p>

					<p>{{blog.content}}</p>

					<p>Comments:</p>

					<div class="parent-comment">
						<div class="comments" v-for="coms in blog.comments" :key="coms._id">
							
							<p><i class="bi bi-person-fill"></i> {{coms.name}}</p>
							<p><strong>Comment:</strong> {{coms.comment}}</p>

						</div>
					</div>

					<form @submit.prevent="commentFunc(blog._id)">
						<div class="input-box" v-if="user.isAdmin === false">
							<label><i class="bi bi-chat-left-text-fill"></i></label>
							<input v-model="comment[blog._id]" type="text" placeholder="Enter comment" required>
							<button type="submit"><i class="bi bi-send-fill"></i></button>
						</div>
					</form>

					<div class="delete-view-btn">
						<button @click.prevent="adminDeleteFunc(blog._id)" v-if="user.isAdmin" class="admin-delete-button"><i class="bi bi-trash-fill"></i></button>

						<button class="view-blog" @click="router.push(`/blog/${blog._id}`)"><i class="bi bi-search"></i></button>
					</div>

				</div>

				<div class="display-blog" v-if="blogs.length === 0">
					
					<h2>No blog available</h2>
					
				</div>

			</div>

			<div class="col-12 order-2 col-md-8" v-if="activeTab === 'mine'">
				
				<div class="display-blog" v-for="blag in blogs2" :key="blag._id">
					
					<div class="blog-profile">
						<img src="/images/profile2.jpg">
						<p><strong>Author:</strong> {{blag.author}}</p>
					</div>

					<p class="text"><strong>Title:</strong> {{blag.title}}</p>

					<p>{{blag.content}}</p>

					<p>Comments:</p>

					<div class="parent-comment">
						<div class="comments" v-for="coms in blag.comments" :key="coms._id">
							
							<p><i class="bi bi-person-fill"></i> {{coms.name}}</p>
							<p><strong>Comment:</strong> {{coms.comment}}</p>

						</div>
					</div>

					<form @submit.prevent="commentFunc(blag._id)">
						<div class="input-box">
							<label><i class="bi bi-chat-left-text-fill"></i></label>
							<input v-model="comment[blag._id]" type="text" placeholder="Enter comment" required>
							<button type="submit"><i class="bi bi-send-fill"></i></button>
						</div>
					</form>

					<div class="del-edit-btn">
						<button @click.prevent="deleteBlog(blag._id)" class="btn btn-danger"><i class="bi bi-trash"></i> delete</button>
						<button @click.prevent="openModal(blag._id)" class="btn btn-warning"><i class="bi bi-pencil-square"></i> edit</button>
					</div>

				</div>

				<div class="display-blog" v-if="blogs2.length === 0">
					
					<h2>You have no blog available</h2>
					
				</div>

			</div>

		</div>
	</div>

</template>

<style scoped>

	.admin-dashboard{
		border: solid 5px #004385;
		border-left: none;
		border-bottom: none;
		border-right: none;
		padding: 20px;
		border-radius: 10px;
		box-shadow: 0px 0px 5px gray;
		margin-bottom: 20px;
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		cursor: pointer;
		gap: 10px;
	}

	.admin-dashboard h3{
		margin: 0;
		font-weight: bolder;
		font-size: 40px;
	}

	.total-author-blogs{
		display: flex;
		gap: 50px;
		text-align: center;
	}

	.total-author-blogs label{
		font-size: 14px;
		font-weight: bolder;
		margin: 0;
		color: gray;
	}

	.total-author-blogs p{
		padding: 5px 20px;
		border: solid 1px lightgray;
		border-radius: 5px;
		font-weight: 600;
		margin: 0;
	}

	.modals{
		padding: 20px;
		border-radius: 10px;
		box-shadow: 0px 0px 5px gray;
		margin-bottom: 20px;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		cursor: pointer;
		gap: 10px;
		position: fixed;
		background-color: white;
		z-index: 2;
		top: 20%;
		left: 35%;
		display: flex;
		flex-direction: column;
		width: 100%;
		max-width: 500px;
	}

	@media (max-width: 768px) {
		.modals{
			left: 12%;
		}
	}

	@media (max-width: 407px) {
		.modals{
			left: 0%;
		}
	}

	.save-exit-btn{
		display: flex;
		justify-content: space-between;
		width: 100%;
		gap: 10px;
	}

	.modals button{
		width: 100%;
		border: none;
		color: white;
		font-size: 14px;
		font-weight: bold;
		padding: 5px;
		border-radius: 5px;
		background-color: #004385;
		transition: .2s ease;
		letter-spacing: 3px;
	}

	.modals button:hover{
		background-color: orange;
		translate: -2px -2px;
		box-shadow: 2px 2px 2px gray;
	}

	.blog-details{
		display: flex;
		flex-direction: column;
		width: 100%;
	}

	.blog-details input{
		width: 100%;
		border: solid 1px lightgray;
		outline: none;
		font-size: 14px;
		border-radius: 4px;
		padding: 7px 15px;
		margin-bottom: 10px;
	}

	.blog-details label{
		font-size: 14px;
		font-weight: bold;
		color: gray;
	}

	.add-blog{
		border: solid 5px #004385;
		border-left: none;
		border-bottom: none;
		border-right: none;
		padding: 20px;
		border-radius: 10px;
		box-shadow: 0px 0px 5px gray;
		margin-bottom: 20px;
		position: relative;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		cursor: pointer;
		gap: 10px;
	}

	.add-blog h3{
		font-weight: bold;
		flex: 3;
	}

	.add-blog-box{
		display: flex;
		flex: 9;
		gap: 10px;
	}

	.add-blog button{
		flex: 2;
		font-size: 14px;
		font-weight: bold;
		color: white;
		border: none;
		border-radius: 5px;
		padding: 3px;
		background-color: #004385;
		transition: .2s ease;
	}

	.add-blog button:hover{
		background-color: orange;
		translate: -2px -2px;
		box-shadow: 2px 2px 2px gray;
	}

	.add-blog-box2{
		width: 100%;
	}

	.add-blog-box2 label{
		font-size: 14px;
		font-weight: bold;
		color: gray;
	}

	.add-blog-box2 input{
		width: 100%;
		padding: 5px 15px;
		border: solid 1px lightgray;
		border-radius: 5px;
		font-size: 14px;
		outline: none;
	}

	@media (max-width: 407px){
		.add-blog{
			flex-direction: column;
		}
		.add-blog button{
			width: 100%;
		}
	}


	.navbar-box{
		position: sticky;
		top: 10px;
	}
	
	.side-nav{
		padding: 20px;
		border-radius: 10px;
		box-shadow: 0px 0px 5px gray;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		position: relative;
	}

	.side-nav p{
		font-size: 14px;
		margin: 0;
	}

	.side-nav img{
		height: 100px;
		width: 100px;
		border-radius: 100px;
		border: solid 2px green;
		margin-bottom: 10px;
	}

	.side-nav button{
		position: absolute;
		right: 10px;
		top: 10px;
		font-size: 12px;
		font-weight: 600;
		padding: 3px 10px;
		border: none;
		border-radius: 5px;
		color: white;
		background-color: #004385;
		transition: .2s;
	}

	.side-nav button:hover{
		background-color: orange;
		translate: -2px -2px;
		box-shadow: 2px 2px 2px gray;
	}

	.role{
		position: absolute;
		left: 10px;
		top: 10px;
		padding: 2px 10px;
		background-color: #004385;
		border-radius: 5px;
		color: white;
		font-weight: 600;
	}

	.actions{
		padding: 20px;
		border-radius: 10px;
		box-shadow: 0px 0px 5px gray;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		position: relative;
		margin-bottom: 20px;
	}

	.btn-options{
		display: flex;
		gap: 10px;
		width: 100%;
	}

	.btn-options button{
		width: 100%;
		border: solid 1px lightgray;
		border-radius: 5px;
		padding: 4px;
		font-size: 14px;
		font-weight: 600;
	}

	.btn-options button.active{
		background-color: orange;
	}








	.display-blog{
		border: solid 5px #004385;
		border-left: none;
		border-bottom: none;
		border-right: none;
		padding: 20px;
		border-radius: 10px;
		box-shadow: 0px 0px 5px gray;
		margin-bottom: 20px;
		position: relative;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		cursor: pointer;
	}

	.blog-profile{
		position: absolute;
		top: 10px;
		left: 10px;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
	}

	.blog-profile img{
		height: 60px;
		width: 60px;
		border-radius: 100px;
		border: solid 2px green;
	}

	.blog-profile p{
		font-size: 12px;
	}

	.text{
		font-size: 16px;
		margin: 0;
	}

	.display-blog p:nth-child(3){
		width: 70%;
		padding: 10px;
		font-weight: 500;
	}

	.display-blog p:nth-child(4){
		margin: 0;
		font-size: 14px;
		font-weight: bold;
	}

	.parent-comment{
		width: 100%;
		display: flex;
		justify-content: center;
		flex-direction: column;
		align-items: center;
		padding: 5px;
		background-color: whitesmoke;
		border-radius: 10px;
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
		width: 100%;
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

	@media (max-width: 768px) {
		.blog-profile{
			position: relative;
		}

		.display-blog p:nth-child(3){
			width: 100%;
		}

		.comments{
			width: 90%;
		}

		.input-box{
			width: 100%;
		}
	}

	@media (max-width: 407px){
		.navbar-box{
			position: relative;
		}
	}

	.del-edit-btn{
		position: absolute;
		right: 10px;
		top: 10px;
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.del-edit-btn button{
		padding: 2px 20px;
		border: none;
		border-radius: 3px;
		font-size: 12px;
		font-weight: bold;
	}

	.delete-view-btn{
		display: flex;
		flex-direction: column;
		position: absolute;
		top: 10px;
		right: 10px;
		gap: 5px;
	}

	.admin-delete-button{
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

	.admin-delete-button:hover{
		background-color: #004385;
		color: white;
		translate: -2px -2px;
		box-shadow: 2px 2px 2px gray;
	}

	.view-blog{
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