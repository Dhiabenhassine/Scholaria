const request = require('supertest');
const express = require('express');
const app = express();
const sequelize = require('../config/db');
const { insertClasses, insertTeacherIdClasses, getAllClasses } = require('../controllers/Classes');

const mockQuery = jest.fn();

jest.mock('../config/db', () => ({
  query: (...args) => mockQuery(...args),
  QueryTypes: { SELECT: 'SELECT', INSERT: 'INSERT', UPDATE: 'UPDATE' }
}));

app.use(express.json());
app.post('/admin/insertClasses', insertClasses);
app.post('/admin/insertTeacherIdClasses', insertTeacherIdClasses);
app.get('/admin/getAllClasses', async (req, res) => {
  try {
    const data = await getAllClasses();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

describe('Class Controller Test', () => {
  beforeEach(() => {
    mockQuery.mockReset();
  });

  describe('GET /admin/getAllClasses', () => {
    it('should return all classes from the database', async () => {
      const mockData = [
        { id: 1, ClassName: 'Math', ClassNumber: '101', TeacherId: '{1,2}' },
        { id: 2, ClassName: 'Science', ClassNumber: '102', TeacherId: '{3}' }
      ];

      mockQuery.mockResolvedValueOnce(mockData);

      const response = await request(app).get('/admin/getAllClasses');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockData);

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('SELECT * FROM Classes'),
        { type: 'SELECT' }
      );
    });
  });
  describe('insert Classes', () => {
  it('should insert classes successfully', async () => {
    const mockClass = [{ id_Classes: 1, className: '2', classNumber: 2 }];
    mockQuery.mockResolvedValueOnce(mockClass);

    const response = await request(app).post('/admin/insertClasses').send({
      className: '3',
      classNumber: '4'
    });

 expect(response.status).toBe(200);
expect(response.body.message).toBe('insert Class success');

  });
});
describe('Update TeacherId Classes', () => {
  it('should update teacherId in class', async () => {
    mockQuery
      .mockResolvedValueOnce([{ id_Users: 4 }]) 
      .mockResolvedValueOnce([{ TeacherId: null }]) 
      .mockResolvedValueOnce([1]);

    const response = await request(app).post('/admin/insertTeacherIdClasses').send({
      TeacherId: '4',
      className: '1',
      classNumber: '4' 
    });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('update TeacherId Class Sucess');
  });
});


  
});
