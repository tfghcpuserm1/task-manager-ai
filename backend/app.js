// Create an Express API for task management with GET and POST endpoints
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
app.use(express.json());

const db = new sqlite3.Database('tasks.db');

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT NOT NULL
        )
    `);
});

// GET endpoint to retrieve all tasks
app.get('/tasks', (req, res) => {
    db.all('SELECT id, title, description FROM tasks ORDER BY id ASC', [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to retrieve tasks' });
        }
        res.json(rows);
    });
});

// POST endpoint to create a new task
app.post('/tasks', (req, res) => {
    const { title, description } = req.body;
    if (!title || !description) {
        return res.status(400).json({ error: 'Title and description are required' });
    }

    db.run(
        'INSERT INTO tasks (title, description) VALUES (?, ?)',
        [title, description],
        function (err) {
            if (err) {
                return res.status(500).json({ error: 'Failed to create task' });
            }

            const newTask = { id: this.lastID, title, description };
            res.status(201).json(newTask);
        }
    );
});

module.exports = app;

// Start the server only when this file is executed directly
if (require.main === module) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}