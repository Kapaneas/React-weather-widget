import React, { useState } from 'react';

function SearchBar({ onSearch }) {
  const [city, setCity] = useState('');

  function handleInputChange(e) {
    setCity(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (city.trim() === '') return;
    onSearch(city.trim());
    setCity('');
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: 20, textAlign: 'center' }}>
      <input
        type="text"
        placeholder="Enter city"
        value={city}
        onChange={handleInputChange}
        style={{ padding: 10, fontSize: 16, width: '60%' }}
      />
      <button type="submit" style={{ padding: '10px 15px', marginLeft: 10, fontSize: 16 }}>
        Search
      </button>
    </form>
  );
}

export default SearchBar;
