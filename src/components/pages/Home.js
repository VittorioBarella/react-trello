import React, { useEffect } from 'react';
import BoardPreview from '../BoardPreview';
import PropTypes from 'prop-types';
import CreateBoardForm from '../CreateBoardForm';
import { useNavigate, useLocation, useParams } from 'react-router-dom';

const Home = ({ boards, createNewBoard, getBoards }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  // useEffect substitui componentDidMount
  useEffect(() => {
    getBoards();
  }, [getBoards]);

  const history = {
    push: navigate,
    replace: (path) => navigate(path, { replace: true }),
  };

  return (
    <div>
      <CreateBoardForm createNewBoard={createNewBoard} />
      <div className='board-preview-wrapper'>
        {boards.map((board, index) => (
          <BoardPreview key={index} board={board} />
        ))}
      </div>
    </div>
  );
};

Home.propTypes = {
  boards: PropTypes.array.isRequired,
  createNewBoard: PropTypes.func.isRequired,
  getBoards: PropTypes.func.isRequired, 
};

export default Home;
