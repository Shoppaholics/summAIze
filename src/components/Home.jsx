import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { supabase } from "../lib/supabaseClient";
import { getSession } from "../services/authService";

const Home = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchSession = async () => {
      const { error, session } = await getSession();
      if (session) {
        setUser(session?.user);
      } else if (error) {
        setUser(null);
      }
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

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return user ? (
    <div>
      <h2>Welcome, {user.email}</h2>
      <button onClick={handleSignOut}>Sign Out</button>
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
