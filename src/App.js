import React from 'react';
import './App.css';
import Board from './components/Board'; 
import Home from './components/pages/Home';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import PageNotFound from './components/pages/PageNotFound';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { boardsRef } from './firebase';
import { AuthProvider}  from './components/AuthContext'
import UserForm from './components/UserForm';

class App extends React.Component {
  state = {
    boards: []
  };

  componentDidMount() {
    this.getBoards();
  }

  getBoards = async () => {
    try {
      this.setState({ boards: [] });
      const boardsSnapshot = await getDocs(boardsRef);
      const boards = [];
      boardsSnapshot.forEach((doc) => {
        const boardData = doc.data();
        console.log(boardData); // Log the data of the document to the console
        boards.push({ id: doc.id, ...boardData });
      });
      this.setState({ boards });
    } catch (error) {
      console.error('Error getting boards:', error);
    }
  }

  createNewBoard = async (board) => {
    try {
      const newBoard = await addDoc(boardsRef, board);
      const boardObj = {
        id: newBoard.id,
        ...board
      };

      this.setState({ boards: [...this.state.boards, boardObj] });
    } catch (error) {
      console.error('Error creating new board:', error);
    }
  }

  deleteBoard = async (boardId) => {
    try {
      await deleteDoc(doc(boardsRef, boardId));
      this.setState({
        boards: this.state.boards.filter(board => board.id !== boardId)
      });
    } catch (error) {
      console.error('Error deleting board:', error);
    }
  }

  updateBoard = async (boardId, newTitle) => {
    try {
      const boardDoc = doc(boardsRef, boardId);
      await updateDoc(boardDoc, { title: newTitle });
      this.setState({
        boards: this.state.boards.map(board =>
          board.id === boardId ? { ...board, title: newTitle } : board
        )
      });
    } catch (error) {
      console.error('Error updating board:', error);
    }
  }

  render() {
    return (
      <div>
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route
                path='/'
                element={<UserForm />}
              />
              <Route
                path="/:userId/boards"
                element={
                  <Home 
                    boards={this.state.boards} 
                    createNewBoard={this.createNewBoard}
                    getBoards={this.getBoards}
                    deleteBoard={this.deleteBoard}
                  />
                }
              />
              <Route 
                path="/board/:boardId" 
                element={
                  <BoardWrapper 
                    deleteBoard={this.deleteBoard}   
                    updateBoard={this.updateBoard} 
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
