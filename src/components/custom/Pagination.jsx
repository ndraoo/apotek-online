import React from "react";

const Pagination = ({ currentPage, totalPages, setCurrentPage }) => {
    const pageNumbers = [];
  
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
  
    return (
      <div className="flex justify-center mt-6">
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-3 py-1 mx-1 rounded ${
            currentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-700 text-white'
          }`}
        >
          Previous
        </button>
        
        {pageNumbers.map((number) => (
          <button
            key={number}
            onClick={() => setCurrentPage(number)}
            className={`px-3 py-1 mx-1 rounded ${
              currentPage === number ? 'bg-blue-700 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
            }`}
          >
            {number}
          </button>
        ))}
  
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 mx-1 rounded ${
            currentPage === totalPages ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-700 text-white'
          }`}
        >
          Next
        </button>
      </div>
    );
  };
  
export default Pagination