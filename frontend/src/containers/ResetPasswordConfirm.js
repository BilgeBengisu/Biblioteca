import React, { useState } from 'react';
import { Navigate, useParams} from 'react-router-dom';
import { connect } from 'react-redux';
import { reset_password_confirm } from '../actions/auth';

const ResetPasswordConfirm = ({match, reset_password_confirm}) => {
    const [requestSent, setRequestSent] = useState(false);
    const [formData, setFormData] = useState({
        new_password: '',
        re_new_password: ''
    });

    const { new_password, re_new_password } = formData;
    
    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const { uid, token } = useParams();   // replaces match.params from react v5

    const onSubmit = (e) => {
        e.preventDefault();
        console.log("reset password confirmed");

        reset_password_confirm(uid, token, new_password, re_new_password);
            setRequestSent(true);
    };


    if (requestSent) {
        return <Navigate to='/' />
    }

    return (
        <div className="container mt-5">
            <h1>Request Password Reset</h1>
            <form onSubmit={e => onSubmit(e)}>
                <div className="form-group">
                    <input 
                        className="form-control" 
                        type="password" 
                        placeholder="Nueva contraseña" 
                        name="new_password" 
                        value={new_password} 
                        onChange={e => onChange(e)} 
                        minLength="6" 
                        required 
                    />
                </div>
                <div className="form-group">
                    <input 
                        className="form-control" 
                        type="password" 
                        placeholder="Confirma nueva contraseña" 
                        name="re_new_password" 
                        value={re_new_password} 
                        onChange={e => onChange(e)} 
                        minLength="6" 
                        required 
                    />
                </div>
                <button className="btn btn-primary" type="submit">Reset Password</button>
            </form>
        </div>
    );
};
export default connect(null, { reset_password_confirm })(ResetPasswordConfirm);

