import React, { createContext, useState, useEffect } from 'react';
import { firebaseAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from '../firebase';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const [authMessage, setAuthMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
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
      await signInWithEmailAndPassword(firebaseAuth, email, password);
      navigate(`/${user.id}/boards`);
    } catch (error) {
      setAuthMessage(error.message);
    }
  };

  const signUp = async (email, password, e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(firebaseAuth, email, password);
      navigate(`/${user.id}/boards`);
    } catch (error) {
      setAuthMessage(error.message);
    }
  };

  const logOut = () => {
    try {
      signOut(firebaseAuth);
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
