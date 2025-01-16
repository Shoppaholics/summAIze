import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import TextToTask from "./components/TextToTask.jsx";
import { AuthProvider } from "./context/AuthContext.js";
import Calendar from "./pages/Calendar.jsx";
import Home from "./pages/Home.jsx";
import SignIn from "./pages/SignIn.jsx";
import SignUp from "./pages/SignUp.jsx";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
