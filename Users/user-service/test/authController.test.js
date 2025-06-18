const request = require('supertest');
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Register, GetAllUsers, login } = require('../controllers/Usercontroller');
const sequelize = require('../config/db');

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn()
}));


jest.mock('../config/db', () => ({
  query: jest.fn(),
  QueryTypes: { SELECT: 'SELECT', INSERT: 'INSERT' },
}));

const app = express();
app.use(express.json());

app.post('/register', Register);
app.get('/users', GetAllUsers);
app.post('/login', login);

describe('Auth Controller Tests', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Register', () => {
    it('should register a new user', async () => {
      sequelize.query
        .mockResolvedValueOnce([]) 
        .mockResolvedValueOnce([{ insertId: 1 }]); 

      const response = await request(app).post('/register').send({
        name: 'Dhia',
        phone: '123456789',
        password: 'test123'
      },
    {
        name: 'amir',
        phone: '90117343',
        password: '1234587'
      },
    {
        name: 'Dhia',
        phone: '123456789',
        password: 'test123'
      });

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('User Registered successfully');
    });

    it('should login successfully and return mocked token', async () => {
  const hashedPassword = await bcrypt.hash('test123', 10);
  const mockUser = [{ Id: 1, Name: 'Dhia', Pwd: hashedPassword }];

  sequelize.query.mockResolvedValueOnce(mockUser);
  jwt.sign.mockReturnValue('mocked-jwt-token');

  const response = await request(app).post('/login').send({
    phone: '123456789',
    password: 'test123'
  });

  expect(response.status).toBe(200);
  expect(response.body.token).toBe('mocked-jwt-token');
  expect(jwt.sign).toHaveBeenCalledWith(
    { userId: mockUser[0].Id },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
});
  })

  describe('GetAllUsers', () => {
    it('should return all users', async () => {
      const fakeUsers = [{ Id: 1, Name: 'Dhia', Phone: '123456789' }];
      sequelize.query.mockResolvedValue(fakeUsers);

      const response = await request(app).get('/users');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(fakeUsers);
    });
  });

  describe('Login', () => {
    it('should login successfully with correct credentials', async () => {
      const hashedPassword = await bcrypt.hash('test123', 10);
      const mockUser = [{ Id: 1, Name: 'Dhia', Pwd: hashedPassword }];

      sequelize.query.mockResolvedValueOnce(mockUser);

      const response = await request(app).post('/login').send({
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

      const response = await request(app).post('/login').send({
        phone: '123456789',
        password: 'test123' // wrong password
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Invalid password');
    });

    it('should return error if user not found', async () => {
      sequelize.query.mockResolvedValueOnce([]);

      const response = await request(app).post('/login').send({
        phone: '000000000',
        password: 'test123'
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('User not found');
    });
  });
});