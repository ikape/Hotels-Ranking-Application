import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { addCategory, editCategory, deleteCategory } from '../store/categorySlice';
import { Category } from '../types';
import { useRouter } from 'next/router'; // Import useRouter for navigation

const Categories: React.FC = () => {
    const dispatch = useDispatch();
    const router = useRouter(); // Initialize router
    const categories = useSelector((state: RootState) => state.categories.categories);

    // Define default categories that should not be editable or deletable
    const defaultCategories = [
        { id: '1', name: '1 Star' },
        { id: '2', name: '2 Star' },
        { id: '3', name: '3 Star' },
    ];

    const [newCategory, setNewCategory] = useState<Category>({ id: '', name: '', isCustom: true });
    const [editMode, setEditMode] = useState(false);
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = () => {
        setLoading(true);
        if (editMode) {
            dispatch(editCategory(newCategory));
            setToastMessage('Category updated successfully!');
        } else {
            dispatch(addCategory({ ...newCategory, id: Date.now().toString() }));
            setToastMessage('Category added successfully!');
        }
        setNewCategory({ id: '', name: '', isCustom: true });
        setEditMode(false);
        setLoading(false);
    };

    const handleDelete = (id: string) => {
        setLoading(true);
        dispatch(deleteCategory(id));
        setToastMessage('Category deleted successfully!');
        setLoading(false);
    };

    // Automatically clear toast message after 3 seconds
    useEffect(() => {
        if (toastMessage) {
            const timer = setTimeout(() => setToastMessage(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [toastMessage]);

    return (
        <div className="max-w-md mx-auto bg-white p-6 shadow-md rounded-lg">
            {/* Back Button */}
            <button
                onClick={() => router.back()}
                className="text-primary text-lg flex items-center gap-2 mb-4"
            >
                <span className="material-icons"></span>
                Back
            </button>

            <h2 className="text-2xl font-semibold mb-4 text-primary">{editMode ? 'Edit Category' : 'Add New Category'}</h2>

            {toastMessage && <div className="mb-4 p-2 text-white bg-green-500 rounded">{toastMessage}</div>}
            {loading && <div className="mb-4 text-primary">Loading...</div>}

            <form className="flex flex-col gap-4 mb-6">
                <input
                    type="text"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                    placeholder="Category Name"
                    className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                />
                <button
                    type="button"
                    onClick={handleSubmit}
                    className="bg-primary text-white py-2 rounded-md hover:bg-secondary"
                    disabled={loading}
                >
                    {editMode ? 'Update Category' : 'Add Category'}
                </button>
            </form>

            <h3 className="text-xl font-semibold mb-4 text-primary">Category List</h3>

            {/* Render Fixed Categories */}
            <ul className="space-y-2">
                {defaultCategories.map((category) => (
                    <li key={category.id} className="flex justify-between items-center p-2 border-b border-gray-200">
                        <span>{category.name}</span>
                    </li>
                ))}

                {/* Render Custom Categories */}
                {categories
                    .filter((category) => category.isCustom)
                    .map((category) => (
                        <li key={category.id} className="flex justify-between items-center p-2 border-b border-gray-200">
                            <span>{category.name}</span>
                            <div className="space-x-2">
                                <button
                                    onClick={() => {
                                        setNewCategory({ ...category, isCustom: true }); // Set isCustom to true for custom categories
                                        setEditMode(true);
                                    }}
                                    className="text-green-500 hover:underline"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(category.id)}
                                    className="text-red-500 hover:underline"
                                >
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))}
            </ul>
        </div>
    );
};

export default Categories;
