import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Footer from "../components/Footer";
import Header from "../components/Header";
import Input from "../components/Input";
import TaskCard from "../components/TaskCard";
import { supabase } from "../lib/supabaseClientFrontend";
import { getSession } from "../services/authService";
import { summarizeEmails } from "../services/geminiService";
import { connectEmailWithNylas } from "../services/nylasService";
import LinkToEmail from "../components/LinkToEmail";
import "../styles/Home.css";
import EmailCountPopup from "../components/EmailCountPopup";

const Home = () => {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [connectedEmails, setConnectedEmails] = useState(null);
  const [showEmailPopup, setShowEmailPopup] = useState(false);

  useEffect(() => {
    const fetchSession = async () => {
      const { error, session, connectedEmails } = await getSession();
      if (error) {
        alert(error);
      }
      setUser(session?.user);
      setConnectedEmails(connectedEmails);
    };

    fetchSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Fetch tasks for the logged-in user
  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user]);

  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTasks(data || []);
    } catch (error) {
      console.error("Error fetching tasks:", error.message);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      const { error } = await supabase.from("tasks").delete().eq("id", taskId);

      if (error) throw error;

      // Refresh tasks after deletion
      await fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error.message);
    }
  };

  // Connect user's email via Nylas
  const connectEmail = async () => {
    const { success, error } = await connectEmailWithNylas(user?.id);

    if (success) {
      setMessage(success);
    }

    if (error) {
      setMessage(error);
    }
  };

  // Fetch summarized emails
  const handleFetchEmails = async (emailCount) => {
    setShowEmailPopup(false);
    setLoading(true);
    setMessage("");
    try {
      const { summary, error } = await summarizeEmails(user?.id, emailCount);

      if (error) {
        setMessage(error);
        return;
      }

      if (summary && summary.length > 0) {
        const { data, error: supabaseError } = await supabase
          .from("tasks")
          .insert(
            summary.map((email) => ({
              content: `Email from: ${email.from}\nSubject: ${email.subject}\n\n${email.summary}`,
              created_at: new Date(),
              user_id: user.id,
              messageurl: email.messageUrl,
              provider: email.provider,
            }))
          )
          .select();

        if (supabaseError) throw supabaseError;
        setTasks((prevTasks) => [...prevTasks, ...data]);
        setMessage("Emails successfully converted to tasks!");
      } else {
        setMessage("No new emails to process");
      }
    } catch (error) {
      console.error("Error fetching and processing emails:", error);
      setMessage("Failed to fetch and process emails");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  // Add task function
  const addTask = async (newTask) => {
    try {
      if (!user) throw new Error("User not logged in");
      const { data, error } = await supabase
        .from("tasks")
        .insert([
          {
            content: newTask.content,
            created_at: new Date(),
            user_id: user.id,
          },
        ])
        .select();

      if (error) throw error;
      setTasks((prevTasks) => [...prevTasks, data[0]]);
    } catch (error) {
      console.error("Error inserting task:", error.message);
    }
  };

  return user ? (
    <div className="home-container">
      <Header user={user} />

      <div className="status-bar">
        <div className="email-status">
          <p>
            Connected emails:{" "}
            {connectedEmails?.map((item) => item.email + " | ")}
          </p>
        </div>
        <div className="action-buttons">
          <Link to="/calendar" className="action-button">
            Calendar
          </Link>
          <button onClick={connectEmail} className="action-button">
            Connect email
          </button>
          <button
            onClick={() => setShowEmailPopup(true)}
            disabled={loading}
            className="action-button"
          >
            Summarize emails
          </button>
          <button onClick={handleSignOut} className="action-button sign-out">
            Sign Out
          </button>
        </div>
        {message && <p className="status-message">{message}</p>}
      </div>

      <div className="main-content">
        <div className="tasks-container">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              id={task.id}
              content={task.content}
              onDelete={deleteTask}
            >
              {task.messageurl && (
                <LinkToEmail
                  messageUrl={task.messageurl}
                  provider={task.provider}
                />
              )}
            </TaskCard>
          ))}
        </div>
      </div>

      <Input onAdd={addTask} />
      <Footer />

      {showEmailPopup && (
        <EmailCountPopup
          onSubmit={handleFetchEmails}
          onClose={() => setShowEmailPopup(false)}
        />
      )}
    </div>
  ) : (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-header">Welcome to SummAIze</h2>
        <p className="auth-description">
          Transform your text and emails into actionable tasks with AI.
        </p>
        <div className="auth-buttons">
          <Link to="/signin" className="auth-button">
            Sign In
          </Link>
          <Link to="/signup" className="auth-button auth-button-secondary">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
