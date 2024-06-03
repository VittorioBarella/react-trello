import React, { createContext, useState, useEffect } from 'react'; // Importa React, createContext para criar contexto, useState e useEffect hooks
import { firebaseAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from '../firebase'; // Importa funcionalidades de autenticação do Firebase
import { useNavigate } from 'react-router-dom'; // Importa hook de navegação

// Cria o contexto de autenticação
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({}); // Estado para armazenar dados do usuário
  const [authMessage, setAuthMessage] = useState(''); // Estado para mensagens de autenticação
  const navigate = useNavigate(); // Hook de navegação

  // useEffect para monitorar mudanças na autenticação
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
      if (user) {
        // Se o usuário estiver logado, atualiza o estado com os dados do usuário
        setUser({
          id: user.uid,
          email: user.email,
        });
      } else {
        // Se o usuário não estiver logado, limpa o estado do usuário
        setUser({});
      }
    });

    return () => unsubscribe(); // Cleanup para cancelar a inscrição na mudança de autenticação
  }, []);

  // Função para atualizar o usuário e navegar para a página de quadros
  const updateUserAndNavigate = (user) => {
    setUser(user);
    if (user && user.id) {
      navigate(`/${user.id}/boards`); // Navega para a página de quadros do usuário
    }
  };

  // Função para login
  const logIn = async (email, password, e) => {
    e.preventDefault(); // Previne o comportamento padrão do formulário
    try {
      const userCredential = await signInWithEmailAndPassword(firebaseAuth, email, password); // Tenta fazer login com email e senha
      updateUserAndNavigate({
        id: userCredential.user.uid,
        email: userCredential.user.email,
      });
    } catch (error) {
      setAuthMessage(error.message); // Define a mensagem de erro em caso de falha
    }
  };

  // Função para cadastro
  const signUp = async (email, password, e) => {
    e.preventDefault(); // Previne o comportamento padrão do formulário
    try {
      const userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, password); // Tenta criar um novo usuário com email e senha
      updateUserAndNavigate({
        id: userCredential.user.uid,
        email: userCredential.user.email,
      });
    } catch (error) {
      setAuthMessage(error.message); // Define a mensagem de erro em caso de falha
    }
  };

  // Função para logout
  const logOut = () => {
    try {
      signOut(firebaseAuth); // Faz logout do usuário
      setUser({}); // Limpa o estado do usuário
      navigate('/'); // Navega para a página inicial
    } catch (error) {
      setAuthMessage(error.message); // Define a mensagem de erro em caso de falha
    }
  };

  return (
    // Provedor do contexto de autenticação, passando valores e funções para os componentes filhos
    <AuthContext.Provider
      value={{ user, logIn, signUp, logOut, authMessage }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const AuthConsumer = AuthContext.Consumer; // Consumidor do contexto de autenticação

export { AuthProvider, AuthConsumer, AuthContext }; // Exporta o provedor, consumidor e contexto de autenticação
