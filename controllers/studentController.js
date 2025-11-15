const Student = require('../models/studentModel');

exports.listStudents =  async (req, res, next) => {
    try {
        const students = await Student.findAll();
        res.render('students', { title: 'All students', students });
    }
    catch(err) {
        next(err);
    }
};