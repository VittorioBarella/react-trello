import React from 'react'; // Importa a biblioteca React
import { AuthConsumer } from './AuthContext'; // Importa AuthConsumer para consumir o contexto de autenticação

const Header = () => (
    <header>
        <AuthConsumer>
            {({ user, logOut }) => ( // Função de renderização dentro do AuthConsumer que usa desestruturação para obter user e logOut do contexto
                <React.Fragment>
                    <a href={user.id ? `/${user.id}/boards` : `/`}> {/* Link que redireciona para os quadros do usuário logado ou para a página inicial */}
                        <span role="img" aria-label="house emoji">&#127968;</span> {/* Ícone de casa */}
                    </a>
                    <h1>React Trello </h1> {/* Título do aplicativo */}

                    <div className="user-area">
                        {user.id ? ( // Verifica se o usuário está logado
                            <React.Fragment>
                                <small>User: {user.email}</small> {/* Mostra o e-mail do usuário logado */}
                                <button onClick={(e) => logOut(e)}>Log out</button> {/* Botão de logout que chama a função logOut */}
                            </React.Fragment>
                        ) : (
                            <small>Please sign in</small> // Mensagem exibida quando não há usuário logado
                        )}
                    </div>
                </React.Fragment>
            )}
        </AuthConsumer>
    </header>
);

export default Header; // Exporta o componente Header como padrão
