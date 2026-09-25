require("dotenv").config();

const express = require("express");
const app = express();

app.use(express.json());

let todos = [
  { id: 1, task: "Learn Node.js", completed: false },
  { id: 2, task: "Build CRUD API", completed: false },
];

app.get("/todos", (req, res) => {
  res.status(200).json(todos);
});

app.get("/todos/completed", (req, res) => {
  const completed = todos.filter((todo) => todo.completed);
  res.status(200).json(completed);
});

app.get("/todos/active", (req, res) => {
  const active = todos.filter((todo) => !todo.completed);
  res.status(200).json(active);
});

app.get("/todos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const todo = todos.find((todo) => todo.id === id);

  if (!todo) {
    return res.status(404).json({ error: "Todo not found" });
  }

  res.status(200).json(todo);
});

app.post("/todos", (req, res) => {
  if (!req.body.task) {
    return res.status(400).json({ error: "Task field is required" });
  }

  const newTodo = {
    id: todos.length + 1,
    task: req.body.task,
    completed: req.body.completed ?? false,
  };

  todos.push(newTodo);
  res.status(201).json(newTodo);
});

app.put("/todos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const todo = todos.find((todo) => todo.id === id);

  if (!todo) {
    return res.status(404).json({ error: "Todo not found" });
  }

  if (!req.body.task) {
    return res.status(400).json({ error: "Task field is required" });
  }

  todo.task = req.body.task;
  todo.completed = req.body.completed ?? false;

  res.status(200).json(todo);
});

app.patch("/todos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const todo = todos.find((todo) => todo.id === id);

  if (!todo) {
    return res.status(404).json({ error: "Todo not found" });
  }

  Object.assign(todo, req.body);
  res.status(200).json(todo);
});

app.delete("/todos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const initialLength = todos.length;

  todos = todos.filter((todo) => todo.id !== id);

  if (todos.length === initialLength) {
    return res.status(404).json({ error: "Todo not found" });
  }

  res.status(204).send();
});

app.use((err, req, res, next) => {
  res.status(500).json({ error: "Server error!" });
});

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
  console.log(`Server on port ${PORT}`);
});
