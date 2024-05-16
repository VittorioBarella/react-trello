import React from "react";
import Card from "./Card";
import PropTypes from 'prop-types'
import { cardsRef, addDoc } from "../firebase";

class List extends React.Component {
    state = {
        currentCards: []
    }

    nameInput = React.createRef()

    createNewCard = async (e) => {
        e.preventDefault();
        try {
            const cardText = this.nameInput.current.value.trim();
            if (!cardText) {
                return; // Retorna se o texto do cartão for vazio
            }
    
            const newCard = {
                text: cardText,
                listId: this.props.list.id,
                labels: [],
                createdAt: new Date()
            };
    
            await addDoc(cardsRef, newCard); // Adiciona o novo cartão ao Firestore
            this.setState(prevState => ({
                currentCards: [...prevState.currentCards, newCard]
            }));
    
            this.nameInput.current.value = ''; // Limpa o campo de entrada
            console.log('New card added:', newCard);
        } catch (error) {
            console.error('Error creating new card:', error);
        }
    }
    render() {
        const { list } = this.props;

        // Verifique se list é undefined ou null e atribua um objeto vazio se for
        if (!list) {
            console.log('List is undefined or null');
            return null; // Retorna nulo se list for undefined ou null
        }

        // Verifique se list.cards é undefined ou null e atribua um objeto vazio se for
        if (!list.cards) {
            console.log('List cards is undefined or null');
            return null; // Retorna nulo se list.cards for undefined ou null
        }

        // Use Object.keys(list.cards) para obter as chaves de list.cards, ou um array vazio se list.cards for undefined ou null
        const cardKeys = Object.keys(list.cards);

        return(
            <div className="list">   
                <div className="list-header">
                    <p>{list.title}</p>
                </div>
                {cardKeys.map(key => (
                    <Card 
                        key={key} 
                        data={list.cards[key]}
                    />
                ))}
                <form 
                    onSubmit={this.createNewCard} 
                    className="new-card-wrapper"
                >
                    <input
                        type="text"
                        ref={this.nameInput}
                        name="name"
                        placeholder=" + New card"
                    />
                </form>
            </div>
        )
    }
}

List.propTypes = {
    list: PropTypes.object.isRequired
}

export default List
