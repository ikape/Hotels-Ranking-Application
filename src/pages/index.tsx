import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { addHotel, editHotel, deleteHotel } from '../store/hotelSlice';
import { Hotel } from '../types';
import Link from 'next/link';

const Home: React.FC = () => {
    const dispatch = useDispatch();
    const hotels = useSelector((state: RootState) => state.hotels.hotels);
    const categories = useSelector((state: RootState) => state.categories.categories);

    const defaultCategories = [
        { id: '1', name: '1 Star' },
        { id: '2', name: '2 Star' },
        { id: '3', name: '3 Star' },
    ];

    const [newHotel, setNewHotel] = useState<Hotel>({ id: '', name: '', country: '', address: '', category: '' });
    const [editMode, setEditMode] = useState(false);
    const [countries, setCountries] = useState<string[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [hasMounted, setHasMounted] = useState(false);
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setHasMounted(true);
    }, []);

    useEffect(() => {
        fetch('https://pkgstore.datahub.io/core/world-cities/world-cities_json/data/5b3dd46ad10990bca47b04b4739a02ba/world-cities_json.json')
            .then((response) => response.json())
            .then((data) => setCountries(Array.from(new Set(data.map((item: any) => item.country)))));
    }, []);

    const openModal = () => {
        setNewHotel({ id: '', name: '', country: '', address: '', category: '' });
        setEditMode(false);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleSubmit = () => {
        setLoading(true);
        if (editMode) {
            dispatch(editHotel(newHotel));
            setToastMessage('Hotel updated successfully!');
        } else {
            dispatch(addHotel({ ...newHotel, id: Date.now().toString() }));
            setToastMessage('Hotel added successfully!');
        }
        setNewHotel({ id: '', name: '', country: '', address: '', category: '' });
        setEditMode(false);
        setIsModalOpen(false);
        setLoading(false);
    };

    const handleDelete = (id: string) => {
        setLoading(true);
        dispatch(deleteHotel(id));
        setToastMessage('Hotel deleted successfully!');
        setLoading(false);
    };

    useEffect(() => {
        if (toastMessage) {
            const timer = setTimeout(() => setToastMessage(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [toastMessage]);

    if (!hasMounted) return null;

    return (
        <div className="max-w-lg mx-auto bg-white p-6 shadow-md rounded-lg">
            <h3 className="text-xl font-semibold mb-4 text-primary">Hotel List</h3>

            {toastMessage && <div className="mb-4 p-2 text-white bg-green-500 rounded">{toastMessage}</div>}
            {loading && <div className="mb-4 text-primary">Loading...</div>}

            <div className="flex flex-row gap-4">
                <button onClick={openModal} className="bg-primary text-white py-2 px-4 rounded-md hover:bg-secondary">
                    Add New Hotel
                </button>
                <Link href="/categories" className="bg-primary text-white py-2 px-4 rounded-md hover:bg-secondary">
                    Manage Categories
                </Link>
            </div>

            <ul className="space-y-2">
                {hotels.map((hotel) => (
                    <li key={hotel.id} className="p-4 border border-gray-200 rounded-md shadow-sm bg-gray-50">
                        <h4 className="font-semibold text-lg">{hotel.name}</h4>
                        <p className="text-sm text-gray-600">{hotel.address}</p>
                        <p className="text-sm text-gray-600"><span className="font-semibold">Country:</span> {hotel.country}</p>
                        <p className="text-sm text-gray-600"><span className="font-semibold">Category:</span> {hotel.category}</p>
                        <div className="mt-2 space-x-2">
                            <button
                                onClick={() => {
                                    setNewHotel(hotel);
                                    setEditMode(true);
                                    setIsModalOpen(true);
                                }}
                                className="text-secondary hover:underline"
                            >
                                Edit
                            </button>
                            <button onClick={() => handleDelete(hotel.id)} className="text-accent hover:underline">
                                Delete
                            </button>
                        </div>
                    </li>
                ))}
            </ul>

            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative">
                        <button onClick={closeModal} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">&#10005;</button>
                        <h2 className="text-2xl font-semibold mb-4 text-primary">{editMode ? 'Edit Hotel' : 'Add New Hotel'}</h2>
                        <form className="flex flex-col gap-4">
                            <input
                                type="text"
                                value={newHotel.name}
                                onChange={(e) => setNewHotel({ ...newHotel, name: e.target.value })}
                                placeholder="Hotel Name"
                                className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                required
                            />
                            <input
                                type="text"
                                value={newHotel.address}
                                onChange={(e) => setNewHotel({ ...newHotel, address: e.target.value })}
                                placeholder="Address"
                                className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                required
                            />
                            <select
                                value={newHotel.country}
                                onChange={(e) => setNewHotel({ ...newHotel, country: e.target.value })}
                                className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                required
                            >
                                <option value="" disabled>Select a country</option>
                                {countries.map((country, index) => (
                                    <option key={index} value={country}>{country}</option>
                                ))}
                            </select>
                            <select
                                value={newHotel.category}
                                onChange={(e) => setNewHotel({ ...newHotel, category: e.target.value })}
                                className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                required
                            >
                                <option value="" disabled>Select a category</option>
                                {defaultCategories.map((cat) => (
                                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                                ))}
                                {categories
                                    .filter((cat) => cat.isCustom)
                                    .map((cat) => (
                                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                                    ))}
                            </select>
                            <button type="button" onClick={handleSubmit} className="bg-primary text-white py-2 rounded-md hover:bg-secondary" disabled={loading}>
                                {editMode ? 'Update Hotel' : 'Add Hotel'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;
