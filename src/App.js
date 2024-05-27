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

  useEffect(() => {
    fetchUserIdAfterAuth();
  }, []);

  const fetchUserIdAfterAuth = () => {
    const auth = getAuth();
    auth.onAuthStateChanged((user) => {
      if (user) {
        const userId = user.uid;
        setUserId(userId);
        getBoards();
      } else {
        console.log('User is not authenticated. Redirecting to login page...');
        setUserId(null);
      }
    });
  }

  const getBoards = async () => {
    try {
      if (!userId) return;
      setBoards([]);
      const q = query(boardsRef, where('board.user', '==', userId), orderBy('createdAt'));
      const boardsSnapshot = await getDocs(q);
      const boardsData = [];
      boardsSnapshot.forEach((doc) => {
        const boardData = doc.data().board;
        boardsData.push({ id: doc.id, ...boardData });
      });
      setBoards(boardsData);
    } catch (error) {
      console.error('Error getting boards:', error);
    }
  }

  const createNewBoard = async (board) => {
    try {
      const boardData = {
        title: board.title,
        background: board.background,
        createdAt: new Date(), 
        user: userId 
      };
      
      const newBoard = await addDoc(boardsRef, { board: boardData });
      const boardObj = {
        id: newBoard.id,
        ...boardData
      };
  
      setBoards(prevBoards => [...prevBoards, boardObj]); 
    } catch (error) {
      console.error('Error creating new board:', error);
    }
  }

  const deleteBoard = async (boardId) => {
    try {
      await deleteDoc(doc(boardsRef, boardId));
      setBoards(prevBoards => prevBoards.filter(board => board.id !== boardId));
    } catch (error) {
      console.error('Error deleting board:', error);
    }
  }

  const updateBoard = async (boardId, newTitle) => {
    try {
      const boardDoc = doc(boardsRef, boardId);
      await updateDoc(boardDoc, { title: newTitle });
      setBoards(prevBoards => prevBoards.map(board =>
        board.id === boardId ? { ...board, title: newTitle } : board
      ));
    } catch (error) {
      console.error('Error updating board:', error);
    }
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
