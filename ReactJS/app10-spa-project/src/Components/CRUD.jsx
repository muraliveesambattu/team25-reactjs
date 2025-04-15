import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import PropTypes from "prop-types";
import { debounce } from "lodash";
import { v4 as uuidv4 } from 'uuid';

// Custom hook for localStorage
const useLocalStorage = (key, initialValue) => {
  const [value, setValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading ${key} from localStorage:`, error);
      return initialValue;
    }
  });

  const setLocalStorageValue = useCallback(
    (newValue) => {
      try {
        setValue(newValue);
        localStorage.setItem(key, JSON.stringify(newValue));
      } catch (error) {
        console.error(`Error saving ${key} to localStorage:`, error);
      }
    },
    [key]
  );

  return [value, setLocalStorageValue];
};

const CrudUsers = ({ itemsPerPage = 5 }) => {
  const [users, setUsers] = useLocalStorage("users", []);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [form, setForm] = useState({ name: "", email: "" });
  const [editId, setEditId] = useState(null);
  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const debounceRef = useRef();

  // Debounced save function
  const saveToLocalStorage = useCallback(
    debounce((data) => {
      setUsers(data);
      setIsSaving(false);
    }, 500),
    [setUsers]
  );

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current?.cancel) {
        debounceRef.current.cancel();
      }
    };
  }, []);

  // Initial load
  useEffect(() => {
    setIsLoading(false);
  }, []);

  // Filter and sort users
  const sortedFilteredUsers = useMemo(() => {
    let result = searchTerm
      ? users.filter(
          (user) =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : [...users];

    if (sortConfig.key) {
      result.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [users, searchTerm, sortConfig]);

  // Pagination
  useEffect(() => {
    setFilteredUsers(sortedFilteredUsers);
    setTotalPages(Math.max(1, Math.ceil(sortedFilteredUsers.length / itemsPerPage)));
  }, [sortedFilteredUsers, itemsPerPage]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / itemsPerPage));
  const currentPageUsers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(start, start + itemsPerPage);
  }, [filteredUsers, currentPage, itemsPerPage]);

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const validateForm = () => {
    const newErrors = {};
    const emailSet = new Set(users.map((u) => u.email.toLowerCase()));
    
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Invalid email format";
    } else if (
      emailSet.has(form.email.toLowerCase()) &&
      !users.some((u) => u.id === editId && u.email.toLowerCase() === form.email.toLowerCase())
    ) {
      newErrors.email = "Email must be unique";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSaving(true);
    const updatedUsers = editId
      ? users.map((user) => (user.id === editId ? { ...user, ...form } : user))
      : [...users, { id: uuidv4(), ...form }];

    saveToLocalStorage(updatedUsers);
    showNotification("success", editId ? "User updated" : "User added");
    setForm({ name: "", email: "" });
    setEditId(null);
  };

  const handleCancel = () => {
    setForm({ name: "", email: "" });
    setEditId(null);
    setErrors({});
    if (debounceRef.current?.cancel) {
      debounceRef.current.cancel();
      setIsSaving(false);
    }
  };

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handleDelete = (id) => {
    setIsSaving(true);
    saveToLocalStorage(users.filter((user) => user.id !== id));
    setDeleteConfirmId(null);
    showNotification("success", "User deleted");
  };

  const handleClearAll = () => {
    if (window.confirm("Are you sure you want to delete all users?")) {
      setIsSaving(true);
      saveToLocalStorage([]);
      showNotification("success", "All users deleted");
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-xl mx-auto p-4" role="status" aria-busy="true">
        <h2 className="text-2xl font-bold mb-4">User Management (CRUD)</h2>
        <div className="animate-pulse">Loading users...</div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-4" role="main">
      <h2 className="text-2xl font-bold mb-4">User Management (CRUD)</h2>
      
      {/* Notification */}
      {notification && (
        <div 
          className={`p-2 mb-4 rounded ${notification.type === "success" ? "bg-green-100" : "bg-red-100"}`}
          role="alert"
        >
          {notification.message}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="mb-6" aria-label="User Form">
        <div className="mb-4">
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Name"
            className="w-full p-2 border rounded"
            aria-label="Name input"
            disabled={isSaving}
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>
        <div className="mb-4">
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full p-2 border rounded"
            aria-label="Email input"
            disabled={isSaving}
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
            disabled={isSaving}
            aria-label={editId ? "Update user" : "Add user"}
          >
            {isSaving ? "Saving..." : (editId ? "Update" : "Add")}
          </button>
          {(editId || isSaving) && (
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-500 text-white rounded"
              aria-label="Cancel operation"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Search */}
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearch}
        placeholder="Search users..."
        className="w-full p-2 mb-4 border rounded"
        aria-label="Search users"
      />

      {/* User List */}
      {filteredUsers.length > 0 ? (
        <>
          <table className="w-full mb-4">
            <thead>
              <tr>
                <th 
                  onClick={() => handleSort('name')} 
                  className="cursor-pointer p-2 text-left"
                  aria-sort={sortConfig.key === 'name' ? sortConfig.direction : 'none'}
                >
                  Name {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  onClick={() => handleSort('email')} 
                  className="cursor-pointer p-2 text-left"
                  aria-sort={sortConfig.key === 'email' ? sortConfig.direction : 'none'}
                >
                  Email {sortConfig.key === 'email' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentPageUsers.map((user) => (
                <tr key={user.id}>
                  <td className="p-2">{user.name}</td>
                  <td className="p-2">{user.email}</td>
                  <td className="p-2">
                    {deleteConfirmId === user.id ? (
                      <>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="text-red-500 mr-2"
                          aria-label={`Confirm delete ${user.name}`}
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(null)}
                          className="text-gray-500"
                          aria-label="Cancel delete"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEdit(user)}
                          className="text-blue-500 mr-2"
                          aria-label={`Edit ${user.name}`}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => confirmDelete(user.id)}
                          className="text-red-500"
                          aria-label={`Delete ${user.name}`}
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                aria-label="Previous page"
              >
                Previous
              </button>
              <span aria-label={`Page ${currentPage} of ${totalPages}`}>
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                aria-label="Next page"
              >
                Next
              </button>
            </div>
          )}
        </>
      ) : (
        <p className="mb-4" aria-live="polite">No users found</p>
      )}

      {users.length > 0 && (
        <button
          onClick={handleClearAll}
          className="px-4 py-2 bg-red-500 text-white rounded"
          aria-label="Delete all users"
        >
          Clear All
        </button>
      )}
    </div>
  );
};

CrudUsers.propTypes = {
  itemsPerPage: PropTypes.number,
};

export default CrudUsers;