import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET) /request', () => {
    return request(app.getHttpServer())
      .get('/request')
      .expect(200);
  });

  it('/ (GET) /request/balance', () => {
    return request(app.getHttpServer())
      .get('/request/balance')
      .expect(200);
  });

  it('/ (GET) /request/customer-name', () => {
    return request(app.getHttpServer())
      .get('/request/customer-name')
      .expect(200);
  });

  it('/ (GET) /request/account-worth', () => {
    return request(app.getHttpServer())
      .get('/request/account-worth')
      .expect(200);
  });
});
