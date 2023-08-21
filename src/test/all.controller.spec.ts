import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../app.module';
import { createBlogDTO, createCommentDTO, createPostDTO, createUserDTO } from './functionsForTesting';

jest.setTimeout(100000);

describe('all tests (e2e)', () => {
	let app: INestApplication;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		const server = app.getHttpServer();

		await app.init();
	});

	afterAll(async () => {
		await app.close();
	});

	it('test1', async () => {
		const server = app.getHttpServer();
		const cleanDB = async () => {
			await request(server).del(`/testing/all-data`);
		};
		const getBlogsBySisAdmin = async () => {
			const blogsResponse = await request(server)
				.get(`/sa/blogs?pageSize=5&pageNumber=1&searchNameTerm=blog&sortDirection=asc&sortBy=id`)
				.auth('admin', 'qwerty', { type: 'basic' });
			const createdBlogs = blogsResponse.body;
			console.log(createdBlogs);
			return createdBlogs;
		};
		const bindBlogWithUser = async (blogId, userId) => {
			const bindingResponse = await request(server)
				.put(`/sa/blogs/${blogId}/bind-with-user/${userId}`)
				.auth('admin', 'qwerty', { type: 'basic' });
			console.log(bindingResponse.status);
		};
		const banUser = async (userId) => {
			const banUser = await request(server).put(`/sa/users/${userId}/ban`).auth('admin', 'qwerty', { type: 'basic' }).send({
				isBanned: true,
				banReason: 'the reason to ban user is just for testing',
			});
			console.log('banUser', banUser.status);
		};
		const getUsersBySisAdmin = async () => {
			const usersResponse = await request(server).get(`/sa/users`).auth('admin', 'qwerty', { type: 'basic' });
			const users = usersResponse.body;
			console.log(users);
			return users;
		};
		const createUserBySisAdmin = async (userDto) => {
			const userResponse = await request(server).post(`/sa/users`).auth('admin', 'qwerty', { type: 'basic' }).send(userDto);
			const createdUser = userResponse.body;
			console.log(createdUser);
			return createdUser;
		};
		const deleteUserById = async (userId) => {
			const deletedUserResponse = await request(server).delete(`/sa/users/${userId}`).auth('admin', 'qwerty', { type: 'basic' });
			console.log('deletedUserResponse', deletedUserResponse.status);
		};
		const loginUser = async (userDto) => {
			const loginResponse = await request(server).post(`/auth/login`).send({
				loginOrEmail: userDto.login,
				password: userDto.password,
			});
			const accessToken = loginResponse.body.accessToken;
			console.log(accessToken);
			return accessToken;
		};
		const createBlogInDbByBlogger = async (accessTokenUser) => {
			const blogDto = createBlogDTO();
			const blogResponse = await request(server)
				.post(`/blogger/blogs`)
				.auth(`${accessTokenUser}`, { type: 'bearer' })
				.send(blogDto);
			const createdBlog = blogResponse.body;
			console.log(createdBlog);
			return createdBlog;
		};
		const createPostInDbByBlogger = async (blogId, accessTokenUser) => {
			const postDto = createPostDTO();
			const postResponse = await request(server)
				.post(`/blogger/blogs/${blogId}/posts`)
				.auth(`${accessTokenUser}`, { type: 'bearer' })
				.send(postDto);
			const createdPost = postResponse.body;
			console.log(createdPost);
			return createdPost;
		};
		const createCommentInDbByUser = async (postId, accessTokenUser) => {
			const commentDto = createCommentDTO();
			const commentResponse = await request(server)
				.post(`/posts/${postId}/comments`)
				.auth(`${accessTokenUser}`, { type: 'bearer' })
				.send(commentDto);
			const createdComment = commentResponse.body;
			console.log(createdComment);
			return createdComment;
		};
		const likePost = async (postId, accessTokenUser, likeStatus) => {
			const likePostByUser = await request(server)
				.put(`/posts/${postId}/like-status`)
				.auth(`${accessTokenUser}`, { type: 'bearer' })
				.send({
					likeStatus: likeStatus,
				});
			console.log('likePostByUser', likePostByUser.status);
		};
		const likeComment = async (commentId, accessTokenUser, likeStatus) => {
			const likeCommentByUser = await request(server)
				.put(`/comments/${commentId}/like-status`)
				.auth(`${accessTokenUser}`, { type: 'bearer' })
				.send({
					likeStatus: likeStatus,
				});
			console.log('likeCommentByUser', likeCommentByUser.status);
		};
		const getCommentByUser = async (commentId) => {
			const getCommentResponse = await request(server).get(`/comments/${commentId}`);
			const comment = getCommentResponse.body;
			console.log(comment);
			return comment;
		};

		//POST -> /sa/users, POST => /auth/login, POST -> /blogger/blogs, GET -> /sa/blogs
		//await cleanDB();
		//const userDto = createUserDTO();
		//await createUserBySisAdmin(userDto);
		//const token = await loginUser(userDto);
		//await createBlogInDbByBlogger(token);
		await getBlogsBySisAdmin();
	});
});
