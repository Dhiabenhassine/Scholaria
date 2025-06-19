const request = require('supertest')
const express = require ('express')
const app = express()
const sequelize = require('../config/db')
const {selectAllStudents,
    insertStudent,
    selectStudentById,updatetudent
}= require ('../controllers/StudentController')
const { QueryTypes } = require('sequelize')

const mockQuery = jest.fn()

jest.mock('../config/db',()=>({
    query:(...args)=> mockQuery(...args),
    QueryTypes: {SELECT: 'SELECT', INSERT:'INSERT',UPDATE:'UPDATE'}
}))

app.use(express.json())
app.get('/admin/getAllStudents',async(req,res)=>{
try{
const data= await selectAllStudents()
res.status(200).json(data)
}catch(err){
    res.status(500).json({mesage:err.message})
}
})
app.post('/admin/insertStudent',insertStudent)
app.post('/admin/getStudentById',selectStudentById)
app.post('/admin/updateStudent',updatetudent)

describe ('Student Controller Test',()=>{
    beforeEach(()=>{
        mockQuery.mockReset()
    })

    describe('GET /admin/getAllStudents',()=>{
        it('should return all students from the database',async()=>{
            const mockData=[
                {id:1,FirstName:'dhia',LastName:'bh',id_Classes:5},
                {id:2,FirstName:'amir',LastName:'mh',id_Classes:6}
            ]
        mockQuery.mockResolvedValueOnce(mockData)
        const response = await request(app).get('/admin/getAllStudents')
        expect(response.status).toBe(200)
        expect(response.body).toEqual(mockData)
        expect(mockQuery).toHaveBeenCalledWith(
            expect.stringContaining('SELECT * FROM Students'),
            {type:'SELECT'}
        )
        
        })
    })
})