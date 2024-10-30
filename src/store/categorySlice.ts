import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Category {
    id: string;
    name: string;
    isCustom: boolean;  // Add `isCustom` property to distinguish between default and custom categories
}

interface CategoryState {
    categories: Category[];
}

const initialState: CategoryState = {
    categories: [
        { id: '1', name: '1 Star', isCustom: false },
        { id: '2', name: '2 Star', isCustom: false },
        { id: '3', name: '3 Star', isCustom: false },
    ],
};

const categorySlice = createSlice({
    name: 'categories',
    initialState,
    reducers: {
        addCategory: (state, action: PayloadAction<Category>) => {
            // Ensure only custom categories are added
            state.categories.push({ ...action.payload, isCustom: true });
        },
        deleteCategory: (state, action: PayloadAction<string>) => {
            // Only delete categories marked as custom
            state.categories = state.categories.filter(cat => cat.id !== action.payload && cat.isCustom);
        },
        editCategory: (state, action: PayloadAction<Category>) => {
            // Only allow editing of custom categories
            const index = state.categories.findIndex(cat => cat.id === action.payload.id && cat.isCustom);
            if (index !== -1) state.categories[index] = action.payload;
        },
    },
});

export const { addCategory, deleteCategory, editCategory } = categorySlice.actions;
export default categorySlice.reducer;
