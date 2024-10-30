import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addHotel } from '../store/hotelSlice';
import { RootState } from '../store';
import { Button, TextField, Select, MenuItem, FormControl, InputLabel, Box, SelectChangeEvent } from '@mui/material';

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

    const handleCountryChange = (e: SelectChangeEvent<string>) => {
        setCountry(e.target.value as string);
    };

    const handleCategoryChange = (e: SelectChangeEvent<string>) => {
        setCategory(e.target.value as string);
    };

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
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField label="Hotel Name" value={name} onChange={(e) => setName(e.target.value)} required />
            <FormControl>
                <InputLabel>Country</InputLabel>
                <Select value={country} onChange={handleCountryChange} required>
                    {countries.map((country, index) => (
                        <MenuItem key={index} value={country}>{country}</MenuItem>
                    ))}
                </Select>
            </FormControl>
            <TextField label="Address" value={address} onChange={(e) => setAddress(e.target.value)} required />
            <FormControl>
                <InputLabel>Category</InputLabel>
                <Select value={category} onChange={handleCategoryChange} required>
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
