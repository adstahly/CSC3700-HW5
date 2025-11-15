const express = require('express');
const methodOverride = require('method-override');
const router = express.Router();
const studentController = require('../controllers/studentController');

router.use(methodOverride('_method'));

router.get('/students', studentController.listStudents);

module.exports = router;