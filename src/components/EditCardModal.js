import PropTypes from 'prop-types';
import React from "react";
import { cardsRef } from '../firebase';

class EditCardModal extends React.Component {
    state = {
        availableLabels: [
            "#80ccff",
            "#80ffaa",
            "#f94a1e",
            "#ffb3ff",
            "#bf00ff",
            "#ffad33",
        ],
        selectedLabels: []
    }

    componentDidMount() {
        this.setState({ selectedLabels: this.props.cardData.labels });
    }

    textInput = React.createRef();

    updateCard = async (e) => {
        try {
            e.preventDefault();
            const cardId = this.props.cardData.id;
            const newText = this.textInput.current.value;
            const labels = this.state.selectedLabels;
            const card = await cardsRef.doc(cardId);
            await card.update({
                'card.text': newText,
                'card.labels': labels
            });
            this.props.toggleModal();
        } catch (error) {
            console.error('Error updating card: ', error);
        }
    }

    setLabel = (label) => {
        const labels = [...this.state.selectedLabels];
        if (labels.includes(label)) {
            const newLabels = labels.filter((element) => element !== label);
            this.setState({ selectedLabels: newLabels });
        } else {
            labels.push(label);
            this.setState({ selectedLabels: labels });
        }
    }

    render() {
        return (
            <div 
                className="modal-wrapper"
                style={{ display: this.props.modalOpen ? 'block' : 'none'}}
            >
                <div className="modal-body">
                    <form onSubmit={this.updateCard}>
                        <div>
                            <span onClick={this.props.toggleModal} className="modal-close">&times;</span>
                            <p className="label-title">add / remove labels:</p>
                            {this.state.availableLabels.map((label, index) => {
                                return (
                                    <span 
                                        key={index}
                                        className="label" 
                                        onClick={() => this.setLabel(label)} 
                                        style={{ background: label }}
                                    ></span>
                                );
                            })}
                            <hr />
                        </div>
                        <div className="edit-area">
                            <span className="edit-icon">&#x270E;</span>
                            <textarea
                                className="textbox-edit"
                                defaultValue={this.props.cardData.text}
                                ref={this.textInput}
                            ></textarea>
                        </div>
                        <div>
                            <p className="label-title">labels:</p>
                            {this.state.selectedLabels.map((label, index) => {
                                return (
                                    <span 
                                        key={index}
                                        className="label" 
                                        style={{ background: label }}
                                    ></span>
                                );
                            })}
                        </div>
                        <button type="submit">Save changes</button>
                    </form>
                </div>
            </div>
        )
    }
}

EditCardModal.propTypes = {
    modalOpen: PropTypes.bool.isRequired,
    toggleModal: PropTypes.func.isRequired,
    cardData: PropTypes.object.isRequired,
}

export default EditCardModal;
