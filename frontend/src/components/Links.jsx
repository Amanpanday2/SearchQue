import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./Login";
import LandingPage from "./LandingPage";
import SearchPage from "./SearchPage";

const Links = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/search" element={<SearchPage />} />
      </Routes>
    </div>
  );
};

export default Links;
