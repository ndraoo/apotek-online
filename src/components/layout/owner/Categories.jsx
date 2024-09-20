import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../../context/authContext.js';
import { getConfig, BASE_URL } from '../../../services/authService.js';
import Modal from './Modal'; 
import SideBar from './SideBar.jsx';
import Header from './Header.jsx';
import Pagination from '../../custom/Pagination.jsx';
import Swal from 'sweetalert2';
const Categories = () => {
  const { accessToken } = useContext(AuthContext);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    icon: null,
  });
  const [editMode, setEditMode] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); 
  const [totalPages, setTotalPages] = useState(1);

  // Fetch categories on load
  useEffect(() => {
    fetchCategories();
  }, [accessToken, currentPage]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/categories?page=${currentPage}`, getConfig(accessToken));
      setCategories(response.data.data.data);  
      setTotalPages(response.data.data.last_page); // Set total pages
      console.log(response.data); 
    } catch (error) {
      console.error('Error fetching categories:', error);
    }  
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      icon: e.target.files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    if (formData.icon) {
      formDataToSend.append('icon', formData.icon);
    }

    try {
      
      if (editMode) {
        await axios.put(`${BASE_URL}/categories/${currentCategory.id}`, formDataToSend, getConfig(accessToken));
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Category updated successfully!',
          customClass: {
              confirmButton: 'bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700',
          },
          buttonsStyling: false,})
      } else {
        await axios.post(`${BASE_URL}/categories`, formDataToSend, getConfig(accessToken));
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Category added successfully!!',
          customClass: {
              confirmButton: 'bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700',
          },
          buttonsStyling: false, })
      }

      fetchCategories();
      resetForm();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error submitting form:', error);
      Swal.fire('Error', 'Failed to submit form', 'error');
    }
  };

  const handleEdit = (category) => {
    setEditMode(true);
    setCurrentCategory(category);
    setFormData({
      name: category.name,
      icon: null,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${BASE_URL}/categories/${id}`, getConfig(accessToken));
          Swal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: 'Category has been deleted.',
            customClass: {
                confirmButton: 'bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700',
            },
            buttonsStyling: false,
        })  
          fetchCategories();
        } catch (error) {
          console.error('Error deleting category:', error);
          Swal.fire('Error', 'Failed to delete category', 'error');
        }
      }
    });
  };
  
  const resetForm = () => {
    setFormData({
      name: '',
      icon: null,
    });
    setEditMode(false);
    setCurrentCategory(null);
  };
  return (
    <div className="flex hv-screen">
    <SideBar />
    <main className="flex-1 p-6 bg-gray-100">
        <Header />
    <div className='mt-4'>
      <button
        onClick={() => {
          setEditMode(false);
          setCurrentCategory(null);
          setIsModalOpen(true);
        }}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
        >
        Add Category
      </button>

      <table className="table-auto w-full">
        <thead>
          <tr>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Icon</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.length > 0 ? (
            categories.map((category) => (
              <tr key={category.id}>
                <td className="border px-4 py-2">{category.name}</td>
                <td className="border px-4 py-2">
                  {category.icon && (
                    <img src={category.icon} alt={category.name} className="w-12 h-12" />
                  )}
                </td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => handleEdit(category)}
                    className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-3 rounded mr-2"
                    >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded"
                    >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="text-center py-4">
                No categories available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {categories.length > 0 && (
       <Pagination
       currentPage={currentPage}
       totalPages={totalPages}
       setCurrentPage={setCurrentPage}
     />
      )}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-xl font-semibold mb-4">
          {editMode ? 'Edit Category' : 'Add Category'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
              placeholder="Category Name"
              />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Icon</label>
            <input
              type="file"
              name="icon"
              onChange={handleFileChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
              />
          </div>

          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
              {editMode ? 'Update Category' : 'Add Category'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
    </main>
    </div>
  );
};

export default Categories;
