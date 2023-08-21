import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../app.module';
import { createBlog, createComment, createPost, createUser } from '../secondary functions/secondary functions';

jest.setTimeout(100000);

describe('CommentController (e2e)', () => {
	let app: INestApplication;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();
	});

	afterAll(async () => {
		await app.close();
	});

	it('test1', async () => {
		//create user
		//login user
		//create blog
		//create post
		//create comment
		//like comment by 2 user
		//get comment

		const user = createUser();
		const user2 = createUser();
		const blog = createBlog();
		const post = createPost();
		const comment = createComment();

		//clear data
		const cleanAll = await request(app.getHttpServer()).del(`/testing/all-data`);
		//user
		const userResponse = await request(app.getHttpServer())
			.post(`/sa/users`)
			.auth('admin', 'qwerty', { type: 'basic' })
			.send(user);
		const createdUser = userResponse.body;
		console.log(createdUser);
		//login user
		const loginResponse = await request(app.getHttpServer()).post(`/auth/login`).send({
			loginOrEmail: user.login,
			password: user.password,
		});
		const accessTokenUser = loginResponse.body.accessToken;
		console.log(accessTokenUser);
		//blog
		const blogResponse = await request(app.getHttpServer())
			.post(`/blogger/blogs`)
			.auth(`${accessTokenUser}`, { type: 'bearer' })
			.send(blog);
		const createdBlog = blogResponse.body;
		console.log(createdBlog);
		//
		post.blogId = createdBlog.id;
		//post
		const postResponse = await request(app.getHttpServer())
			.post(`/blogger/blogs/${createdBlog.id}/posts`)
			.auth(`${accessTokenUser}`, { type: 'bearer' })
			.send(post);
		const createdPost = postResponse.body;
		console.log(createdPost);
		//comment
		const commentResponse = await request(app.getHttpServer())
			.post(`/posts/${createdPost.id}/comments`)
			.auth(`${accessTokenUser}`, { type: 'bearer' })
			.send(comment);
		const createdComment = commentResponse.body;
		console.log(createdComment);

		//user2
		const user2Response = await request(app.getHttpServer())
			.post(`/sa/users`)
			.auth('admin', 'qwerty', { type: 'basic' })
			.send(user2);
		const createdUser2 = user2Response.body;
		console.log(createdUser2);
		//login user2
		const login2Response = await request(app.getHttpServer()).post(`/auth/login`).send({
			loginOrEmail: user2.login,
			password: user2.password,
		});
		const accessTokenUser2 = login2Response.body.accessToken;
		console.log(accessTokenUser2);

		//like comment by user2
		const likeCommentByUser2 = await request(app.getHttpServer())
			.put(`/comments/${createdComment.id}/like-status`)
			.auth(`${accessTokenUser2}`, { type: 'bearer' })
			.send({
				likeStatus: 'Like',
			});
		console.log('likeCommentByUser2', likeCommentByUser2.status);

		//get comment
		const getCommentResponse = await request(app.getHttpServer()).get(`/comments/${createdComment.id}`);
		console.log(getCommentResponse.body);

    //ban user2
    const banUser2 = await request(app.getHttpServer())
			.put(`/sa/users/${createdUser2.id}/ban`)
			.auth('admin', 'qwerty', { type: 'basic' })
			.send({
        isBanned: true,
        banReason: "the reason to ban user is the violating the rules"
      });
		console.log('banUser2', banUser2.status);

    //get comment again
    const getCommentResponseAgain = await request(app.getHttpServer()).get(`/comments/${createdComment.id}`);
		console.log(getCommentResponseAgain.body);
	});
});
