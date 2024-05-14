import React from "react";
import Card from "./Card";


class List extends React.Component {
    render() {
        return(
            <div className="list">   
                <div className="list-header">
                <p>{this.props.list.title}</p>

                </div>         
            </div>
        )
    }
}

export default List