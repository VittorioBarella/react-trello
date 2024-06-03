import React, { useEffect } from 'react'; // Importa React e o hook useEffect para lidar com efeitos colaterais
import BoardPreview from '../BoardPreview'; // Importa o componente BoardPreview
import PropTypes from 'prop-types'; // Importa PropTypes para validação de tipos de propriedades
import CreateBoardForm from '../CreateBoardForm'; // Importa o componente CreateBoardForm
import { useNavigate, useParams } from 'react-router-dom'; // Importa hooks de roteamento

const Home = ({ boards, createNewBoard, getBoards }) => {
  const navigate = useNavigate(); // useNavigate retorna uma função que permite navegar programaticamente

  return (
    <div>
      {/* Renderiza o formulário para criar um novo quadro */}
      <CreateBoardForm createNewBoard={createNewBoard} /> 
      <div className='board-preview-wrapper'>
        {/* Mapeia a lista de quadros para renderizar um BoardPreview para cada um */}
        {boards.map((board, index) => (
          <BoardPreview key={index} board={board} />
        ))}
      </div>
    </div>
  );
};

// Define os tipos esperados para as props do componente
Home.propTypes = {
  boards: PropTypes.array.isRequired, // boards deve ser um array e é obrigatório
  createNewBoard: PropTypes.func.isRequired, // createNewBoard deve ser uma função e é obrigatória
  getBoards: PropTypes.func.isRequired, // getBoards deve ser uma função e é obrigatória
};

export default Home; // Exporta o componente Home como padrão
