import React from 'react'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'

function BoardPreview(props) {
    const navigate = useNavigate();

    const goToBoard = (boardId) => {
        const state = {
            title: props.board.title, 
            background: props.board.background
        };
        navigate(`/board/${boardId}`, { state });
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
