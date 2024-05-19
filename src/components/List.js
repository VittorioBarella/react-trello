import React, { useState, useEffect, useRef } from "react";
import Card from "./Card";
import PropTypes from 'prop-types';
import { addDoc, collection, query, where, orderBy, onSnapshot } from "firebase/firestore"; 
import { db } from "../firebase";
import { v4 as uuidv4 } from 'uuid'; 

const List = ({ list }) => {
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
                    const updatedCards = [];
                    snapshot.docChanges().forEach(change => {
                        const doc = change.doc;
                        const card = {
                            id: doc.id,
                            text: doc.data().text,
                            labels: doc.data().labels
                        };

                        if (change.type === 'added') {
                            updatedCards.push(card);
                        }
                        if (change.type === 'removed') {
                            setCurrentCards(prevCards => prevCards.filter(card => card.id !== change.doc.id));
                        }
                        if (change.type === 'modified') {
                            setCurrentCards(prevCards => prevCards.map(item => 
                                item.id === change.doc.id ? card : item
                            ));
                        }
                    });
                    if (updatedCards.length) {
                        setCurrentCards(prevCards => [...prevCards, ...updatedCards]);
                    }
                });

                return () => unsubscribe();
            } catch (error) {
            }
        };

        if (list) {
            fetchCards(list.id);
        }

        return () => setCurrentCards([]); 
    }, [list]);

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

            newCard.id = list.id ? list.id + '-' + uuidv4() : uuidv4();
    
            const docRef = await addDoc(collection(db, 'cards'), newCard); 
    
            setCurrentCards(prevCards => [...prevCards, newCard]);
    
            nameInput.current.value = ''; 
        } catch (error) {
        }
    };

    return (
        <div className="list">   
            <div className="list-header">
                <p>{list.title}</p>
            </div>
            {currentCards.map((card, index) => (
                <Card 
                    key={uuidv4()} 
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
    list: PropTypes.object.isRequired
}

export default List;
