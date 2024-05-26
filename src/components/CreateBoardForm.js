import React from 'react'
import PropTypes from 'prop-types'
import { AuthConsumer } from './AuthContext'
class CreateBoardForm extends React.Component {
    state = {
        title: '',
        background: '#80ccff'
    }

    handleSubmit = (e, userId) => {
        e.preventDefault();
        const board = { 
            title: this.state.title,
            background: this.state.background,
            createdAt: new Date(),
            user: userId
        }
        if(board.title && board.background && board.user) {
            this.props.createNewBoard(board)
        }
    }
    render() {
        return (
            <AuthConsumer>
                {({ user }) => (
                    <form 
                    className='create-board-wrapper'
                    onSubmit={(e) => this.handleSubmit(e, user.id) }
                    >
                    <input 
                        type='text'
                        name="name"
                        placeholder='Board name'
                        onChange={(e) => this.setState({ title: e.target.value })}
                    />
                    <select name="background"
                        onChange={(e) => this.setState({ background: e.target.value })}
                    >
                        <option value="#80ccff">
                            Blue
                        </option>
                        <option value="#80ffaa">
                            Green
                        </option>
                        <option value="#f94a1e">
                            Red
                        </option>
                        <option value="#ffb3ff">
                            Pink
                        </option>
                        <option value="#bf00ff">
                            Purple
                        </option>
                        <option value="#ffad33">
                            Orange
                        </option>
                    </select>
                    <button type='submit'>Create new board</button>
                    </form>
                )}
            </AuthConsumer>
           
        )
    }
}

CreateBoardForm.propTypes = { 
    createNewBoard: PropTypes.func.isRequired
}
export default CreateBoardForm