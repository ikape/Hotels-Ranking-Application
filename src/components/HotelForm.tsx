import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addHotel } from '../store/hotelSlice';
import { RootState } from '../store';
import { Button, TextField, Select, MenuItem, FormControl, InputLabel, Box } from '@mui/material';

const HotelForm: React.FC = () => {
    const dispatch = useDispatch();
    const categories = useSelector((state: RootState) => state.categories.categories);

    const [formData, setFormData] = useState({ name: '', country: '', address: '', category: '' });
    const [countries, setCountries] = useState<string[]>([]);

    useEffect(() => {
        fetch('https://pkgstore.datahub.io/core/world-cities/world-cities_json/data/5b3dd46ad10990bca47b04b4739a02ba/world-cities_json.json')
            .then((response) => response.json())
            .then((data) => setCountries(data.map((item: any) => item.country)))
            .catch(() => console.warn("Failed to load countries"));
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (Object.values(formData).some(value => !value)) return;
        dispatch(addHotel({ id: Date.now().toString(), ...formData }));
        setFormData({ name: '', country: '', address: '', category: '' });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | { value: unknown }>) => {
        const { name, value } = e.target as HTMLInputElement;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField label="Hotel Name" name="name" value={formData.name} onChange={handleChange} required />
            <FormControl>
                <InputLabel>Country</InputLabel>
                <Select name="country" value={formData.country} onChange={handleChange} required>
                    {countries.map((country, index) => (
                        <MenuItem key={index} value={country}>{country}</MenuItem>
                    ))}
                </Select>
            </FormControl>
            <TextField label="Address" name="address" value={formData.address} onChange={handleChange} required />
            <FormControl>
                <InputLabel>Category</InputLabel>
                <Select name="category" value={formData.category} onChange={handleChange} required>
                    {categories.map((cat) => (
                        <MenuItem key={cat.id} value={cat.name}>{cat.name}</MenuItem>
                    ))}
                </Select>
            </FormControl>
            <Button type="submit" variant="contained">Add Hotel</Button>
        </Box>
    );
};

export default HotelForm;
