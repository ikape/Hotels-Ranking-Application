import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { addHotel, editHotel, deleteHotel } from '../store/hotelSlice';
import { Button, TextField, Select, MenuItem, Box, Typography, Paper, Grid, Card, CardContent, CardActions } from '@mui/material';
import { Hotel } from '../types';

const Hotels: React.FC = () => {
    const dispatch = useDispatch();
    const hotels = useSelector((state: RootState) => state.hotels.hotels);
    const categories = useSelector((state: RootState) => state.categories.categories);

    const [newHotel, setNewHotel] = useState<Hotel>({ id: '', name: '', country: '', address: '', category: '' });
    const [editMode, setEditMode] = useState(false);
    const [filteredHotels, setFilteredHotels] = useState<Hotel[]>(hotels);
    const [filterCategory, setFilterCategory] = useState<string>('');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

    const [countries, setCountries] = useState<string[]>([]);
    useEffect(() => {
        fetch('https://pkgstore.datahub.io/core/world-cities/world-cities_json/data/5b3dd46ad10990bca47b04b4739a02ba/world-cities_json.json')
            .then((response) => response.json())
            .then((data) => setCountries(Array.from(new Set(data.map((item: any) => item.country)))));
    }, []);

    useEffect(() => {
        if (filterCategory) {
            setFilteredHotels(hotels.filter(hotel => hotel.category === filterCategory));
        } else {
            setFilteredHotels(hotels);
        }
    }, [hotels, filterCategory]);

    useEffect(() => {
        setFilteredHotels(prev => [...prev].sort((a, b) => {
            const comparison = a.name.localeCompare(b.name);
            return sortOrder === 'asc' ? comparison : -comparison;
        }));
    }, [sortOrder]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewHotel(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        if (editMode) {
            dispatch(editHotel(newHotel));
        } else {
            dispatch(addHotel({ ...newHotel, id: Date.now().toString() }));
        }
        setNewHotel({ id: '', name: '', country: '', address: '', category: '' });
        setEditMode(false);
    };

    const handleEdit = (hotel: Hotel) => {
        setNewHotel(hotel);
        setEditMode(true);
    };

    const handleDelete = (id: string) => {
        dispatch(deleteHotel(id));
    };

    return (
        <Box sx={{ padding: 4 }}>
            <Typography variant="h4" gutterBottom>Manage Hotels</Typography>

            <Paper elevation={3} sx={{ padding: 3, marginBottom: 4 }}>
                <Typography variant="h6" gutterBottom>{editMode ? 'Edit Hotel' : 'Add New Hotel'}</Typography>
                <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 400 }}>
                    <TextField label="Hotel Name" name="name" value={newHotel.name} onChange={handleInputChange} required />
                    <TextField label="Address" name="address" value={newHotel.address} onChange={handleInputChange} required />
                    <Select label="Country" name="country" value={newHotel.country} onChange={(e) => setNewHotel(prev => ({ ...prev, country: e.target.value as string }))} required>
                        {countries.map((country, index) => (
                            <MenuItem key={index} value={country}>{country}</MenuItem>
                        ))}
                    </Select>
                    <Select label="Category" name="category" value={newHotel.category} onChange={(e) => setNewHotel(prev => ({ ...prev, category: e.target.value as string }))} required>
                        {categories.map((cat) => (
                            <MenuItem key={cat.id} value={cat.name}>{cat.name}</MenuItem>
                        ))}
                    </Select>
                    <Button onClick={handleSubmit} variant="contained" color="primary" sx={{ alignSelf: 'flex-start' }}>
                        {editMode ? 'Update Hotel' : 'Add Hotel'}
                    </Button>
                </Box>
            </Paper>

            <Paper elevation={3} sx={{ padding: 3, marginBottom: 4 }}>
                <Typography variant="h6">Filter & Sort</Typography>
                <Box sx={{ display: 'flex', gap: 2, marginY: 2 }}>
                    <Select label="Filter by Category" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
                        <MenuItem value="">All</MenuItem>
                        {categories.map((cat) => (
                            <MenuItem key={cat.id} value={cat.name}>{cat.name}</MenuItem>
                        ))}
                    </Select>
                    <Button onClick={() => setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'))}>
                        Sort ({sortOrder === 'asc' ? 'Ascending' : 'Descending'})
                    </Button>
                </Box>
            </Paper>

            <Typography variant="h5" gutterBottom>Hotel List</Typography>
            <Grid container spacing={2}>
                {filteredHotels.map((hotel) => (
                    <Grid item xs={12} md={6} key={hotel.id}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6">{hotel.name}</Typography>
                                <Typography color="textSecondary">{hotel.country} - {hotel.address}</Typography>
                                <Typography color="textSecondary">Category: {hotel.category}</Typography>
                            </CardContent>
                            <CardActions>
                                <Button onClick={() => handleEdit(hotel)} color="primary">Edit</Button>
                                <Button onClick={() => handleDelete(hotel.id)} color="secondary">Delete</Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default Hotels;
