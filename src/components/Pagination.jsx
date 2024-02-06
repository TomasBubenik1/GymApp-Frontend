import React, { useState } from 'react';

export default function Pagination({ exercisesPerPage, totalExercises }) {
  const [currentPage, setCurrentPage] = useState(1);
  const pagesToShow = 10; 
  const totalPages = Math.ceil(totalExercises / exercisesPerPage);

  const getVisiblePageNumbers = () => {
    let startPage = 1;
    if (currentPage > 6) {
      startPage = currentPage - 5;
    }

    let endPage = startPage + pagesToShow - 1;
    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = endPage - pagesToShow + 1;
    }

    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  };

  const visiblePageNumbers = getVisiblePageNumbers();

  return (
    <nav>
      <ul>
        {visiblePageNumbers.map((number) => {
          return (
            <li key={number}>
              <a onClick={() => setCurrentPage(number)}>{number}</a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
