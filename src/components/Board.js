import React from "react";
import List from './List'

class Board extends React.Component {
    render() {
        return (
            <div>
                <p>Board Component</p>
                <List />
                <List />
            </div>
        )
    }
}

export default Board;