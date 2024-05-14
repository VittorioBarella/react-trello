import React from 'react'
import BoardPreview from '../BoardPreview'
import PropTypes from 'prop-types'
import CreateBoardForm from '../CreateBoardForm'


class Home extends React.Component {
    render() {
        return (
            <div>
                <CreateBoardForm
                    createNewBoard={ this.props.createNewBoard}
                />
                <div className='board-preview-wrapper'>
                {
                   Object.keys(this.props.boards).map((key) => (
                        <BoardPreview 
                            key={key}
                            board={this.props.boards[key]}
                        />
                    ))
                }
                </div>
            </div>
        )
    }
}

Home.propTypes = {
    boards: PropTypes.array.isRequired,
    createNewBoard: PropTypes.func.isRequired,
}

export default Home
