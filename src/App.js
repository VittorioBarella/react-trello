import React from 'react';
import './App.css';
import Board from './components/Board'; 
import data from './sampleData';
import Home from './components/pages/Home';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import PageNotFound from './components/pages/PageNotFound';
import { useNavigate, useLocation, useParams } from 'react-router-dom';

class App extends React.Component {
  state = {
    boards: []
  };

  componentDidMount() {
    this.setState({ boards: data.boards });
  }

  createNewBoard = board => {
    this.setState({ boards: [...this.state.boards, board] });
  };

  render() {
    return (
      <div>
        <BrowserRouter>
          <Routes>
            <Route
              path="/:userId/boards"
              element={
                <Home 
                  boards={this.state.boards} 
                  createNewBoard={this.createNewBoard} 
                />
              }
            />
            <Route path="/board/:boardId" element={<BoardWrapper />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </BrowserRouter>
      </div>
    );
  }
}

const BoardWrapper = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  return <Board navigate={navigate} location={location} params={params} />;
};

export default App;
