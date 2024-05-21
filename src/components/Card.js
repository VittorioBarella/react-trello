import React from "react";
import PropTypes from 'prop-types';
import { cardsRef, db } from "../firebase";
import { doc, deleteDoc } from "firebase/firestore";

class Card extends React.Component {
    deleteCard = async e => {
        try {
            e.preventDefault();
            const cardId = this.props.data.id;
            const cardDocRef = doc(cardsRef, cardId);
            await deleteDoc(cardDocRef);
        } catch (error) {
            console.error('Error deleting card: ', error);
        }
    }

    render() {
        return (
            <div className="card">
                <div className="card-body">
                    <p>{this.props.data.text}</p>
                    <span onClick={this.deleteCard}>&times;</span>
                </div>
            </div>
        );
    }
}

Card.propTypes = {
    data: PropTypes.object.isRequired
}

export default Card;
