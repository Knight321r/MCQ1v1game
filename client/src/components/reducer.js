import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: 'user',
    initialState: {
        username: "",
        password: "",
        email: "",
    },
    reducers: {
        setusername: (state, action) => {
            state.username = action.payload;
        },
        setemail: (state, action) => {
            state.email = action.payload;
        },
        setpassword: (state, action) => {
            state.password = action.payload;
        },
    }
});

export const { setusername, setemail, setpassword } = userSlice.actions;
export default userSlice.reducer;

