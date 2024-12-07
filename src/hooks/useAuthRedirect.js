// src/hooks/useAuthRedirect.js
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const useAuthRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    
    // Listen for changes in the authentication state
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/admin"); // Redirect to admin page if the user is logged in
      } else {
        navigate("/login"); // Redirect to login page if not logged in
      }
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, [navigate]); // Run only once on mount

};

export default useAuthRedirect;
