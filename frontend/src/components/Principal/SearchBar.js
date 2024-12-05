import React, { useState } from 'react';
import "./principal.css";

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value); // Llamamos a la función de búsqueda directamente
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Busca tus productos favoritos 🛒"
        value={searchTerm}
        onChange={handleInputChange}
        className="search-input"
      />
    </div>
  );
};

export default SearchBar;