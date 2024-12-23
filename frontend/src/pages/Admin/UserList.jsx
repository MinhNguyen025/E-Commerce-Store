import React, { useState, useMemo } from "react";
import { FaTrash, FaEdit, FaCheck, FaTimes } from "react-icons/fa";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { Link } from "react-router-dom";
import {
  useDeleteUserMutation,
  useGetUsersQuery,
  useUpdateUserMutation,
} from "../../redux/api/usersApiSlice";
import { toast } from "react-toastify";
import Modal from "../../components/Modal";

const UserList = () => {
  const [page, setPage] = useState(1); // Trạng thái trang hiện tại
  const [searchTerm, setSearchTerm] = useState(""); // Trạng thái input tìm kiếm
  const limit = 5; // Số bản ghi mỗi trang

  // Lấy dữ liệu người dùng từ API với tìm kiếm và phân trang
  const { data, isLoading, error } = useGetUsersQuery({ page, limit, search: searchTerm });

  const [deleteUser] = useDeleteUserMutation();
  const [updateUser] = useUpdateUserMutation();

  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState(""); // "edit" hoặc "delete"
  const [selectedUser, setSelectedUser] = useState(null);
  const [editableUserName, setEditableUserName] = useState("");
  const [editableUserEmail, setEditableUserEmail] = useState("");

  // Lọc người dùng dựa trên searchTerm
  const filteredUsers = useMemo(() => {
    if (!searchTerm) return data?.users || [];
    return (data?.users || []).filter(
      (user) =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, data]);

  // Hàm xử lý xóa người dùng
  const deleteHandler = async () => {
    if (!selectedUser) return;

    try {
      await deleteUser(selectedUser._id).unwrap();
      toast.success("User deleted successfully");
      setModalVisible(false);
      setSelectedUser(null);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  // Hàm xử lý cập nhật người dùng
  const updateHandler = async () => {
    if (!selectedUser) return;

    try {
      await updateUser({
        userId: selectedUser._id,
        username: editableUserName,
        email: editableUserEmail,
      }).unwrap();
      toast.success("User updated successfully");
      setModalVisible(false);
      setSelectedUser(null);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  // Hàm hỗ trợ tạo dãy số trang với dấu "..."
  const getPageNumbers = () => {
    const pages = [];
    const maxPageButtons = 5; // Số nút trang tối đa hiển thị (bao gồm dấu "...")
    const lastPage = data?.pages || 1;

    if (lastPage <= maxPageButtons) {
      // Nếu tổng số trang nhỏ hơn hoặc bằng số nút tối đa, hiển thị tất cả
      for (let i = 1; i <= lastPage; i++) {
        pages.push(i);
      }
    } else {
      // Nếu tổng số trang lớn hơn số nút tối đa
      if (page <= 3) {
        // Khi ở trang 1, 2, 3
        pages.push(1, 2, 3, "...", lastPage);
      } else if (page >= lastPage - 2) {
        // Khi ở các trang cuối
        pages.push(1, "...", lastPage - 2, lastPage - 1, lastPage);
      } else {
        // Khi ở giữa
        pages.push(1, "...", page - 1, page, page + 1, "...", lastPage);
      }
    }

    return pages;
  };

  // Hàm xử lý tìm kiếm
  const handleSearch = (e) => {
    e.preventDefault();

    // Kiểm tra nếu không có từ khóa tìm kiếm
    if (!searchTerm.trim()) {
      toast.error("Please enter a search term.");
      return;
    }

    setPage(1); // Reset về trang đầu khi tìm kiếm
  };

  // Hàm xử lý reset tìm kiếm
  const handleReset = () => {
    setSearchTerm("");
    setPage(1);
    toast.info("Search criteria reset.");
  };

  // Hàm xử lý chuyển trang
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= (data?.pages || 1)) {
      setPage(newPage);
    }
  };

  const totalPages = searchTerm ? 1 : data?.pages || 1; // Điều chỉnh tổng số trang khi tìm kiếm

  // Hàm mở modal chỉnh sửa
  const openEditModal = (user) => {
    setSelectedUser(user);
    setEditableUserName(user.username);
    setEditableUserEmail(user.email);
    setModalType("edit");
    setModalVisible(true);
  };

  // Hàm mở modal xóa
  const openDeleteModal = (user) => {
    setSelectedUser(user);
    setModalType("delete");
    setModalVisible(true);
  };

  return (
    <div className="p-4 ml-48 bg-[#1a1a1a] min-h-screen text-white">
      <h1 className="text-3xl font-semibold mb-6">Users</h1>
      {/* Thanh Tìm Kiếm */}
      <form onSubmit={handleSearch} className="mb-6 flex flex-wrap items-center gap-6">
        <div className="flex flex-col">
          <label htmlFor="searchTerm" className="mb-2 text-lg">Search</label>
          <input
            id="searchTerm"
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-80 p-3 border border-gray-600 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
          />
        </div>
        {/* <div className="flex items-end gap-3">
          <button
            type="submit"
            className="bg-blue-500 text-white px-5 py-3 rounded-lg hover:bg-blue-600 transition text-lg"
          >
            Search
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="bg-gray-600 text-white px-5 py-3 rounded-lg hover:bg-gray-700 transition text-lg"
          >
            Reset
          </button>
        </div> */}
      </form>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <>
          <div className="flex flex-col md:flex-row">
            {/* Bảng Danh Sách Người Dùng */}
            <table className="w-full md:w-4/5 mx-auto text-lg">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left">ID</th>
                  <th className="px-6 py-3 text-left">NAME</th>
                  <th className="px-6 py-3 text-left">EMAIL</th>
                  <th className="px-6 py-3 text-left">ADMIN</th>
                  <th className="px-6 py-3 text-center">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center text-red-500 py-6">
                      No users found matching the search criteria.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user._id} className="border-t border-gray-700">
                      <td className="px-6 py-4">{user._id}</td>
                      <td className="px-6 py-4">{user.username}</td>
                      <td className="px-6 py-4">
                        <a href={`mailto:${user.email}`} className="text-blue-400 hover:underline">
                          {user.email}
                        </a>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {user.isAdmin ? (
                          <FaCheck className="text-green-500 mx-auto text-2xl" />
                        ) : (
                          <FaTimes className="text-red-500 mx-auto text-2xl" />
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex justify-center items-center gap-4">
                          <button
                            onClick={() => openEditModal(user)}
                            className="text-blue-400 hover:text-blue-600 p-3 rounded-lg"
                            title="Edit"
                          >
                            <FaEdit size={20} />
                          </button>
                          {!user.isAdmin && (
                            <button
                              onClick={() => openDeleteModal(user)}
                              className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-lg"
                              title="Delete"
                            >
                              <FaTrash size={20} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        {/* Thanh Phân Trang */}
        <div className="flex justify-center mt-6 items-center">
          {/* Nút Trang Đầu */}
          <button
            onClick={() => handlePageChange(1)}
            disabled={page === 1}
            className={`px-4 py-2 mx-1 border rounded ${
              page === 1
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gray-200 text-gray-700 border-gray-300 hover:bg-red-100 hover:border-red-400"
            }`}
            title="First Page"
          >
            «
          </button>

          {/* Nút Trang Trước */}
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className={`px-4 py-2 mx-1 border rounded ${
              page === 1
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gray-200 text-gray-700 border-gray-300 hover:bg-red-100 hover:border-red-400"
            }`}
            title="Previous Page"
          >
            ‹
          </button>

          {/* Các Nút Trang */}
          {getPageNumbers().map((pageNumber, index) => (
            <button
              key={index}
              onClick={() => typeof pageNumber === "number" && handlePageChange(pageNumber)}
              disabled={pageNumber === "..."}
              className={`px-4 py-2 mx-1 border rounded ${
                pageNumber === page
                  ? "bg-red-600 text-white border-red-600 cursor-default"
                  : typeof pageNumber === "number"
                  ? "bg-gray-200 text-gray-700 border-gray-300 hover:bg-red-100 hover:border-red-400"
                  : "bg-transparent text-gray-500 cursor-default"
              }`}
              title={typeof pageNumber === "number" ? `Go to page ${pageNumber}` : ""}
            >
              {pageNumber}
            </button>
          ))}

          {/* Nút Trang Tiếp Theo */}
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
            className={`px-4 py-2 mx-1 border rounded ${
              page === totalPages
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gray-200 text-gray-700 border-gray-300 hover:bg-red-100 hover:border-red-400"
            }`}
            title="Next Page"
          >
            ›
          </button>

          {/* Nút Trang Cuối */}
          <button
            onClick={() => handlePageChange(totalPages)}
            disabled={page === totalPages}
            className={`px-4 py-2 mx-1 border rounded ${
              page === totalPages
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gray-200 text-gray-700 border-gray-300 hover:bg-red-100 hover:border-red-400"
            }`}
            title="Last Page"
          >
            »
          </button>
        </div>
        </>
      )}

      {/* Modal Edit User */}
      <Modal isOpen={modalVisible && modalType === "edit"} onClose={() => setModalVisible(false)}>
        <h2 className="text-2xl font-semibold mb-4">Edit User</h2>
        {selectedUser && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col">
              <label htmlFor="editUsername" className="mb-2 text-lg">Username</label>
              <input
                id="editUsername"
                type="text"
                value={editableUserName}
                onChange={(e) => setEditableUserName(e.target.value)}
                className="p-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="editEmail" className="mb-2 text-lg">Email</label>
              <input
                id="editEmail"
                type="email"
                value={editableUserEmail}
                onChange={(e) => setEditableUserEmail(e.target.value)}
                className="p-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
              />
            </div>
            <div className="flex justify-end gap-4">
              <button
                onClick={updateHandler}
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition text-lg flex items-center gap-2"
              >
                <FaCheck /> Save
              </button>
              <button
                onClick={() => setModalVisible(false)}
                className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition text-lg flex items-center gap-2"
              >
                <FaTimes /> Cancel
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal Delete User */}
      <Modal isOpen={modalVisible && modalType === "delete"} onClose={() => setModalVisible(false)}>
        <h2 className="text-2xl font-semibold mb-4">Delete User</h2>
        {selectedUser && (
          <div className="flex flex-col gap-4">
            <p className="text-lg black-text">
              Are you sure you want to delete the user <strong>{selectedUser.username}</strong>?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={deleteHandler}
                className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition text-lg flex items-center gap-2"
              >
                <FaTrash /> Delete
              </button>
              <button
                onClick={() => setModalVisible(false)}
                className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition text-lg flex items-center gap-2"
              >
                <FaTimes /> Cancel
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default UserList;
