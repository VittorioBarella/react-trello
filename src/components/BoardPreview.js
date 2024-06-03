import React from 'react'; // Importa a biblioteca React
import PropTypes from 'prop-types'; // Importa PropTypes para validação de tipos de propriedades
import { useNavigate } from 'react-router-dom'; // Importa hook de navegação

function BoardPreview(props) {
    const navigate = useNavigate(); // Hook de navegação

    // Função para navegar para a página do quadro específico
    const goToBoard = (boardId) => {
        navigate(`/board/${boardId}`); // Navega para a rota do quadro com o boardId específico
    };

    return (
        <ul 
            className='board-preview-item'
            onClick={() => goToBoard(props.board.id)} // Chama a função goToBoard ao clicar no item
            style={{ backgroundColor: props.board.background }} // Define a cor de fundo com base na propriedade do quadro
        >
            <li>{props.board.title}</li> 
        </ul>
    );
}

// Define os tipos esperados para as props do componente
BoardPreview.propTypes = {
    board: PropTypes.object.isRequired, // A propriedade board é obrigatória e deve ser um objeto
};

export default BoardPreview; // Exporta o componente BoardPreview como padrão
