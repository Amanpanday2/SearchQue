import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import './login.css';

const LandingPage = () => {
  const navigate = useNavigate();
  const [login, setLogin] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { value, name } = e.target;
    setLogin((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const res = await fetch("https://searchque-pro.onrender.com/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: login.email,
          password: login.password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        console.log("Login successful", data);
        localStorage.setItem("token", JSON.stringify(data.token));
        navigate("/search");
      } else {
        alert(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("Something went wrong. Please try again later.");
    }
  };

  return (
    <div>
      <h1 id="loginTitle">Login</h1>
      <div id="project-container">
        <form onSubmit={handleSubmit}>
          <div className="form_input">
            <label htmlFor="email">Enter your Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              onChange={handleChange}
              value={login.email}
            />
          </div>
          <div className="form_input">
            <label htmlFor="password">Enter your password:</label>
            <input
              type="password"
              id="password"
              name="password"
              onChange={handleChange}
              value={login.password}
            />
          </div>
          <div  class="buttons-container">
          <input type="submit" value="Login" id="submit" />
          <input type="button" value="Forget" onclick="window.location.href='/'"  />
          </div>
          <p>
            User not registered? <Link to="/">Register Now</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LandingPage;
