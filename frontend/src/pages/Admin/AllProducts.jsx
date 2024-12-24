// AllProducts.js
import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import { useAllProductsQuery } from "../../redux/api/productApiSlice";
import AdminMenu from "./AdminMenu";
import { toast } from "react-toastify";
import { AiOutlinePlus } from "react-icons/ai"; // Import the Plus Icon

// AllProducts.js
const AllProducts = () => {
  const [currentPage, setCurrentPage] = useState(1); // Current page
  const itemsPerPage = 5; // Items per page

  const [searchTerm, setSearchTerm] = useState(''); // Search keyword
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  // Debounce search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1); // Reset to first page on search
    }, 500); // 500ms debounce

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  const { data, isLoading, isError, error } = useAllProductsQuery({
    page: currentPage,
    limit: itemsPerPage,
    keyword: debouncedSearchTerm,
  });

  // Handle errors
  const renderError = () => {
    return <div className="text-red-500">Error: {error?.data?.error || "An unexpected error occurred."}</div>;
  };

  const { products, totalPages, totalProducts } = data || {};

  // Handle page change
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Function to generate page numbers with "..."
  const getPageNumbers = () => {
    const pages = [];
    const maxPageButtons = 4; // Maximum number of page buttons (including "...")
    const lastPage = totalPages;

    if (lastPage <= maxPageButtons) {
      // If total pages are less than or equal to maxPageButtons, show all
      for (let i = 1; i <= lastPage; i++) {
        pages.push(i);
      }
    } else {
      const middleButtons = maxPageButtons - 2; // Middle page buttons
      let start = Math.max(currentPage - Math.floor(middleButtons / 2), 2);
      let end = start + middleButtons - 1;

      // Adjust if end exceeds last page
      if (end >= lastPage) {
        end = lastPage - 1;
        start = end - middleButtons + 1;
      }

      // Add first page
      pages.push(1);

      // Add "..." if needed
      if (start > 2) {
        pages.push("...");
      }

      // Add middle pages
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      // Add "..." if needed
      if (end < lastPage - 1) {
        pages.push("...");
      }

      // Add last page
      pages.push(lastPage);
    }

    return pages;
  };

  // Memoize page numbers for performance
  const pageNumbers = useMemo(() => getPageNumbers(), [currentPage, totalPages]);

  return (
    <div className="container mx-auto px-4 ml-40">
      <div className="flex flex-col md:flex-row">
        <div className="p-3 w-full md:w-3/4">
          {/* Header Section with Heading, Search, and Add Button */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-4 space-y-4 md:space-y-0">
            <h2 className="text-2xl font-bold text-white">
              All Products ({totalProducts})
            </h2>
            <input
              type="text"
              placeholder="Search by product name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border rounded w-full md:w-1/3 bg-[#1A1A1A] text-white"
            />
            <Link
              to="/admin/addproduct" // Ensure this route exists
              className="flex items-center bg-[#DC2626] hover:bg-text-white px-4 py-2 rounded-lg transition duration-300"
            >
              <AiOutlinePlus className="mr-2" size={20} />
              Add a Product
            </Link>
          </div>

          {/* Products List */}
          <div className="flex flex-col space-y-4">
            {isLoading ? (
              <div>Loading...</div>
            ) : isError ? (
              renderError()
            ) : products && products.length > 0 ? (
              products.map((product) => (
                <Link
                  key={product._id}
                  to={`/admin/product/update/${product._id}`}
                  style={{ background: "#1A1A1A" }}
                  className="block overflow-hidden w-full rounded-lg shadow hover:shadow-lg transition duration-300"
                >
                  <div className="flex">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-40 h-40 object-cover"
                    />
                    <div className="p-4 flex flex-col justify-between w-full">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <h5 className="text-xl font-semibold text-white group-hover:text-black">
                            {product.name}
                          </h5>
                          <p className="text-gray-400 text-xs">
                            {moment(product.createdAt).format("MMMM Do YYYY")}
                          </p>
                        </div>
                        <p className="text-gray-500 text-sm mb-4">
                          {product.description.substring(0, 160)}...
                        </p>
                      </div>
                      <div className="flex justify-between items-center">
                        <Link
                          to={`/admin/product/update/${product._id}`}
                          className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-red-700 rounded-lg hover:bg-red-800"
                        >
                          Update Product
                        </Link>
                        <p className="text-lg font-semibold text-white group-hover:text-black">$ {product.price}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="w-full text-center text-gray-500">No products found.</div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6">
              {/* First Page Button */}
              <button
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 mx-1 border rounded ${
                  currentPage === 1
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-gray-200 text-gray-700 border-gray-300 hover:bg-red-100 hover:border-red-400"
                }`}
              >
                «
              </button>

              {/* Previous Page Button */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 mx-1 border rounded ${
                  currentPage === 1
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-gray-200 text-gray-700 border-gray-300 hover:bg-red-100 hover:border-red-400"
                }`}
              >
                ‹
              </button>

              {/* Page Numbers */}
              {pageNumbers.map((pageNumber, index) => (
                <button
                  key={index}
                  onClick={() => typeof pageNumber === 'number' && handlePageChange(pageNumber)}
                  disabled={pageNumber === '...'}
                  className={`px-4 py-2 mx-1 border rounded ${
                    pageNumber === currentPage
                      ? "bg-red-600 text-white border-red-600 cursor-default"
                      : typeof pageNumber === 'number'
                        ? "bg-gray-200 text-gray-700 border-gray-300 hover:bg-red-100 hover:border-red-400"
                        : "bg-transparent text-gray-500 cursor-default"
                  }`}
                >
                  {pageNumber}
                </button>
              ))}

              {/* Next Page Button */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 mx-1 border rounded ${
                  currentPage === totalPages
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-gray-200 text-gray-700 border-gray-300 hover:bg-red-100 hover:border-red-400"
                }`}
              >
                ›
              </button>

              {/* Last Page Button */}
              <button
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 mx-1 border rounded ${
                  currentPage === totalPages
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-gray-200 text-gray-700 border-gray-300 hover:bg-red-100 hover:border-red-400"
                }`}
              >
                »
              </button>
            </div>
          )}
        </div>
        <div className="md:w-1/4 p-3 mt-6 md:mt-0">
          {/* <AdminMenu /> */}
        </div>
      </div>
    </div>
  );
};

export default AllProducts;

