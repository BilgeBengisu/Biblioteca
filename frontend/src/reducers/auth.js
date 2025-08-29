// Import action type constants - these are like "event names" that tell the reducer what happened
import {
    LOGIN_SUCCESS, 
    LOGIN_FAIL, 
    USER_LOADED_SUCCESS, 
    USER_LOADED_FAIL
} from '../actions/types';

// Initial state for the auth slice of our Redux store
// This represents what the auth state looks like when the app first loads
const initialState = {
    access: localStorage.getItem('access'),        // JWT access token from localStorage (if user was previously logged in)
    refresh: localStorage.getItem('refresh'),      // JWT refresh token from localStorage
    isAuthenticated: null,                        
};

// The reducer function - this is a PURE FUNCTION that takes current state and an action, returns new state
// Redux calls this function every time an action is dispatched
export default function(state = initialState, action) {
    // Destructure the action object to get the type and payload
    const { type, payload } = action;

    // Switch statement to handle different action types
    // Each case represents a different "event" that can happen in the app
    switch(type) {
        case LOGIN_SUCCESS:
            // When login is successful:
            // 1. Store the new tokens in localStorage for persistence across browser sessions
            localStorage.setItem('access', payload.access)
            localStorage.setItem('refresh', payload.refresh)
            
            // 2. Return NEW state object (never modify existing state directly!)
            // Use spread operator (...) to copy existing state, then override specific properties
            return {
                ...state,                          // Copy all existing state properties
                isAuthenticated: true,             
                access: payload.access,            // Store the new access token
                refresh: payload.refresh           // Store the new refresh token
            }
            
        case LOGIN_FAIL:
            // When login fails:
            // 1. Clean up any existing tokens from localStorage
            localStorage.removeItem('access');
            localStorage.removeItem('refresh');
            
            // 2. Return new state with authentication reset
            return {
                ...state,                          
                access: null,                      // Clear access token
                refresh: null,                     // Clear refresh token
                isAuthenticated: false,            
                user: null                         // Clear any user data
            } 
            
        case USER_LOADED_SUCCESS:
            // When user data is successfully loaded (e.g., on app startup to check if user is still logged in)
            // This case is incomplete - you'll need to implement it based on your needs
            return {
                // TODO: 
            }
            
        case USER_LOADED_FAIL:
            // When user data fails to load (e.g., token expired, invalid token)
            // This case is incomplete - you'll need to implement it based on your needs
            return {
                // TODO: 
            }
            
        default:
            // If the action type doesn't match any of our cases, return the current state unchanged
            // This is important - reducers must always return a state object
            return state;
    }
};