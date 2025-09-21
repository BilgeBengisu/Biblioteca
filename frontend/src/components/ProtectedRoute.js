import React from 'react';
import { Navigate } from 'react-router-dom';
import { connect } from 'react-redux';

const ProtectedRoute = ({ children, isAuthenticated, loading }) => {
    // If still loading authentication state, show loading or return null
    if (loading === null) {
        return <div>Loading...</div>;
    }
    
    // If not authenticated, redirect to login
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    
    // If authenticated, render the protected component
    return children;
};

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    loading: state.auth.isAuthenticated === null ? null : false
});

export default connect(mapStateToProps)(ProtectedRoute);
