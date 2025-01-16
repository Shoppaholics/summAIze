import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Footer from "../components/Footer";
import Header from "../components/Header";
import TaskCard from "../components/TaskCard";
import { supabase } from "../lib/supabaseClientFrontend";
import { getSession } from "../services/authService";
// import { fetchEmails } from "../services/emailService";
import { summarizeEmails } from "../services/geminiService";
import { connectEmailWithNylas } from "../services/nylasService";
import "../styles/Home.css";

const Home = () => {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [emails, setEmails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [connectedEmails, setConnectedEmails] = useState(null);

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
  // // // Fetch email threads
  // const handleFetchEmails = async () => {
  //   setLoading(true);
  //   const { emails } = await fetchEmails(user?.id);
  //   console.log(emails);
  //   setEmails(emails);
  // };

  // Fetch summarized emails
  const summarizeFetchedEmails = async () => {
    console.log("Start");
    setLoading(true);
    const { summary } = await summarizeEmails(user?.id);
    console.log(summary);
    setEmails(summary);
    setLoading(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return user ? (
    <div>
      <Header />
      <h2>Welcome, {user.email}</h2>
      <p>
        Connected emails: {connectedEmails?.map((item) => item.email + " | ")}
      </p>
      <p> The following are the tasks that you have now. </p>

      <div>
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
      </div>

      <button onClick={handleSignOut}>Sign Out</button>
      <div>
        <button onClick={connectEmail}>Connect email</button>
        <p>{message}</p>
        <button onClick={summarizeFetchedEmails} disabled={loading}>
          Fetch emails
        </button>
      </div>

      {emails?.map((item, index) => (
        <div key={index}>
          <h3>{item.emailAddress}</h3>
          <p>{item.error}</p>
          {item.emails?.data?.map((email, index) => (
            <div key={index}>
              <h5>From: {email.from[0]?.name}</h5>
              <h4>Subject: {email.subject}</h4>
              <p>Summary: {email.summary}</p>
            </div>
          ))}
        </div>
      ))}
      <Link to="/summary"> Summarise text into tasks </Link>
      <Footer />
    </div>
  ) : (
    <div>
      <p>Please sign in to view your dashboard.</p>
      <Link to="/signin">Sign in</Link>
      <Link to="/signup">Sign up</Link>
    </div>
  );
};

export default Home;
