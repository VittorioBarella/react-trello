import React from 'react'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'

function BoardPreview(props) {
    const navigate = useNavigate();

    const goToBoard = (boardId) => {

        navigate(`/board/${boardId}`);
    }

    return (
        <ul className='board-preview-item'
            onClick={() => goToBoard(props.board.id)} 
            style={{backgroundColor: props.board.background}}
        >
            <li>{props.board.title}</li>
        </ul>
    )
}

BoardPreview.propTypes = {
    board: PropTypes.object.isRequired,
}

export default BoardPreview;
