import React, { createContext, useState, useEffect } from 'react';
import { firebaseAuth } from '../firebase';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const [authMessage, setAuthMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = firebaseAuth.onAuthStateChanged((user) => {
      if (user) {
        setUser({
          id: user.uid,
          email: user.email,
        });
      } else {
        setUser({});
      }
    });

    return () => unsubscribe();
  }, []);

  const logIn = async (email, password, e) => {
    e.preventDefault();
    try {
      await firebaseAuth.signInWithEmailAndPassword(email, password);
      navigate(`/${user.id}/boards`);
    } catch (error) {
      setAuthMessage(error.message);
    }
  };

  const signUp = async (email, password, e) => {
    e.preventDefault();
    try {
      await firebaseAuth.createUserWithEmailAndPassword(email, password);
      navigate(`/${user.id}/boards`);
    } catch (error) {
      setAuthMessage(error.message);
    }
  };

  const logOut = () => {
    try {
      firebaseAuth.signOut();
      setUser({});
      navigate('/');
    } catch (error) {
      setAuthMessage(error.message);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, logIn, signUp, logOut, authMessage }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const AuthConsumer = AuthContext.Consumer;

export { AuthProvider, AuthConsumer, AuthContext };
