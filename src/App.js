import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import AdminDashboard from "./AdminDashboard";
import TeacherDashboard from "./TeacherDashboard";
import LoginPage from "./LoginPage";
import { db } from "./firebase"; // Firestore initialization
import { getDoc, doc } from "firebase/firestore";

const App = () => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null); // Track user role
  const [loading, setLoading] = useState(true); // Track loading state for initial auth check

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log("Auth state changed", user); // Debug: Log user auth state
      setUser(user); // Update user state based on authentication status

      if (user) {
        try {
          // Fetch user role from Firestore
          const userDoc = await getDoc(doc(db, "users", user.uid));
          console.log("Fetched user role from Firestore:", userDoc.data()); // Debug: Log the fetched role data
          if (userDoc.exists()) {
            setRole(userDoc.data().role); // Set the user's role
          } else {
            console.error("No role found for user"); // Debug: Log if no role is found
            setRole(null); // Reset role if no data exists
          }
        } catch (error) {
          console.error("Error fetching user role:", error); // Debug: Log errors while fetching role
          setRole(null); // Reset role in case of error
        }
      } else {
        console.log("User is logged out"); // Debug: Log when the user is logged out
        setRole(null); // Reset role if user is logged out
      }
      setLoading(false); // Set loading to false after role fetching is done
    });

    return () => unsubscribe(); // Clean up the listener on component unmount
  }, []);

  // Debugging: Check current user and role
  console.log("Current user:", user);
  console.log("Current role:", role);

  // If still loading, return a loading indicator or nothing
  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <p>Loading...</p>
        {/* You can replace this with a spinner or other loading indicators */}
      </div>
    );
  }

  // Handle redirect logic
  const renderRedirect = () => {
    if (user && role === "admin") {
      return <Navigate to="/admin" />;
    } else if (user && role === "teacher") {
      return <Navigate to="/teacher" />;
    }
    return <LoginPage />;
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={renderRedirect()}
        />
        <Route
          path="/admin"
          element={
            user && role === "admin" ? (
              <AdminDashboard />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/teacher"
          element={
            user && role === "teacher" ? (
              <TeacherDashboard />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        {/* Add other routes as necessary */}
      </Routes>
    </Router>
  );
};

export default App;
