require("dotenv").config()

const express = require("express")
const cors = require("cors")
const { createClient } = require("@supabase/supabase-js")

const app = express()

app.use(cors())
app.use(express.json())

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
)

app.get("/api/tasks", async (req, res) => {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")

  if (error) {
    return res.status(500).json({ error: error.message })
  }

  res.json(data)
})

app.listen(5000, () => {
  console.log("Backend running on http://localhost:5000")
})

app.post("/api/tasks", async (req, res) => {
  const { title } = req.body

  if (!title) {
    return res.status(400).json({
      error: "Task title is required"
    })
  }

  const { data, error } = await supabase
    .from("tasks")
    .insert([
      {
        title: title,
        completed: false
      }
    ])
    .select()

  if (error) {
    return res.status(500).json({
      error: error.message
    })
  }

  res.status(201).json(data[0])
})

app.patch("/api/tasks/:id", async (req, res) => {
  const { id } = req.params
  const { completed } = req.body

  const { data, error } = await supabase
    .from("tasks")
    .update({ completed })
    .eq("id", id)
    .select()

  if (error) {
    return res.status(500).json({
      error: error.message
    })
  }

  res.json(data[0])
})

app.delete("/api/tasks/:id", async (req, res) => {
  const { id } = req.params

  const { error } = await supabase
    .from("tasks")
    .delete()
    .eq("id", id)

  if (error) {
    return res.status(500).json({
      error: error.message
    })
  }

  res.json({
    message: "Task deleted"
  })
})