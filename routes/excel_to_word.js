const express = require('express');
const router = express.Router();
const excelController = require('../controllers/excelController')
const bodyParser = require('body-parser')
const fileUpload = require("express-fileupload");

const parseExcelMiddleware = bodyParser.raw({type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'})

router.route('/')
    .post(/*parseExcelMiddleware, */ fileUpload({ createParentPath: true }), excelController.excel_to_word)
   
module.exports = router;