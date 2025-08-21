import React from "react";
import { Routes, Route, Link} from 'react-router-dom';

export default function Login() {

  return (
    <div>
      <h2>Login</h2>
      <form>
        <input type="email" placeholder="Email" />
        <input type="password" placeholder="Password" />
        <button type="submit">Login</button>
      </form>
      <p>Don't have an account? <Link to="/register">Register</Link></p>
    </div>
  );
}
