// GitHubSearch.js

import React, { useState } from 'react';
import axios from 'axios';
import './styles.css'; // Import CSS file for styling

const GitHubSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState('');

  // Debounce function to delay the execution of a function
  const debounce = (func, delay) => {
    let timeoutId;
    return function(...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  };

  // Debounced search function to make API requests after a delay
  const debouncedSearch = debounce(async (searchTerm) => {
    if (searchTerm.trim() === '') {
      // Clear search results if search term is empty
      setSearchResults([]);
      return;
    }

    try {
      const response = await axios.get(`https://api.github.com/search/users?q=${searchTerm}`);
      setSearchResults(response.data.items);
    } catch (error) {
      setError('Error fetching data from GitHub API');
    }
  }, 500); // Adjust debounce delay as needed

  // Event handler for input change
  const handleSearch = (event) => {
    const searchTerm = event.target.value;
    setSearchTerm(searchTerm);
    debouncedSearch(searchTerm); // Call the debounced search function
  };

  return (
    <div className="container">
      <div className="search-container">
        <input
          type="text"
          placeholder="&#x1F50D; Search for users..."
          value={searchTerm}
          onChange={handleSearch}
          className="search-input"
        />
      </div>
      {/* Display table title only when user starts typing */}
      {searchTerm && (
        <h2 className="table-title">Search Results</h2>
      )}
      {error && <p className="error-message">{error}</p>}
      <table className="user-table">
        <thead>
          {searchTerm && ( // Display table header only when user starts typing
            <tr>
              <th>Name</th>
              <th>Avatar</th>
            </tr>
          )}
        </thead>
        <tbody>
          {searchResults.map((user) => (
            <tr key={user.id}>
              <td>{user.login}</td>
              <td><img src={user.avatar_url} alt={`${user.login} avatar`} className="avatar" /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GitHubSearch;
