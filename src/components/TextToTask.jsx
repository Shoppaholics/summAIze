import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { supabase } from "../lib/supabaseClientFrontend";

import Footer from "./Footer";
import Header from "./Header";
import Input from "./Input";
import TaskCard from "./TaskCard";

const TextToTask = () => {
  const [tasks, setTasks] = useState([]);

  // for fetching tasks
  useEffect(() => {
    async function fetchTasks() {
      try {
        const user = await supabase.auth.getUser();

        const { data, error } = await supabase
          .from("tasks")
          .select("*")
          .eq("user_id", user.data.user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setTasks(data || []);
      } catch (error) {
        console.error("Error fetching tasks:", error.message);
      }
    }

    fetchTasks();
  }, []);

  const deleteTask = async (taskId) => {
    try {
      const { error } = await supabase.from("tasks").delete().eq("id", taskId);

      if (error) throw error;

      // set new tasks after deletion
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    } catch (error) {
      console.error("Error deleting :", error.message);
    }
  };

  const addTask = async (newTask) => {
    try {
      const user = await supabase.auth.getUser();
      if (!user) throw new Error("User not logged in");
      const { data, error } = await supabase
        .from("tasks")
        .insert([
          {
            content: newTask.content,
            created_at: new Date(),
            user_id: user.data.user.id,
          },
        ])
        .select();

      if (error) throw error;
      setTasks((prevTasks) => [...prevTasks, data[0]]);
    } catch (error) {
      console.error("Error inserting task:", error.message);
    }
  };

  return (
    <div>
      <Header />
      <Input onAdd={addTask} />
      <div className="tasks-container">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            id={task.id}
            content={task.content}
            onDelete={deleteTask}
          />
        ))}
      </div>
      <div>
        <Link to="/" className="back-to-home">
          Back to Home
        </Link>
      </div>
      <Footer />
    </div>
  );
};

export default TextToTask;
