import React from 'react'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'

function BoardPreview(props) {
    const navigate = useNavigate();

    const goToBoard = () => {
        const boardId = props.board.id
        navigate(`/board/${boardId}`);
    }

    return (
        <ul className='board-preview-item'
            onClick={goToBoard}
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
