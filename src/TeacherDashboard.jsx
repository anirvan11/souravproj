// src/TeacherDashboard.jsx
import React from "react";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const TeacherDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const auth = getAuth();
      await signOut(auth); // Sign out the user from Firebase
      navigate("/login"); // Redirect to the login page after successful logout
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div>
      <h1>Teacher Dashboard</h1>
      <p>Welcome, Teacher!</p>
      {/* Teacher-specific content */}

      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default TeacherDashboard;
