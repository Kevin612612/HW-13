import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../app.module';

jest.setTimeout(100000);

//create function for creating random string
export const generateRandomString = (length: number) => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

//create random user
export function createUser() {
  return {
    login: generateRandomString(5) + 'user',
    password: generateRandomString(6),
    email: generateRandomString(10) + '@gmail.com',
  };
}
//create random blog
export function createBlog() {
  return {
    name: generateRandomString(5) + 'user',
    description: generateRandomString(10),
    websiteUrl: 'https://' + generateRandomString(5) + '@gmail.com',
  };
}
//create random blog
export function createPost() {
  return {
    content: generateRandomString(5) + 'post',
    shortDescription: 'about' + generateRandomString(10),
    title: 'title' + generateRandomString(5),
    blogId: '0',
  };
}

describe('PostController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('GET -> "/posts/:postId": get post by unauthorized user.', async () => {
    const user_1 = createUser();
    const blog_1 = createBlog();
    const post_1 = createPost();
    //clear data
    const cleanAll = await request(app.getHttpServer()).del(`/testing/all-data`);
    //user
    const userResponse = await request(app.getHttpServer()).post(`/users`).auth('admin', 'qwerty', { type: 'basic' }).send(user_1);
    const createdUser1 = userResponse.body;
    console.log(createdUser1);
    //login user
    const loginResponse = await request(app.getHttpServer()).post(`/auth/login`).send({
      loginOrEmail: user_1.login,
      password: user_1.password,
    });
    const accessTokenUser_1 = loginResponse.body.accessToken;
    console.log(accessTokenUser_1);
    //blog
    const blogResponse = await request(app.getHttpServer()).post(`/blogs`).auth('admin', 'qwerty', { type: 'basic' }).send(blog_1);
    const createdBlog1 = blogResponse.body;
    console.log(createdBlog1);
    //
    post_1.blogId = createdBlog1.id;
    //post
    const postResponse = await request(app.getHttpServer()).post(`/posts`).auth('admin', 'qwerty', { type: 'basic' }).send(post_1);
    const createdPost1 = postResponse.body;
    console.log(createdPost1);
    //like post by user 1
    const likePost_1byUser_1 = await request(app.getHttpServer())
      .put(`/posts/${createdPost1.id}/like-status`)
      .auth(`${accessTokenUser_1}`, { type: 'bearer' })
      .send({
        likeStatus: 'Like',
      });
    //get post
    const getPostResponse = await request(app.getHttpServer()).get(`/posts/${createdPost1.id}`);
    console.log(getPostResponse.body);
  });
});
