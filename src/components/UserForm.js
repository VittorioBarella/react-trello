import React, { useRef } from 'react';
import { AuthConsumer } from './AuthContext'; // Importa AuthConsumer para consumir o contexto de autenticação
import { useNavigate } from 'react-router-dom'; // Importa useNavigate para navegação programática

const UserForm = () => {
  const emailInput = useRef(null); // Cria uma referência para o campo de entrada do email
  const passwordInput = useRef(null); // Cria uma referência para o campo de entrada da senha
  const navigate = useNavigate(); // Hook para navegação programática

  const redirect = (userId) => {
    navigate(`/${userId}/boards`); // Função para redirecionar o usuário para a página de boards
  };

  return (
    <React.Fragment>
      <AuthConsumer>
        {({ user, logIn, signUp, authMessage }) => (
          !user.id ? (
            <div className="sign-up-wrapper">
              <h2>Sign in or create account</h2>
              {authMessage ? <span>{authMessage}</span> : ''} {/* Exibe mensagem de autenticação, se houver */}
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
                    placeholder="Password"
                  />
                </div>
                <div>
                  <button 
                    onClick={(e) => logIn(emailInput.current.value, passwordInput.current.value, e)}
                  >
                    Login
                  </button>
                  <button 
                    onClick={(e) => signUp(emailInput.current.value, passwordInput.current.value, e)}
                  >
                    Sign Up
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <button onClick={() => redirect(user.id)}>Go to my boards</button> // Botão para redirecionar para os boards se o usuário estiver logado
          )
        )}
      </AuthConsumer>
    </React.Fragment>
  );
};

export default UserForm; // Exporta o componente UserForm como padrão
