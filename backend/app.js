// Create an Express API for task management with GET and POST endpoints
const express = require('express');
const app = express();
app.use(express.json());

let tasks = [];

// GET endpoint to retrieve all tasks
app.get('/tasks', (req, res) => {
    res.json(tasks);
});

// POST endpoint to create a new task
app.post('/tasks', (req, res) => {
    const { title, description } = req.body;
    if (!title || !description) {
        return res.status(400).json({ error: 'Title and description are required' });
    }
    const newTask = { id: tasks.length + 1, title, description };
    tasks.push(newTask);
    res.status(201).json(newTask);
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});