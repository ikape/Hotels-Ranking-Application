import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addHotel } from '../store/hotelSlice';
import { RootState } from '../store';

const HotelForm: React.FC = () => {
    const dispatch = useDispatch();
    const categories = useSelector((state: RootState) => state.categories.categories);

    const [name, setName] = useState('');
    const [country, setCountry] = useState('');
    const [address, setAddress] = useState('');
    const [category, setCategory] = useState('');
    const [countries, setCountries] = useState<string[]>([]);

    useEffect(() => {
        fetch('https://pkgstore.datahub.io/core/world-cities/world-cities_json/data/5b3dd46ad10990bca47b04b4739a02ba/world-cities_json.json')
            .then((response) => response.json())
            .then((data) => setCountries(Array.from(new Set(data.map((item: any) => item.country)))));
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !country || !address || !category) return;
        dispatch(addHotel({ id: Date.now().toString(), name, country, address, category }));
        setName('');
        setCountry('');
        setAddress('');
        setCategory('');
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md mx-auto bg-white p-6 shadow-md rounded-lg">
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Hotel Name"
                className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary"
                required
            />
            <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary"
                required
            >
                <option value="" disabled>Select a country</option>
                {countries.map((country, index) => (
                    <option key={index} value={country}>{country}</option>
                ))}
            </select>
            <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Address"
                className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary"
                required
            />
            <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary"
                required
            >
                <option value="" disabled>Select a category</option>
                {categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
            </select>
            <button type="submit" className="bg-primary text-white py-2 rounded-md hover:bg-secondary">
                Add Hotel
            </button>
        </form>
    );
};

export default HotelForm;
