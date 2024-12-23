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

(async () => {
  try {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS tasks (
            id SERIAL PRIMARY KEY,
            description TEXT NOT NULL,
            status TEXT NOT NULL
        )
      `);
    console.log("Database table initialized.");
  } catch (error) {
    console.error("Error initializing database table:", error);
  }
})();

// GET /tasks - Get all tasks
app.get("/tasks", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM tasks");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// POST /tasks - Add a new task
app.post("/tasks", async (request, response) => {
  const { description, status } = request.body;
  if (!description || !status) {
    return response
      .status(400)
      .json({ error: "Description and status fields are required" });
  }
  try {
    const result = await pool.query(
      "INSERT INTO tasks (description, status) VALUES ($1, $2) RETURNING *",
      [description, status]
    );
    response.status(201).json({ message: "Task added successfully" });
  } catch (error) {
    console.error("Error occurred while adding task:", error);
    response.status(500).json({ error: "Internal Server Error" });
  }
});

// PUT /tasks/:id - Update a task's status
app.put("/tasks/:id", async (request, response) => {
  const taskId = parseInt(request.params.id, 10);
  const { status } = request.body;

  if (!status) {
    return response.status(400).json({ error: "Status is required" });
  }

  try {
    const result = await pool.query(
      "UPDATE tasks SET status = $1 WHERE id = $2 RETURNING *",
      [status, taskId]
    );

    if (result.rows.length === 0) {
      return response.status(404).json({ error: "Task not found" });
    }

    response.json({ message: "Task updated successfully" });
  } catch (error) {
    console.error("Error occurred while updating task:", error);
    response.status(500).json({ error: "Internal Server Error" });
  }
});

// DELETE /tasks/:id - Delete a task
app.delete("/tasks/:id", async (request, response) => {
  const taskId = parseInt(request.params.id, 10);

  try {
    const result = await pool.query(
      "DELETE FROM tasks WHERE id = $1 RETURNING *",
      [taskId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Task not found" });
    }

    response.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error occurred while deleting task:", error);
    response.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
