const express = require('express');
const methodOverride = require('method-override');
const router = express.Router();
const studentController = require('../controllers/studentController');

router.use(methodOverride('_method'));

router.get('/', (req, res) => res.redirect('/students'));

router.get('/students', studentController.listStudents);
router.get('/students/new', studentController.newStudentForm);
router.post('/students', studentController.createStudent);
//router.get('/students/:id/edit', studentController.editStudentForm);
router.get('/students/:id', studentController.showStudent);
//router.put('/students/:id', studentController.updateStudent);
//router.delete('/students/:id', studentController.deleteStudent);

module.exports = router;