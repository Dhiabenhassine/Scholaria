const express = require('express');
const router = express.Router();
const {absent}= require('../controllers/StudentsController')

router.post('/absent',async(req,res)=>{
    try{
const results= await absent(req,res)
res.json(results)
    }catch(err){
        res.status(500),json('err from routes')
    }
})

module.exports = router;
