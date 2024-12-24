import { useState } from "react";
import {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useFetchCategoriesQuery,
} from "../../redux/api/categoryApiSlice";

import { toast } from "react-toastify";
import CategoryForm from "../../components/CategoryForm";
import Modal from "../../components/Modal";
import AdminMenu from "./AdminMenu";

const CategoryList = () => {
  const { data: categories, isLoading, isError } = useFetchCategoriesQuery();
  const [name, setName] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [updatingName, setUpdatingName] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState(""); // "add", "edit" or "delete"

  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  // Filter categories based on search keyword
  const filteredCategories = categories?.filter((category) =>
    category.name.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  const handleCreateCategory = async (e) => {
    e.preventDefault();

    if (!name) {
      toast.error("Category name is required");
      return;
    }

    try {
      const result = await createCategory({ name }).unwrap();
      if (result.error) {
        toast.error(result.error);
      } else {
        setName("");
        toast.success(`${result.name} is created.`);
        setModalVisible(false);
        setModalType("");
      }
    } catch (error) {
      console.error(error);
      toast.error("Creating category failed, try again.");
    }
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();

    if (!updatingName) {
      toast.error("Category name is required");
      return;
    }

    try {
      const result = await updateCategory({
        categoryId: selectedCategory._id,
        updatedCategory: {
          name: updatingName,
        },
      }).unwrap();

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`${result.name} is updated`);
        setSelectedCategory(null);
        setUpdatingName("");
        setModalVisible(false);
        setModalType("");
      }
    } catch (error) {
      console.error(error);
      toast.error("Updating category failed.");
    }
  };

  const handleDeleteCategory = async () => {
    if (!selectedCategory || !selectedCategory._id) {
      toast.error("Invalid category selected.");
      return;
    }

    try {
      const result = await deleteCategory(selectedCategory._id).unwrap();

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`${result.name} is deleted.`);
        setSelectedCategory(null);
        setModalVisible(false);
        setModalType("");
      }
    } catch (error) {
      console.error(error);
      toast.error("Category deletion failed. Try again.");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
  };

  const openAddModal = () => {
    setModalType("add");
    setModalVisible(true);
  };

  const openEditModal = (category) => {
    setSelectedCategory(category);
    setUpdatingName(category.name);
    setModalType("edit");
    setModalVisible(true);
  };

  const openDeleteModal = (category) => {
    setSelectedCategory(category);
    setModalType("delete");
    setModalVisible(true);
  };

  return (
    <div className="flex bg-[#1A1A1A] min-h-screen text-white ml-32">
      {/* <AdminMenu /> */}
      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Manage Categories</h2>
          <button
            className="bg-[#DC2626] text-white py-2 px-4 rounded hover:bg-green-600"
            onClick={openAddModal}
          >
            + Add a Category
          </button>
        </div>
        <hr className="border-gray-700 mb-4" />

        {/* Search Input */}
        <div className="my-4">
          <input
            type="text"
            placeholder="Search categories..."
            className="bg-[#1A1A1A] text-white border border-gray-700 p-2 rounded w-full"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") handleSearch(e);
            }}
          />
        </div>

        {/* Category Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-[#1A1A1A] border border-gray-700">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b border-gray-700">Name</th>
                <th className="py-2 px-4 border-b border-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories?.length > 0 ? (
                filteredCategories.map((category) => (
                  <tr key={category._id} className="text-center">
                    <td className="py-2 px-4 border-b border-gray-700">{category.name}</td>
                    <td className="py-2 px-4 border-b border-gray-700">
                      <button
                        className="bg-blue-500 text-white py-1 px-3 rounded mr-2 hover:bg-blue-600"
                        onClick={() => openEditModal(category)}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
                        onClick={() => openDeleteModal(category)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="2"
                    className="py-4 px-4 text-gray-400 text-center"
                  >
                    No categories found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Add Category Modal */}
        <Modal isOpen={modalVisible && modalType === "add"} onClose={() => setModalVisible(false)}>
          <h2 className="text-xl font-semibold mb-4">Add Category</h2>
          <CategoryForm
            value={name}
            setValue={setName}
            handleSubmit={handleCreateCategory}
            inputClass="bg-gray-800 text-white border border-gray-700"
            buttonClass="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
          />
        </Modal>

        {/* Edit Modal */}
        <Modal isOpen={modalVisible && modalType === "edit"} onClose={() => setModalVisible(false)}>
          <h2 className="text-xl font-semibold mb-4">Edit Category</h2>
          <CategoryForm
            value={updatingName}
            setValue={setUpdatingName}
            handleSubmit={handleUpdateCategory}
            buttonText="Update"
            inputClass="bg-gray-800 text-white border border-gray-700"
            buttonClass="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
          />
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal isOpen={modalVisible && modalType === "delete"} onClose={() => setModalVisible(false)}>
          <h2 className="text-xl font-semibold mb-4">Delete Category</h2>
          <p className="mb-4">
            Are you sure you want to delete the category "
            <strong>{selectedCategory?.name}</strong>"?
          </p>
          <div className="flex justify-end">
            <button
              className="bg-gray-600 text-gray-200 py-2 px-4 rounded mr-2 hover:bg-gray-700"
              onClick={() => setModalVisible(false)}
            >
              Cancel
            </button>
            <button
              className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
              onClick={handleDeleteCategory}
            >
              Delete
            </button>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default CategoryList;
