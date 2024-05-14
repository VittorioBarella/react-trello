import React from 'react'
import PropTypes from 'prop-types'
class BoardPreview extends React.Component {
    render() {
        return (
            <p>{this.props.board.title}</p>
        )
    }
}

BoardPreview.propTypes = {
    board: PropTypes.object.isRequired,
}

export default BoardPreview