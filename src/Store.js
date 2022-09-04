import { createContext, useReducer } from "react";

// Creating a store that can be used across components
export const Store = createContext();

// Initial state
const initialState = {
    userInfo: localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo'))
    : null,
};


// reducer
function reducer(state, action) {
    switch (action.type) {
        case 'LIKE_POST':
            return { ...state, newLink: action.payload };
        case 'USER_SIGNIN':
            return { ...state, userInfo: action.payload };
        case 'USER_SIGNOUT':
            return {
                ...state,
                userInfo: null,
            };
        default:
            return state;
    }
}



// storeProvider serves as a wrapper for our react application and also to parse|passed global props to children
export function StoreProvider(props) {
    const [state, dispatch] = useReducer(reducer, initialState);
    const value = { state, dispatch }; // contains the current and dispatch fnx to update that state
    return <Store.Provider value={value}>{props.children} </Store.Provider>
}