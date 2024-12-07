// src/AdminDashboard.jsx
import React, { useState } from "react";
import { storage } from "./firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db } from "./firebase";
import { collection, addDoc } from "firebase/firestore";
import { getAuth, signOut } from "firebase/auth"; // Import signOut
import { useNavigate } from "react-router-dom"; // Import useNavigate

const AdminDashboard = () => {
  const [subject, setSubject] = useState("");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate(); // Hook for navigation

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!subject || !file) {
      alert("Please select a subject and a file");
      return;
    }

    setUploading(true);

    try {
      // Upload file to Firebase Storage
      const fileRef = ref(storage, `pdfs/${subject}/${file.name}`);
      await uploadBytes(fileRef, file);

      // Get the file's download URL
      const downloadURL = await getDownloadURL(fileRef);

      // Save metadata to Firestore
      await addDoc(collection(db, "pdfs"), {
        subject,
        fileName: file.name,
        url: downloadURL,
        timestamp: new Date(),
      });

      alert("File uploaded successfully!");
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to upload file.");
    } finally {
      setUploading(false);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      const auth = getAuth();
      await signOut(auth); // Sign out the user from Firebase
      navigate("/login"); // Redirect to the login page
    } catch (error) {
      console.error("Error logging out:", error);
      alert("Failed to log out.");
    }
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <button onClick={handleLogout}>Logout</button> {/* Logout Button */}
      <div>
        <label>
          Subject:
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          Upload PDF:
          <input type="file" accept=".pdf" onChange={handleFileChange} />
        </label>
      </div>
      <button onClick={handleUpload} disabled={uploading}>
        {uploading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
};

export default AdminDashboard;
