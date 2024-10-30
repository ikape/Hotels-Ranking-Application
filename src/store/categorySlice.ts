import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Category {
    id: string;
    name: string;
}

interface CategoryState {
    categories: Category[];
}

const initialState: CategoryState = {
    categories: [
        { id: '1', name: '1 Star' },
        { id: '2', name: '2 Star' },
        { id: '3', name: '3 Star' },
    ],
};

const categorySlice = createSlice({
    name: 'categories',
    initialState,
    reducers: {
        addCategory: (state, action: PayloadAction<Category>) => {
            state.categories.push(action.payload);
        },
        deleteCategory: (state, action: PayloadAction<string>) => {
            state.categories = state.categories.filter(cat => cat.id !== action.payload);
        },
        editCategory: (state, action: PayloadAction<Category>) => {
            const index = state.categories.findIndex(cat => cat.id === action.payload.id);
            if (index !== -1) state.categories[index] = action.payload;
        },
    },
});

export const { addCategory, deleteCategory, editCategory } = categorySlice.actions;
export default categorySlice.reducer;
