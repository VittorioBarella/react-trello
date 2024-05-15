import React from 'react';
import BoardPreview from '../BoardPreview';
import PropTypes from 'prop-types';
import CreateBoardForm from '../CreateBoardForm';
import { useNavigate, useLocation, useParams } from 'react-router-dom';

const Home = ({ boards, createNewBoard }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  // Crie um objeto `history` compatível, se necessário.
  const history = {
    push: navigate,
    replace: (path) => navigate(path, { replace: true }),
  };

  return (
    <div>
        <span>{params.userId}</span>
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
};

export default Home;
