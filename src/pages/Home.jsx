import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { supabase } from "../lib/supabaseClientFrontend";
import { getSession } from "../services/authService";
import { fetchEmails } from "../services/emailService";
import { connectEmailWithNylas } from "../services/nylasService";

const Home = () => {
  const [user, setUser] = useState(null);
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

  // Fetch email threads
  const handleFetchEmails = async () => {
    setLoading(true);
    const { emails } = await fetchEmails(user?.id);
    console.log(emails);
    setEmails(emails);
    setLoading(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return user ? (
    <div>
      <h2>Welcome, {user.email}</h2>
      <p>
        Connected emails: {connectedEmails?.map((item) => item.email + " | ")}
      </p>
      <button onClick={handleSignOut}>Sign Out</button>
      <div>
        <button onClick={connectEmail}>Connect email</button>
        <p>{message}</p>
        <button onClick={handleFetchEmails} disabled={loading}>
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
              <p>Snippet: {email.snippet}</p>
            </div>
          ))}
        </div>
      ))}
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
