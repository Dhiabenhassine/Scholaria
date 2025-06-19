const request = require('supertest');
const express = require('express');
const sequelize = require('../config/db');
const { GetAllUsers, getUserById, login } = require('../../Admin/controllers/Usercontroller');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn()
}));

jest.mock('../config/db', () => ({
  query: jest.fn(),
  QueryTypes: { SELECT: 'SELECT', INSERT: 'INSERT' },
}));

const app = express();
app.use(express.json());

app.get('/admin/users', GetAllUsers);
app.post('/admin/getUserById', getUserById);
app.post('/admin/login', login);

describe('Auth Controller Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GetAllUsers', () => {
    it('should return all users', async () => {
      const fakeUsers = [{ Id: 1, Name: 'Dhia', Phone: '123456789' }];
      sequelize.query.mockResolvedValue(fakeUsers);

      const response = await request(app).get('/admin/users');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(fakeUsers);
    });
  });

  describe('getUserById', () => {
    it('should return user by ID', async () => {
      const mockUser = { id_Users: 1, Name: 'Dhia', Phone: '123456789' };
      sequelize.query.mockResolvedValueOnce([mockUser]);

      const response = await request(app)
        .post('/admin/getUserById')
        .send({ id_Users: 1 });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUser);
    });

    it('should return 404 if user not found', async () => {
      sequelize.query.mockResolvedValueOnce([]);

      const response = await request(app)
        .post('/admin/getUserById')
        .send({ id_Users: 999 });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('User not found');
    });

    it('should handle errors when fetching user by ID', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  sequelize.query.mockRejectedValueOnce(new Error('Database error'));

  const response = await request(app)
    .post('/admin/getUserById')
    .send({ id_Users: 1 });

  expect(response.status).toBe(500);
  expect(response.body.message).toBe('Internal server error');

  consoleSpy.mockRestore();
    });
  });

  describe('login', () => {
    it('should login successfully and return mocked token', async () => {
      const hashedPassword = await bcrypt.hash('test123', 10);
      const mockUser = [{ id_Users: 1, Name: 'Dhia', Phone: '123456789', Pwd: hashedPassword }];

      sequelize.query.mockResolvedValueOnce(mockUser);
      jwt.sign.mockReturnValue('mocked-jwt-token');

      const response = await request(app).post('/admin/login').send({
        phone: '123456789',
        password: 'test123'
      });

expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body.message).toBe('Login successful');
    });

  it('should return error for wrong password', async () => {
  const hashedPassword = await bcrypt.hash('wrongpass', 10);
  const mockUser = [{ Id: 1, Name: 'Dhia', Pwd: hashedPassword }];

  sequelize.query.mockResolvedValueOnce(mockUser);

  const response = await request(app).post('/admin/login').send({
    phone: '123456789',
    password: 'test123'
  });

  expect(response.status).toBe(400);
  expect(response.body.message).toBe('Invalid password');
});

it('should return error if user not found', async () => {
  sequelize.query.mockResolvedValueOnce([]);

  const response = await request(app).post('/admin/login').send({
    phone: '000000000',
    password: 'test123'
  });

  expect(response.status).toBe(400);
  expect(response.body.message).toBe('User not found');
});
  })
});
