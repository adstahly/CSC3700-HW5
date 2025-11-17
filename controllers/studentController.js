const Student = require('../models/studentModel');

exports.listStudents =  async (req, res, next) => {
    try {
        const q = req.query.q
        let students;

        if (q)
            students = await Student.findAll(q);
        else
            students = await Student.findAll();

        const renderOptions = {
            title: 'All Students',
            students,
            q: q || ''
        };

        if (students == null || students.length === 0)
            renderOptions.message = 'No students found.';

        res.render('students', renderOptions);
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
};

exports.newStudentForm = (req, res) => {
    res.render('studentForm', {
        title: 'Add Student',
        student: {FirstName: '', LastName: '', Major: '', GPA: ''},
        action: '/students',
        submitLabel: 'Create'
    });
};

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

exports.editStudentForm = async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        if (!Number.isInteger(id) || id <= 0)
            return res.status(400).send('Invalid Id');
        const student = await Student.findById(id);
        if (!student)
            return res.status(404).send('Student not Found');

        res.render('studentForm', {
            title: `Edit Student #${id}`,
            student,
            action: `/students/${id}?_method=PUT`,
            submitLabel: 'Update'
        });
    } catch (err) {
        next(err);
    }
};

exports.updateStudent = async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        if (!Number.isInteger(id) || id <= 0)
            return res.status(400).send('Invalid Id');

        const studentData = scrub(req.body);
        const errors = validateStudent(studentData);

        if (Object.keys(errors).length > 0) {
            return res.status(400).render('studentForm', {
                title: `Edit Student #${id}`,
                errors,
                student: studentData,
                action: `/students/${id}?_method=PUT`,
                submitLabel: 'Update'
            })
        }

        const updatedStudent = await Student.updateById(id, {
            StudentID: studentData.StudentID,
            FirstName: studentData.FirstName,
            LastName: studentData.LastName,
            Major: studentData.Major,
            GPA: studentData.GPA
        });
        if (!updatedStudent)
            return res.status(404).send('Student not Found');

        res.redirect(`/students/${id}`);
    } catch (err) {
        next(err);
    }
};

exports.deleteStudent = async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        if (!Number.isInteger(id) || id <= 0)
            return res.status(400).send('Invalid Id');

        const deletedStudent = await Student.deleteById(id);
        if (!deletedStudent)
            return res.status(404).send('Student not Found');

        res.redirect(`/`);
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