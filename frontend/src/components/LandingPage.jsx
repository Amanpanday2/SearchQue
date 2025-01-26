import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import './LoadPage.css';

const LandingPage = () => {
  const navigate = useNavigate();
  const [register, setRegister] = useState({
    userName: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { value, name } = e.target;
    setRegister((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!register.userName || !register.email || !register.password) {
      alert("All fields are required!");
      return;
    }

    try {
      const res = await fetch("https://searchque-pro.onrender.com/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(register),
      });

      const data = await res.json();

      if (res.ok) {
        console.log("Registration successful:", data);
        navigate("/login");
      } else {
        alert(data.message || "Registration failed");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      alert("An error occurred. Please try again later.");
    }
  };

  return (
    <div>
      <h1 id="loginTitle">SearchQuest</h1>
      <div id="project-container">
        <form onSubmit={handleSubmit}>
          <div className="form_input">
            <label htmlFor="userName">Enter your Name:</label>
            <input
              type="text"
              id="userName"
              name="userName"
              value={register.userName}
              onChange={handleChange}
            />
          </div>

          <div className="form_input">
            <label htmlFor="email">Enter your Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              onChange={handleChange}
              value={register.email}
            />
          </div>

          <div className="form_input">
            <label htmlFor="password">Enter your password:</label>
            <input
              type="password"
              id="password"
              name="password"
              onChange={handleChange}
              value={register.password}
            />
          </div>

          <input type="submit" value="Register" id="submit" />
          <p>
            Already Registered? <Link to="/login">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LandingPage;
