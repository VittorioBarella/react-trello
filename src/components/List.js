import React, { useState, useEffect, useRef } from "react";
import Card from "./Card";
import PropTypes from 'prop-types';
import { addDoc, collection, query, where, orderBy, onSnapshot, getDocs, deleteDoc, doc } from "firebase/firestore";
import { cardsRef, db  } from "../firebase";


const List = ({ list, deleteList }) => {
    const [currentCards, setCurrentCards] = useState([]);
    const nameInput = useRef();

    useEffect(() => {
        const fetchCards = async (listId) => {
            try {
                const cardsQuery = query(
                    collection(db, 'cards'),
                    where('listId', '==', listId), 
                    orderBy('createdAt')
                );

                const unsubscribe = onSnapshot(cardsQuery, (snapshot) => {
                    const addedCards = [];
                    const modifiedCards = [];
                    const removedCards = [];

                    snapshot.docChanges().forEach(change => {
                        const doc = change.doc;
                        const card = {
                            id: doc.id,
                            text: doc.data().text,
                            labels: doc.data().labels
                        };

                        if (change.type === 'added') {
                            addedCards.push(card);
                        } else if (change.type === 'removed') {
                            removedCards.push(doc.id);
                        } else if (change.type === 'modified') {
                            modifiedCards.push(card);
                        }
                    });

                    setCurrentCards(prevCards => {
                        let newCards = prevCards.filter(card => !removedCards.includes(card.id));
                        newCards = newCards.map(card => 
                            modifiedCards.find(modCard => modCard.id === card.id) || card
                        );
                        newCards = [...newCards, ...addedCards.filter(card => 
                            !newCards.some(existingCard => existingCard.id === card.id)
                        )];
                        return newCards;
                    });
                });

                return () => unsubscribe();
            } catch (error) {
                console.error("Error fetching cards: ", error);
            }
        };

        if (list) {
            fetchCards(list.id);
        }

        return () => setCurrentCards([]); 
    }, [list]);

// Função handleDeleteList
const handleDeleteList = async () => {
    try {
        const listId = list.id;
        const cardsSnapshot = await getDocs(query(cardsRef, where('listId', '==', listId))); // Usando getDocs ao invés de cardsRef.where
        if (cardsSnapshot.docs.length !== 0) {
            cardsSnapshot.forEach(card => {
                deleteDoc(card.ref); // Usando deleteDoc para excluir documento
            });
        }
        await deleteDoc(doc(db, 'lists', listId)); // Usando deleteDoc para excluir lista
    } catch(error) {
        console.error('Error deleting list: ', error);
    }            
};

    const createNewCard = async (e) => {
        e.preventDefault();
        try {
            const cardText = nameInput.current.value.trim();
            if (!cardText) {
                return;
            }
    
            const newCard = {
                text: cardText,
                listId: list.id,
                labels: [],
                createdAt: new Date()
            };

            const docRef = await addDoc(collection(db, 'cards'), newCard); 
    
            setCurrentCards(prevCards => {
                if (!prevCards.some(card => card.id === docRef.id)) {
                    return [...prevCards, { ...newCard, id: docRef.id }];
                }
                return prevCards;
            });
    
            nameInput.current.value = ''; 
        } catch (error) {
            console.error("Error creating card: ", error);
        }
    };

    const updateList = async (e) => {
        try {
            const newTitle = e.currentTarget.value;
            await db.collection('lists').doc(list.id).update({ title: newTitle });
        } catch (error) {
            console.error("Error updating list: ", error);
        }
    };

    return (
        <div className="list">   
            <div className="list-header">
                <input
                    type="text"
                    name="listTitle"
                    onChange={updateList}
                    defaultValue={list.title}
                />
                <span onClick={handleDeleteList}>&times;</span>
            </div>
            {currentCards.map((card) => (
                <Card 
                    key={card.id} 
                    data={card}
                />
            ))}
            <form 
                onSubmit={createNewCard} 
                className="new-card-wrapper"
            >
                <input
                    type="text"
                    ref={nameInput}
                    name="name"
                    placeholder=" + New card"
                />
            </form>
        </div>
    );
}

List.propTypes = {
    list: PropTypes.object.isRequired,
    deleteList: PropTypes.func.isRequired
}

export default List;
