import React from "react";
import PropTypes from 'prop-types';
import { cardsRef } from "../firebase";
import { doc, deleteDoc } from "firebase/firestore";
import EditCardModal from "./EditCardModal";

class Card extends React.Component {
    state = {
        modalOpen: false
    }

    toggleModal = () => {
        this.setState({ modalOpen: !this.state.modalOpen });
    }

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
            <React.Fragment>
                <div className="card">
                    <div className="card-labels">
                        {this.props.data.labels.map((label, index) => {
                            return <span key={index} style={{ background: label }} className="label"></span>;
                        })}
                    </div>
                    <div className="card-body">
                        <p onClick={this.toggleModal}>{this.props.data.text}</p>
                        <span onClick={this.deleteCard}>&times;</span>
                    </div>
                </div>
                <EditCardModal
                    modalOpen={this.state.modalOpen}
                    toggleModal={this.toggleModal}
                    cardData={this.props.data}
                />
            </React.Fragment>
        );
    }
}

Card.propTypes = {
    data: PropTypes.object.isRequired
}

export default Card;
