// import { useEffect, useState } from "react"

// function App() {
//   const [tasks, setTasks] = useState([])
//   const [title, setTitle] = useState("")

//   async function loadTasks() {
//     const response = await fetch("http://localhost:5000/api/tasks")
//     const data = await response.json()

//     setTasks(data)
//   }

//   useEffect(() => {
//     loadTasks()
//   }, [])

//   async function addTask() {
//     if (!title.trim()) return

//     const response = await fetch("http://localhost:5000/api/tasks", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json"
//       },
//       body: JSON.stringify({
//         title: title
//       })
//     })

//     const newTask = await response.json()

//     setTasks([...tasks, newTask])
//     setTitle("")
//   }

//   async function toggleTask(task) {
//     const response = await fetch(
//       `http://localhost:5000/api/tasks/${task.id}`,
//       {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify({
//           completed: !task.completed
//         })
//       }
//     )

//     const updatedTask = await response.json()

//     setTasks(
//       tasks.map((item) =>
//         item.id === updatedTask.id ? updatedTask : item
//       )
//     )
//   }

//   async function deleteTask(id) {
//     await fetch(`http://localhost:5000/api/tasks/${id}`, {
//       method: "DELETE"
//     })

//     setTasks(tasks.filter((task) => task.id !== id))
//   }

//   return (
//     <div>
//       <h1>HackMate</h1>

//       <input
//         value={title}
//         onChange={(event) => setTitle(event.target.value)}
//         placeholder="Enter a task"
//       />

//       <button onClick={addTask}>
//         Add Task
//       </button>

//       <h2>My Tasks</h2>

//       {tasks.map((task) => (
//         <div key={task.id}>
//           <span>
//             {task.title} —{" "}
//             {task.completed ? "Done" : "Pending"}
//           </span>

//           <button onClick={() => toggleTask(task)}>
//             {task.completed ? "Undo" : "Complete"}
//           </button>

//           <button onClick={() => deleteTask(task.id)}>
//             Delete
//           </button>
//         </div>
//       ))}
//     </div>
//   )
// }

// export default App


// import { useEffect, useState } from "react"
// import { supabase } from "./supabase"

// function App() {
//   const [email, setEmail] = useState("")
//   const [password, setPassword] = useState("")
//   const [user, setUser] = useState(null)
//   const [message, setMessage] = useState("")

//   useEffect(() => {
//     checkUser()

//     const {
//       data: { subscription },
//     } = supabase.auth.onAuthStateChange((_event, session) => {
//       setUser(session?.user ?? null)
//     })

//     return () => {
//       subscription.unsubscribe()
//     }
//   }, [])

//   async function checkUser() {
//     const {
//       data: { user },
//     } = await supabase.auth.getUser()

//     setUser(user)
//   }

//   async function signUp() {
//     const { error } = await supabase.auth.signUp({
//       email,
//       password,
//     })

//     if (error) {
//       setMessage(error.message)
//       return
//     }

//     setMessage("Signup successful!")
//   }

//   async function login() {
//     const { error } = await supabase.auth.signInWithPassword({
//       email,
//       password,
//     })

//     if (error) {
//       setMessage(error.message)
//       return
//     }

//     setMessage("Login successful!")
//   }

//   async function logout() {
//     await supabase.auth.signOut()
//     setUser(null)
//   }

//   if (user) {
//     return (
//       <div>
//         <h1>HackMate Dashboard 🚀</h1>

//         <p>Welcome, {user.email}</p>

//         <p>You are logged in.</p>

//         <button onClick={logout}>
//           Logout
//         </button>
//       </div>
//     )
//   }

//   return (
//     <div>
//       <h1>HackMate</h1>

//       <input
//         type="email"
//         placeholder="Email"
//         value={email}
//         onChange={(event) => setEmail(event.target.value)}
//       />

//       <br /><br />

//       <input
//         type="password"
//         placeholder="Password"
//         value={password}
//         onChange={(event) => setPassword(event.target.value)}
//       />

//       <br /><br />

//       <button onClick={signUp}>
//         Sign Up
//       </button>

//       <button onClick={login}>
//         Login
//       </button>

//       <p>{message}</p>
//     </div>
//   )
// }

// export default App

import { useEffect, useState } from "react"
import { supabase } from "./supabase"

function App() {
  const [user, setUser] = useState(null)
  const [tasks, setTasks] = useState([])
  const [title, setTitle] = useState("")
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState("")

  useEffect(() => {
    async function getCurrentUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      setUser(user)
      setLoading(false)

      if (user) {
        loadTasks(user.id)
      }
    }

    getCurrentUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null

      setUser(currentUser)

      if (currentUser) {
        loadTasks(currentUser.id)
      } else {
        setTasks([])
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  async function loadTasks(userId) {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", userId)
      .order("id", { ascending: true })

    if (error) {
      setMessage(error.message)
      return
    }

    setTasks(data)
  }

  async function signUp() {
    const email = document.getElementById("email").value
    const password = document.getElementById("password").value

    const { error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      setMessage(error.message)
      return
    }

    setMessage("Signup successful! Check your email if confirmation is enabled.")
  }

  async function login() {
    const email = document.getElementById("email").value
    const password = document.getElementById("password").value

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setMessage(error.message)
      return
    }

    setMessage("")
  }

  async function logout() {
    await supabase.auth.signOut()
  }

  async function addTask() {
    if (!title.trim() || !user) return

    const { data, error } = await supabase
      .from("tasks")
      .insert({
        title: title.trim(),
        completed: false,
        user_id: user.id,
      })
      .select()
      .single()

    if (error) {
      setMessage(error.message)
      return
    }

    setTasks([...tasks, data])
    setTitle("")
  }

  async function toggleTask(task) {
    const { data, error } = await supabase
      .from("tasks")
      .update({
        completed: !task.completed,
      })
      .eq("id", task.id)
      .select()
      .single()

    if (error) {
      setMessage(error.message)
      return
    }

    setTasks(
      tasks.map((item) =>
        item.id === data.id ? data : item
      )
    )
  }

  async function deleteTask(id) {
    const { error } = await supabase
      .from("tasks")
      .delete()
      .eq("id", id)

    if (error) {
      setMessage(error.message)
      return
    }

    setTasks(
      tasks.filter((task) => task.id !== id)
    )
  }

  if (loading) {
    return <h1>Loading...</h1>
  }

  if (!user) {
    return (
      <div>
        <h1>HackMate 🚀</h1>

        <h2>Login / Signup</h2>

        <input
          id="email"
          type="email"
          placeholder="Email"
        />

        <br />
        <br />

        <input
          id="password"
          type="password"
          placeholder="Password"
        />

        <br />
        <br />

        <button onClick={signUp}>
          Sign Up
        </button>

        <button onClick={login}>
          Login
        </button>

        <p>{message}</p>
      </div>
    )
  }

  return (
    <div>
      <h1>HackMate Dashboard 🚀</h1>

      <p>
        Logged in as: <strong>{user.email}</strong>
      </p>

      <button onClick={logout}>
        Logout
      </button>

      <hr />

      <h2>Add Task</h2>

      <input
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="Enter task"
      />

      <button onClick={addTask}>
        Add Task
      </button>

      <h2>My Tasks</h2>

      {tasks.length === 0 && (
        <p>No tasks yet.</p>
      )}

      {tasks.map((task) => (
        <div key={task.id}>
          <span>
            {task.title} —{" "}
            {task.completed ? "✅ Done" : "⏳ Pending"}
          </span>

          <button onClick={() => toggleTask(task)}>
            {task.completed ? "Undo" : "Complete"}
          </button>

          <button onClick={() => deleteTask(task.id)}>
            Delete
          </button>
        </div>
      ))}

      <p>{message}</p>
    </div>
  )
}

export default App