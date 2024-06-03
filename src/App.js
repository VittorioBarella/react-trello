import React, { useState, useEffect } from 'react';
import './App.css';
import Board from './components/Board'; 
import Home from './components/pages/Home';
import { getAuth } from 'firebase/auth';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import PageNotFound from './components/pages/PageNotFound';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { getDocs, addDoc, deleteDoc, doc, updateDoc, query, where, orderBy } from 'firebase/firestore';
import { boardsRef } from './firebase';
import { AuthProvider }  from './components/AuthContext';
import UserForm from './components/UserForm';
import Header from './components/Header';

const App = () => {
  const [boards, setBoards] = useState([]);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true); // Estado para controlar o carregamento

  useEffect(() => {
    fetchUserIdAfterAuth();
  }, []);

  // Função para obter o ID do usuário após a autenticação
  const fetchUserIdAfterAuth = () => {
    const auth = getAuth();
    auth.onAuthStateChanged((user) => {
      if (user) {
        const userId = user.uid;
        setUserId(userId);
        setLoading(false); // Define o carregamento como falso quando o usuário estiver autenticado
      } else {
        console.log('User is not authenticated. Redirecting to login page...');
        setUserId(null);
        setLoading(false); // Define o carregamento como falso quando o usuário não estiver autenticado
      }
    });
  }

  useEffect(() => {
    if (userId) {
      getBoards(); // Chama getBoards apenas se userId estiver definido
    }
  }, [userId]);

  // Função para obter os quadros do usuário
  const getBoards = async () => {
    try {
      console.log("Fetching boards...");
      if (!userId) return;
      setBoards([]);
      const q = query(boardsRef, where("board.user", "==", userId), orderBy("createdAt"));
      const boardsSnapshot = await getDocs(q);
      const boardsData = [];
      boardsSnapshot.forEach((doc) => {
        const boardData = doc.data().board;
        console.log("Board found:", boardData);
        boardsData.push({ id: doc.id, ...boardData });
      });
      console.log("Boards fetched:", boardsData);
      setBoards(boardsData);
    } catch (error) {
      console.error("Error getting boards:", error);
    }
  };
  
  // Função para criar um novo quadro
  const createNewBoard = async (board) => {
    try {
      const boardData = {
        title: board.title,
        background: board.background,
        createdAt: new Date(),
        user: userId,
      };

      const newBoard = await addDoc(boardsRef, { board: boardData });
      const boardObj = {
        id: newBoard.id,
        ...boardData,
      };

      setBoards((prevBoards) => {
        const updatedBoards = [...prevBoards, boardObj];
        console.log("Boards after creation:", updatedBoards);
        return updatedBoards;
      });
    } catch (error) {
      console.error("Error creating new board:", error);
    }
  };

  // Função para excluir um quadro
  const deleteBoard = async (boardId) => {
    try {
      console.log("Deleting board:", boardId);
      await deleteDoc(doc(boardsRef, boardId));
      setBoards((prevBoards) => prevBoards.filter((board) => board.id !== boardId));
      console.log("Board deleted. Boards after deletion:", boards);
    } catch (error) {
      console.error("Error deleting board:", error);
    }
  };
  
  // Função para atualizar um quadro
  const updateBoard = async (boardId, newTitle) => {
    try {
      console.log("Updating board:", boardId);
      const boardDoc = doc(boardsRef, boardId);
      await updateDoc(boardDoc, { title: newTitle });
      setBoards((prevBoards) =>
        prevBoards.map((board) => (board.id === boardId ? { ...board, title: newTitle } : board))
      );
      console.log("Board updated. Boards after update:", boards);
    } catch (error) {
      console.error("Error updating board:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Exibe uma mensagem de carregamento enquanto aguarda a autenticação do usuário
  }

  return (
    <div>
      <BrowserRouter>
        <AuthProvider>
          <Header/>
            <Routes>
              <Route
                path='/'
                element={<UserForm />}
              />
              <Route
                path="/:userId/boards"
                element={
                  <Home 
                    boards={boards} 
                    createNewBoard={createNewBoard}
                    getBoards={getBoards}
                    deleteBoard={deleteBoard}
                    userId={userId}
                  />
                }
              />
              <Route 
                path="/board/:boardId" 
                element={
                  <BoardWrapper 
                    deleteBoard={deleteBoard}   
                    updateBoard={updateBoard} 
                  />
                } 
              />
              <Route path="*" element={<PageNotFound />} />
            </Routes>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

// Componente para renderizar o quadro
const BoardWrapper = ({ deleteBoard , updateBoard }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  return (
    <Board 
      navigate={navigate} 
      location={location} 
      params={params} 
      deleteBoard={deleteBoard}
      updateBoard={updateBoard}
    />
  );
};

export default App;
