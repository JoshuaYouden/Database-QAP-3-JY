const express = require("express");
const { Pool } = require("pg");
const app = express();
const PORT = 3000;

app.use(express.json());

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "Boogedy43!",
  port: 5432,
});

async function createTable() {
  const query = await pool.query(`
        CREATE TABLE IF NOT EXISTS tasks (
            id SERIAL PRIMARY KEY,
            description TEXT NOT NULL,
            status TEXT NOT NULL
        )
    `);
}

async function addTask(task) {
  const query = "INSERT INTO tasks (description, status) VALUES ($1, $2)";
  const values = [task.description, task.status];
  const result = await pool.query(query, [task]);
  console.log(`Added task: ${response.rows[0].task}`);
}

async function getTasks() {
  const query = "SELECT * FROM tasks";
  const result = await pool.query(query);
  if (!result.rows.length) {
    console.log("No tasks found");
    return;
  }
  response.rows.forEach((task) => {
    console.log(
      `ID: ${task.id}, Description: ${task.description}, Status: ${task.status}`
    );
  });
}

async function updateTask(id) {
  const query = "UPDATE tasks SET status = 'completed' WHERE id = $1";
  const result = await pool.query(query, [id]);
  if (result.rowCount > 0) {
    console.log(`Updated task ${id} to completed`);
  } else {
    console.log(`Task ${id} not found`);
  }
}

async function deleteTask(id) {
  const query = "DELETE FROM tasks WHERE id = $1";
  const result = await pool.query(query, [id]);
  if (result.rowCount > 0) {
    console.log(`Deleted task ${id}`);
  } else {
    console.log(`Task ${id} not found`);
  }
}

// GET /tasks - Get all tasks
app.get("/tasks", (req, res) => {
  res.json(tasks);
});

// POST /tasks - Add a new task
app.post("/tasks", (request, response) => {
  const { id, description, status } = request.body;
  if (!id || !description || !status) {
    return response
      .status(400)
      .json({ error: "All fields (id, description, status) are required" });
  }

  tasks.push({ id, description, status });
  response.status(201).json({ message: "Task added successfully" });
});

// PUT /tasks/:id - Update a task's status
app.put("/tasks/:id", (request, response) => {
  const taskId = parseInt(request.params.id, 10);
  const { status } = request.body;
  const task = tasks.find((t) => t.id === taskId);

  if (!task) {
    return response.status(404).json({ error: "Task not found" });
  }
  task.status = status;
  response.json({ message: "Task updated successfully" });
});

// DELETE /tasks/:id - Delete a task
app.delete("/tasks/:id", (request, response) => {
  const taskId = parseInt(request.params.id, 10);
  const initialLength = tasks.length;
  tasks = tasks.filter((t) => t.id !== taskId);

  if (tasks.length === initialLength) {
    return response.status(404).json({ error: "Task not found" });
  }
  response.json({ message: "Task deleted successfully" });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
