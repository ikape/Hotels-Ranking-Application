import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { addCategory, editCategory, deleteCategory } from '../store/categorySlice';
import { Button, TextField, Box, Typography, Paper, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton } from '@mui/material';
import { Category } from '../types';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const Categories: React.FC = () => {
    const dispatch = useDispatch();
    const categories = useSelector((state: RootState) => state.categories.categories);

    const [newCategory, setNewCategory] = useState<Category>({ id: '', name: '' });
    const [editMode, setEditMode] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewCategory({ ...newCategory, name: e.target.value });
    };

    const handleSubmit = () => {
        if (editMode) {
            dispatch(editCategory(newCategory));
        } else {
            dispatch(addCategory({ ...newCategory, id: Date.now().toString() }));
        }
        setNewCategory({ id: '', name: '' });
        setEditMode(false);
    };

    const handleEdit = (category: Category) => {
        setNewCategory(category);
        setEditMode(true);
    };

    const handleDelete = (id: string) => {
        dispatch(deleteCategory(id));
    };

    return (
        <Box sx={{ padding: 4 }}>
            <Typography variant="h4" gutterBottom>Manage Categories</Typography>

            <Paper elevation={3} sx={{ padding: 3, marginBottom: 4 }}>
                <Typography variant="h6" gutterBottom>{editMode ? 'Edit Category' : 'Add New Category'}</Typography>
                <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 400 }}>
                    <TextField label="Category Name" value={newCategory.name} onChange={handleInputChange} required />
                    <Button onClick={handleSubmit} variant="contained" color="primary" sx={{ alignSelf: 'flex-start' }}>
                        {editMode ? 'Update Category' : 'Add Category'}
                    </Button>
                </Box>
            </Paper>

            <Typography variant="h5" gutterBottom>Category List</Typography>
            <List>
                {categories.map((category) => (
                    <ListItem key={category.id} sx={{ borderBottom: '1px solid #ddd' }}>
                        <ListItemText primary={category.name} />
                        <ListItemSecondaryAction>
                            <IconButton edge="end" color="primary" onClick={() => handleEdit(category)}>
                                <EditIcon />
                            </IconButton>
                            <IconButton edge="end" color="secondary" onClick={() => handleDelete(category.id)}>
                                <DeleteIcon />
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

export default Categories;
