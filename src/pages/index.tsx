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

    // States for filtering, sorting, and search
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [searchTerm, setSearchTerm] = useState<string>('');

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

    // Filtering and sorting logic
    const filteredHotels = hotels.filter((hotel) =>
        (!selectedCategory || hotel.category === selectedCategory) &&
        hotel.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sortedHotels = [...filteredHotels].sort((a, b) => {
        const comparison = a.name.localeCompare(b.name);
        return sortOrder === 'asc' ? comparison : -comparison;
    });

    if (!hasMounted) return null;

    return (
        <div className="max-w-[1440px] bg-gray-400 mx-auto p-6 shadow-md rounded-lg mt-4">
            <div className='text-center'>
                <h3 className="text-3xl font-semibold mb-4 text-primary">Hotel Ranking Application</h3>

                {toastMessage && <div className="mb-4 p-2 text-white bg-green-500 rounded">{toastMessage}</div>}
                {loading && <div className="mb-4 text-primary">Loading...</div>}

                <div className="flex flex-row gap-4 mb-4 pb-4 items-center justify-center">
                    <button onClick={openModal} className="bg-primary text-white py-2 px-4 rounded-md hover:bg-secondary">
                        Add New Hotel
                    </button>
                    <Link href="/categories" className="bg-primary text-white py-2 px-4 rounded-md hover:bg-secondary">
                        Manage Categories
                    </Link>
                </div>

                {/* Filter, Sort, and Search Controls */}
                <div className="flex flex-row gap-4 items-center justify-center mb-4">
                    {/* Category Filter */}
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="border border-gray-300 rounded-md p-2"
                    >
                        <option value="">All Categories</option>
                        {[...defaultCategories, ...categories.filter((cat) => cat.isCustom)].map((cat) => (
                            <option key={cat.id} value={cat.name}>{cat.name}</option>
                        ))}
                    </select>

                    {/* Sorting Toggle */}
                    <button
                        onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                        className="bg-primary text-white py-2 px-4 rounded-md hover:bg-secondary"
                    >
                        Sort by Name ({sortOrder === 'asc' ? 'Ascending' : 'Descending'})
                    </button>

                    {/* Search by Name */}
                    <input
                        type="text"
                        placeholder="Search hotels by name"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="border border-gray-300 rounded-md p-2"
                    />
                </div>
            </div>

            <ul className="grid grid-cols-3 gap-4">
                {sortedHotels.map((hotel) => (
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
                                className="text-green-500 hover:underline"
                            >
                                Edit
                            </button>
                            <button onClick={() => handleDelete(hotel.id)} className="text-red-500 hover:underline">
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
                            <div className='flex flex-col'>
                                <label htmlFor="name">Hotel Name</label>
                                <input
                                    id='name'
                                    type="text"
                                    value={newHotel.name}
                                    onChange={(e) => setNewHotel({ ...newHotel, name: e.target.value })}
                                    placeholder="Hotel Name"
                                    className="border border-gray-300 rounded-md p-2 pt-0 focus:outline-none focus:ring-2 focus:ring-primary"
                                    required
                                />
                            </div>

                            <div className='flex flex-col'>
                                <label htmlFor="address">Hotel Address</label>
                                <input
                                    id='address'
                                    type="text"
                                    value={newHotel.address}
                                    onChange={(e) => setNewHotel({ ...newHotel, address: e.target.value })}
                                    placeholder="Address"
                                    className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                    required
                                />
                            </div>

                            <div className='flex flex-col'>
                                <label htmlFor="country">Country</label>
                                <select
                                    id='country'
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
                            </div>

                            <div className='flex flex-col'>
                                <label htmlFor="category">Category</label>
                                <select
                                    id='category'
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
                            </div>
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
