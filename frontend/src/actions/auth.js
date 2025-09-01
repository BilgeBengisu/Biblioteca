import axios from 'axios';

import {
    LOGIN_SUCCESS, LOGIN_FAIL, USER_LOADED_SUCCESS, USER_LOADED_FAIL
} from './types';

export const load_user = () => async dispatch => {
    if (localStorage.getItem('access')) {
        const config = {
            headers: {
                'Content-Type': 'application/json', 
                'Authorization': `JWT ${localStorage.getItem('access')}`,
                'Accept': 'application/json'
            }
        };

        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/auth/users/me`, config);

            dispatch({
                type: USER_LOADED_SUCCESS,
                payload: res.data
            });
        } catch (err) {
            dispatch({
                type: USER_LOADED_FAIL
            });
        }
    } else {
        dispatch({
            type: USER_LOADED_FAIL
        });
    }
};

export const login = (email, password) => async dispatch => {
    console.log('🔐 Login attempt for:', email);
    console.log('🌐 Using hardcoded API URL:', process.env.REACT_APP_API_URL);
    
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const body = JSON.stringify({ email, password });
    console.log('📤 Request body:', body);

    try{
        const url = `${process.env.REACT_APP_API_URL}/auth/jwt/create`;
        console.log('🌐 Making POST request to:', url);
        
        const res = await axios.post(url, body, config);

        console.log('✅ Login successful! Response:', res.data);
        dispatch ({
            type: LOGIN_SUCCESS,
            payload: res.data
        });

        dispatch(load_user());
    } catch (err) {
        console.error('❌ Login failed!');
        console.error('Error details:', err.response?.data || err.message);
        console.error('Status code:', err.response?.status);
        console.error('Full error:', err);
        
        dispatch ({
            type: LOGIN_FAIL
        });
    }
};