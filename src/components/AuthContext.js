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

  const updateUserAndNavigate = (user) => {
    setUser(user);
    if (user && user.id) {
      navigate(`/${user.id}/boards`);
    }
  };

  const logIn = async (email, password, e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(firebaseAuth, email, password);
      updateUserAndNavigate({
        id: userCredential.user.uid,
        email: userCredential.user.email,
      });
    } catch (error) {
      setAuthMessage(error.message);
    }
  };

  const signUp = async (email, password, e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
      updateUserAndNavigate({
        id: userCredential.user.uid,
        email: userCredential.user.email,
      });
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
