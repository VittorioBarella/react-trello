import React from 'react'
import BoardPreview from '../BoardPreview'

class Home extends React.Component {
    newBoard = () => {
        const board = {
            title: "Trips to take this year",
            background: '#80ffaa',
            createdAt: new Date()
        }
        this.props.createNewBoard(board)
    }

    render() {
        return (
            <div>
                <button onClick={this.newBoard}> New board</button>
                {
                   Object.keys(this.props.boards).map((key) => (
                        <BoardPreview 
                            key={key}
                            board={this.props.boards[key]}
                        />
                    ))
                }
            </div>
        )
    }
}

export default Home
