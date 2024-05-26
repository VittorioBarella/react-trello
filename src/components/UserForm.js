import React, { useRef } from 'react';
import { AuthConsumer } from './AuthContext';
import { useNavigate } from 'react-router-dom';

const UserForm = () => {
  const emailInput = useRef(null);
  const passwordInput = useRef(null);
  const navigate = useNavigate();

  const redirect = (userId) => {
    navigate(`/${userId}/boards`);
  };

  return (
    <React.Fragment>
      <AuthConsumer>
        {({ user, logIn, signUp, authMessage }) => (
          !user.id ? (
            <div className="sign-up-wrapper">
              <h2>Sign in or create account</h2>
              {authMessage ? <span>{authMessage}</span> : ''}
              <form className="sign-up-form">
                <div>
                  <input
                    ref={emailInput}
                    type="email"
                    name="email"
                    placeholder="Email"
                  />
                </div>
                <div>
                  <input
                    ref={passwordInput}
                    type="password"
                    name="password"
                    placeholder="Password" />
                </div>
                <div>
                  <button onClick={(e) => logIn(emailInput.current.value, passwordInput.current.value, e)}>Login</button>
                  <button onClick={(e) => signUp(emailInput.current.value, passwordInput.current.value, e)}>Sign Up</button>
                </div>
              </form>
            </div>
          ) : (
            <button onClick={() => redirect(user.id)}>Go to my boards</button>
          )
        )}
      </AuthConsumer>
    </React.Fragment>
  );
};

export default UserForm;
