import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../app.module';
import { createUser } from '../user/user.controller.spec';
import { appSettings } from '../app.settings';

jest.setTimeout(10_000);

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

  it('test', async () => {
    //create user 1
    const user1 = createUser();
    const userResponse1 = await request(app.getHttpServer()).post(`/users`).auth('admin', 'qwerty', { type: 'basic' }).send(user1);
    const createdUser1 = userResponse1.body;
    console.log('created user 1:', createdUser1);

    //login user 1
    const loginResponse1 = await request(app.getHttpServer()).post(`/auth/login`).set('User-Agent', 'jest').send({
      loginOrEmail: user1.login,
      password: user1.password,
    });
    const accessToken1 = loginResponse1.body.accessToken;
    const refreshToken1 = loginResponse1.headers['set-cookie'][0].split(';')[0].split('=')[1];
    //console.log('accessToken login:', accessToken);
    //console.log('refreshToken login:', refreshToken);

    //Get device list by user 1
    const deviceList1 = await request(app.getHttpServer())
      .get(`/security/devices`)
      .auth(`${accessToken1}`, { type: 'bearer' })
      .set('Cookie', `refreshToken=${refreshToken1}`);
    console.log(deviceList1.body);

    //Create user 2, login user 2 with the same user-agent header as user 1.
    //create user 2
    const user2 = createUser();
    const userResponse2 = await request(app.getHttpServer()).post(`/users`).auth('admin', 'qwerty', { type: 'basic' }).send(user2);
    const createdUser2 = userResponse2.body;
    console.log('created user 2:', createdUser2);

    //login user 2
    const loginResponse2 = await request(app.getHttpServer()).post(`/auth/login`).set('User-Agent', 'jest').send({
      loginOrEmail: user2.login,
      password: user2.password,
    });
    const accessToken2 = loginResponse2.body.accessToken;
    const refreshToken2 = loginResponse2.headers['set-cookie'][0].split(';')[0].split('=')[1];

    //Try to delete second device by user2 from device list of user1.
    const deleteDevice = await request(app.getHttpServer())
      .delete(`/security/devices/${2}`)
      .auth(`${accessToken2}`, { type: 'bearer' })
      .set('Cookie', `refreshToken=${refreshToken2}`);
  });
});
