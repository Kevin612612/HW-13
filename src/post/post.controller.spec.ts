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

describe('PostController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', async () => {
    const response = await request(app.getHttpServer()).get(`/posts/1`);
    console.log(response.body);
  });

  it('create user', async () => {
    //create user
    const user = createUser()
    //expected result
    const expectedResult = {
        id: expect.any(String),
        login: user.login,
        email: user.email,
        createdAt: expect.any(String)
    }
    //response
    const response = await request(app.getHttpServer()).post(`/users`).auth("admin", "qwerty", {type: "basic"}).send(user)
    const createdUser1 = response.body
    console.log(createdUser1)
  });
});
