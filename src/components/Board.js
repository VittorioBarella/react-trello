import React from "react";
import List from './List'
import data from '../sampleData'

class Board extends React.Component {
    state =  {
        currentLists: []
    }
    componentDidMount() {
        this.setState({
            currentLists: data.lists
        })
    }

    createNewList = () => {
        const list = {
            id: Math.random(), 
            title: "My amazing list",
            board: 300,
            createAt: new Date()
        }
        this.setState({ currentLists: [...this.state.currentLists, list]})
    }
    render() {
        return (
            <div className="lists-wrapper">
                <button onClick={this.createNewList}> New List </button>
                {Object.keys(this.state.currentLists).map(key => (
                    <List  
                    key={this.state.currentLists[key].id}
                    list={this.state.currentLists[key]}
                    />
                ))}
            </div>
        )
    }
}

export default Board;