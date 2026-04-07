import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Booking } from "@/libs/types";

type BookState = {
    bookItems: Booking[]
}

const initialState: BookState = {
    bookItems: []
}

export const bookSlice = createSlice({ 
    name: "book",
    initialState,
    reducers: {
        addBooking: (state, action:PayloadAction<Booking>) => {
            const existingIndex = state.bookItems.findIndex(obj => 
                obj.user === action.payload.user &&
                obj.campground === action.payload.campground &&
                obj.bookDate === action.payload.bookDate &&
                obj.bookEndDate === action.payload.bookEndDate
            );
            if (existingIndex >= 0) {
                state.bookItems[existingIndex] = action.payload;
            } else {
                state.bookItems.push(action.payload);
            }
        },
        removeBooking: (state, action:PayloadAction<Booking>) => {
            state.bookItems = state.bookItems.filter(obj => {
                const isSameBooking =
                    obj.user === action.payload.user &&
                    obj.campground === action.payload.campground &&
                    obj.bookDate === action.payload.bookDate &&
                    obj.bookEndDate === action.payload.bookEndDate
                return !isSameBooking;
            });
        }
    }
});

export const { addBooking, removeBooking } = bookSlice.actions;
export default bookSlice.reducer;
