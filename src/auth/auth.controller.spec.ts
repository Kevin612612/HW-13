import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../app.module';
import { createUser } from '../user/user.controller.spec';
import { appSettings } from '../app.settings';

jest.setTimeout(100000);

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    appSettings(app);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('test 1', async () => {
    const user = createUser();
    const userResponse = await request(app.getHttpServer()).post(`/users`).auth('admin', 'qwerty', { type: 'basic' }).send(user);
    const createdUser = userResponse.body;

    const loginResponse = await request(app.getHttpServer()).post(`/auth/login`).send({
      loginOrEmail: user.login,
      password: user.password,
    });
    const accessToken = loginResponse.body.accessToken;
    const refreshToken = loginResponse.headers['set-cookie'][0].split(';')[0].split('=')[1];
    //delay
    setTimeout(() => {}, 10000);
    
    const res = await request(app.getHttpServer()).post(`/auth/refresh-token`).send({}).set('Cookie', `refreshToken=${refreshToken}`);
    const newAccessToken = res.body.accessToken;
    const newRefreshToken = res.headers['set-cookie'][0].split(';')[0].split('=')[1];
    console.log(newAccessToken);
    console.log(newRefreshToken);

    const res1 = await request(app.getHttpServer()).post(`/auth/logout`).send({}).set('Cookie', `refreshToken=${newRefreshToken}`);
    console.log(res1.body);


  });
});
