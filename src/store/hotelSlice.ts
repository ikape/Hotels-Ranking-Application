import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Hotel {
    id: string;
    name: string;
    country: string;
    address: string;
    category: string;
}

interface HotelState {
    hotels: Hotel[];
}

const initialState: HotelState = {
    hotels: [],
};

const hotelSlice = createSlice({
    name: 'hotels',
    initialState,
    reducers: {
        addHotel: (state, action: PayloadAction<Hotel>) => {
            state.hotels.push(action.payload);
        },
        editHotel: (state, action: PayloadAction<Hotel>) => {
            const index = state.hotels.findIndex(hotel => hotel.id === action.payload.id);
            if (index !== -1) state.hotels[index] = action.payload;
        },
        deleteHotel: (state, action: PayloadAction<string>) => {
            state.hotels = state.hotels.filter(hotel => hotel.id !== action.payload);
        },
    },
});

export const { addHotel, editHotel, deleteHotel } = hotelSlice.actions;
export default hotelSlice.reducer;
