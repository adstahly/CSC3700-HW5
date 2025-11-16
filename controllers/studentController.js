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

exports.showStudent = async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        if (!Number.isInteger(id) || id <= 0)
            return res.status(400).send('Invalid Id');

        const student = await Student.findById(id);
        if (!student)
            return res.status(404).send('Student not Found');
        res.render('studentDetails', { title: `Student#${id}`, student });
    } catch (err) {
        next(err);
    }
}

exports.newStudentForm = (req, res) => {
    res.render('studentForm', {
        title: 'Add Student',
        student: {FirstName: '', LastName: '', Major: '', GPA: ''},
        action: '/students',
        submitLabel: 'Create'
    });
}

exports.createStudent = async (req, res, next) => {
    const studentData = scrub(req.body);
    const errors = validateStudent(studentData);

    if (Object.keys(errors).length > 0) {
        return res.status(400).render('studentForm', {
            title: 'Add Student',
            errors,
            student: studentData,
            action: '/students',
            submitLabel: 'Create'
        })
    }
    try {
        const gpaValue = studentData.GPA === '' ? null : parseFloat(studentData.GPA);
        const {FirstName, LastName, Major} = studentData;
        const id = await Student.create({ FirstName, LastName, Major: Major || null, GPA: gpaValue });
        res.redirect(`/students/${id}`);
    } catch (err) {
        next(err);
    }
};

function validateStudent({FirstName, LastName, Major, GPA}) {
    const errors = {}

    if (!FirstName) errors.firstNameError = "First Name is required";
    if (!LastName) errors.lastNameError = "Last Name is required";
    if (Major.length > 20) errors.majorError = "Major must be less than 20 characters";
    if (GPA) {
        const gpaValue = parseFloat(GPA);
        if (isNaN(gpaValue)) {
            errors.GPAError = "GPA must be a number";
        } else if (gpaValue < 0.00 || gpaValue > 5.00) {
            errors.GPAError = "GPA must be between 0.00 and 5.00";
        }
    }
    return errors;
}

function scrub({FirstName, LastName, Major, GPA}) {
    return {
        FirstName: String(FirstName ?? '').trim(),
        LastName: String(LastName ?? '').trim(),
        Major: String(Major ?? '').trim(),
        GPA: String(GPA ?? '').trim(),
    }
}