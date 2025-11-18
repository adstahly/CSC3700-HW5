Student Roster CRUD App

This is a server-rendered web application for managing a student roster, built with Node.js, Express, Handlebars, and MySQL.

The application supports full CRUD (Create, Read, Update, Delete) functionality, including server-side validation, search, and a responsive Bootstrap 5 UI.

How to Run This Application

Download Code: Download or clone the project repository to your local machine.

Environment Setup:

In the root of the project, create a file named .env.

Copy the contents of .env.template (if provided) or add the following keys with your MySQL database credentials:

DB_HOST=your_db_host
DB_USER=your_db_username
DB_PASS=your_db_password
DB_NAME=your_db_name
DB_CONNECTION_LIMIT=10


Install Dependencies: Open a terminal in the project's root folder and run:

npm install


Run the Server:

npm start


Visit the App: Open your browser and go to http://localhost:3333.

Features & Screenshots

This application fulfills all CRUD requirements as specified.

1. List & Search

The main page (/students) lists all students in the database. The search bar in the shared navbar layout filters this list by First Name, Last Name, or Major.

(Screenshot: Main list page showing all students)

A brief note on search: A search for "Computer" (or "CS") correctly filters the list to show only students with "Computer Science" in their major, and the search term persists in the input box.

(Screenshot: Search results for "Computer")

2. Create (New)

The "Add Student" page (/students/new) provides a clean, two-column form for adding a new student.

(Screenshot: The blank "Add Student" form)

3. Server-Side Validation

The application performs server-side validation and does not use any HTML5 validation attributes (required, type="number", etc.). If a user submits an invalid form (e.g., a blank First Name or a GPA > 5.0), the form is re-rendered with the user's previous input preserved. Bootstrap-styled error messages (is-invalid and invalid-feedback) are displayed.

(Screenshot: The 'Add Student' form showing validation errors)

4. Show

After successfully creating a new student, the user is redirected to that student's "Show" page (/students/:id). This page displays all details for a single student.

(Screenshot: The 'Show' page for a single student)

5. Edit/Update

The "Edit" button on the Show page or List page takes the user to the "Edit" form (/students/:id/edit), which is pre-filled with that student's existing data.

(Screenshot: The 'Edit Student' form pre-filled with data)

After saving, the user is redirected back to the "Show" page to see their changes.

6. Delete

The "Delete" button (on both the List and Show pages) brings up a JavaScript confirm() dialog to prevent accidental deletion. If confirmed, the student is deleted, and the user is redirected back to the main list page.

(Screenshot: The 'Delete' confirmation pop-up)
