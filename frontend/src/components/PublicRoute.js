import React from 'react';
import { Navigate } from 'react-router-dom';
import { connect } from 'react-redux';

const PublicRoute = ({ children, isAuthenticated, loading }) => {
    // If still loading authentication state, show loading or return null
    if (loading === null) {
        return <div>Loading...</div>;
    }
    
    // If authenticated, redirect to home
    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }
    
    // If not authenticated, render the public component (login/signup)
    return children;
};

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    loading: state.auth.isAuthenticated === null ? null : false
});

export default connect(mapStateToProps)(PublicRoute);
