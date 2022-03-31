import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FirebaseContext from '../context/firebase';

function Login(props) {
  const { firebase } = useContext(FirebaseContext);
  const navigate = useNavigate();

  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const isInvalid = password === '' || emailAddress === '';

  const handleLogin = e => {
    e.preventDefault();
  };

  useEffect(() => {
    document.title = 'Login - Instagram';
  }, []);

  return <div className="container flex">I'm Login Page</div>;
}

export default Login;
