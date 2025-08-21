import React from "react";
import { Routes, Route, Link } from 'react-router-dom';

export default function Home() {

  return (
    <>
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
    </>
  );
}
