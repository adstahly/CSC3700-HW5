const pool = require('../db/pool');


const clampGpa = (g) => {
    if (g == null || g === '') return null;
    const n = Number.parseFloat(g);
    if (!Number.isFinite(n)) return null;
    return Math.max(0, Math.min(5, Number(n.toFixed(2))));
};


// READ all (simple version for demo)
async function findAll({ q } = {}) {
    const params = [];
    let where = '';
    if (q) {
        where = 'WHERE FirstName LIKE ? OR LastName LIKE ? OR Major LIKE ?';
        params.push(`%${q}%`, `%${q}%`, `%${q}%`);
    }
    const [rows] = await pool.query(
        `SELECT StudentID, FirstName, LastName, Major, GPA FROM STUDENTS ${where} ORDER BY StudentID ASC`,
        params
    );
    return rows;
}


// READ one
async function findById(id) {
    const [rows] = await pool.query(
        `SELECT StudentID, FirstName, LastName, Major, GPA FROM STUDENTS WHERE StudentID = ?`,
        [id]
    );
    return rows[0];
}


// CREATE
async function create({ FirstName, LastName, Major, GPA }) {
    const g = clampGpa(GPA);
    const [result] = await pool.query(
        `INSERT INTO STUDENTS (FirstName, LastName, Major, GPA) VALUES (?, ?, ?, ?)`,
        [FirstName, LastName, Major || null, g]
    );
    return result.insertId;
}


// UPDATE
async function updateById(id, { FirstName, LastName, Major, GPA }) {
    const g = clampGpa(GPA);
    const [result] = await pool.query(
        `UPDATE STUDENTS SET FirstName = ?, LastName = ?, Major = ?, GPA = ? WHERE StudentID = ?`,
        [FirstName, LastName, Major || null, g, id]
    );
    return result.affectedRows; // 1 if updated
}


// DELETE
async function deleteById(id) {
    const [result] = await pool.query(
        `DELETE FROM STUDENTS WHERE StudentID = ?`,
        [id]
    );
    return result.affectedRows; // 1 if deleted
}


module.exports = { findAll, findById, create, updateById, deleteById };