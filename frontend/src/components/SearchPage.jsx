
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import "./SearchComponent.css";

const SearchComponent = () => {
  const navigate = useNavigate();
  const token = JSON.parse(localStorage.getItem("token"));
  const [searchQuery, setSearchQuery] = useState("");
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 3;
  const fetchQuestions = async (query) => {
    setIsLoading(true);
    setError("");
    if (!token) {
      setError("Authentication token is missing. Please log in.");
      setIsLoading(false);
      return;
    }
    try {
      const response = await fetch(
        `https://searchque-pro.onrender.com/search/get-allQuestions?title=${query}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();

      if (response.ok) {
        setQuestions(data.questions);
      } else {
        setError(data.message || "No questions found or an error occurred.");
        setQuestions([]);
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to fetch questions. Please try again.");
      setQuestions([]);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim()) {
        fetchQuestions(searchQuery);
      } else {
        setQuestions([]);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); 
  };

  const startIndex = (currentPage - 1) * resultsPerPage;
  const endIndex = startIndex + resultsPerPage;
  const currentResults = questions.slice(startIndex, endIndex);
  const totalPages = Math.ceil(questions.length / resultsPerPage);

  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="search-container">
      <div className="content">
        <div className="header">
          <h2>SearchQuest</h2>
          <button className="logout-button" onClick={handleLogout}>
            Log Out
          </button>
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          placeholder="Search by title"
          className="search-input"
        />
        {isLoading && <p className="loading-text">Loading...</p>}
        {error && <p className="error-text" style={{ color: "red" }}>{error}</p>}
        {currentResults.length > 0 ? (
          <div className="results-container">
            {currentResults.map((question) => (
              <div key={question._id} className="result-item">
                <h4>{question.title}</h4>
                <h5>{question.type}</h5>
              </div>
            ))}
          </div>
        ) : (
          !isLoading &&
          searchQuery.trim() && (
            <p className="no-results">
              No questions found for "{searchQuery}".
            </p>
          )
        )}
      </div>
      {totalPages > 1 && (
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              className={`page-button ${
                currentPage === index + 1 ? "active" : ""
              }`}
              onClick={() => handlePageClick(index + 1)}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchComponent;
