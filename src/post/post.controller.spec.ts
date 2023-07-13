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

  it('test', async () => {
    //create 4 users
    //login 4 users
    //ctreate blog
    //create post
    //like post by each user
    //get post by user1
    const users = [];
    const accessTokens = [];
    for (let index = 0; index < 4; index++) {
      users.push(createUser());
    }
    const blog_1 = createUser();
    const post_1 = createPost();

    //clear data
    const cleanAll = await request(app.getHttpServer()).del(`/testing/all-data`);
    //users
    const user_1Response = await request(app.getHttpServer()).post(`/users`).auth('admin', 'qwerty', { type: 'basic' }).send(users[0]);
    const user_2Response = await request(app.getHttpServer()).post(`/users`).auth('admin', 'qwerty', { type: 'basic' }).send(users[1]);
    const user_3Response = await request(app.getHttpServer()).post(`/users`).auth('admin', 'qwerty', { type: 'basic' }).send(users[2]);
    const user_4Response = await request(app.getHttpServer()).post(`/users`).auth('admin', 'qwerty', { type: 'basic' }).send(users[3]);
    const createdUser1 = user_1Response.body;
    const createdUser2 = user_2Response.body;
    const createdUser3 = user_3Response.body;
    const createdUser4 = user_4Response.body;
    //login users
    const login_1Response = await request(app.getHttpServer()).post(`/auth/login`).send({
      loginOrEmail: users[0].login,
      password: users[0].password,
    });
    const login_2Response = await request(app.getHttpServer()).post(`/auth/login`).send({
      loginOrEmail: users[1].login,
      password: users[1].password,
    });
    const login_3Response = await request(app.getHttpServer()).post(`/auth/login`).send({
      loginOrEmail: users[2].login,
      password: users[2].password,
    });
    const login_4Response = await request(app.getHttpServer()).post(`/auth/login`).send({
      loginOrEmail: users[3].login,
      password: users[3].password,
    });
    const accessTokenUser_1 = login_1Response.body.accessToken;
    const accessTokenUser_2 = login_2Response.body.accessToken;
    const accessTokenUser_3 = login_3Response.body.accessToken;
    const accessTokenUser_4 = login_4Response.body.accessToken;
    accessTokens.push(accessTokenUser_1, accessTokenUser_2, accessTokenUser_3, accessTokenUser_4);

    //blog
    const blogResponse = await request(app.getHttpServer()).post(`/blogs`).auth('admin', 'qwerty', { type: 'basic' }).send(blog_1);
    const createdBlog1 = blogResponse.body;

    //
    post_1.blogId = createdBlog1.id;
    //post
    const postResponse = await request(app.getHttpServer()).post(`/posts`).auth('admin', 'qwerty', { type: 'basic' }).send(post_1);
    const createdPost1 = postResponse.body;

    //like post by users
    for (let i = 0; i < 4; i++) {
      const likePost_1byUsers = await request(app.getHttpServer())
        .put(`/posts/${createdPost1.id}/like-status`)
        .auth(`${accessTokens[i]}`, { type: 'bearer' })
        .send({
          likeStatus: 'Like',
        });
    }

    //get post by user_1
    const getPostResponse = await request(app.getHttpServer())
      .get(`/posts/${createdPost1.id}`)
      .auth(`${accessTokens[0]}`, { type: 'bearer' });
    console.log(getPostResponse.body);
  });
});
