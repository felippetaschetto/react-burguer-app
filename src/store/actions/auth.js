import * as actionTypes from './actionTypes';

import axios from 'axios';

export const authStart = () =>{
    return {
        type: actionTypes.AUTH_START        
    };
};

export const authSuccess = (authData) =>{
    return {
        type: actionTypes.AUTH_SUCCESS,
        idToken: authData.idToken,
        userId: authData.localId
    };
};

export const authFail = (error) =>{
    return {
        type: actionTypes.AUTH_FAIL,
        error: error
    };
};

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('expirationDate');
    localStorage.removeItem('userId');
    return {
        type: actionTypes.AUTH_LOGOUT,
    }
}

export const authCheckState = () => {
    return dispatch => {
        const token = localStorage.getItem('token');
        console.log('token', token);
        if(!token){
            dispatch(logout());
        }
        else{
            const expirationDate = new Date(localStorage.getItem('expirationDate'));
            if(expirationDate > new Date()){
                const userId = localStorage.getItem('userId');
                dispatch(authSuccess(token, userId));
                dispatch(checkAuthTimeout((expirationDate.getTime() - new Date().getTime())/1000));
            }
            else{
                dispatch(logout());
            }
        }

    };
};

export const checkAuthTimeout = (expirationTime) => {
    return dispatch => {
        setTimeout(() => {
            dispatch(logout());    
        }, expirationTime * 1000);
    };
};

export const auth = (email,password, isSignup) => {
    return dispatch => {
        dispatch(authStart());
        
        const authData = {
            email:email,
            password: password,
            returnSecureToken: true
        };
        
        let url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAn6MCZujxulvRVHnUiEtF6QpWyzrb33Rw';
        if(!isSignup)
            url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAn6MCZujxulvRVHnUiEtF6QpWyzrb33Rw';
        
        axios.post(url, authData)
            .then(response => {
                console.log(response);
                const expirationDate = new Date(new Date().getTime() + response.data.expiresIn * 1000);
                localStorage.setItem('token', response.data.idToken);
                localStorage.setItem('expirationDate', expirationDate);
                localStorage.setItem('userId', response.data.localId);
                dispatch(authSuccess(response.data));
                dispatch(checkAuthTimeout(response.data.expiresIn));
            })
            .catch(err => {
                console.log(err.response.data.error);
                dispatch(authFail(err.response.data.error));
        });
    };
};

export const setAuthRedirectPath = (path) => {    
    return {
        type: actionTypes.SET_AUTH_REDIRECT_PATH,
        path: path
    }
}