import React, { useState, useEffect, useRef } from "react";
import Card from "./Card";
import PropTypes from 'prop-types';
import { addDoc, collection, query, where, orderBy, onSnapshot, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { cardsRef, db } from "../firebase";
import { AuthConsumer } from "./AuthContext";

const List = ({ list, deleteList }) => {
    const [currentCards, setCurrentCards] = useState([]);
    const [listTitle, setListTitle] = useState(list.title); 
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

    useEffect(() => {
        const unsubscribe = onSnapshot(doc(db, "lists", list.id), (doc) => {
            if (doc.exists()) {
                setListTitle(doc.data().title);
            }
        });

        return () => unsubscribe();
    }, [list.id]);

    const handleDeleteList = async () => {
        try {
            const listId = list.id;
            const cardsSnapshot = await getDocs(query(cardsRef, where('listId', '==', listId)));
            if (cardsSnapshot.docs.length !== 0) {
                cardsSnapshot.forEach(card => {
                    deleteDoc(card.ref);
                });
            }
            await deleteDoc(doc(db, 'lists', listId));
        } catch (error) {
            console.error('Error deleting list: ', error);
        }
    };

    const createNewCard = async (e, userId) => {
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
                createdAt: new Date(),
                user: userId
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
            setListTitle(newTitle);
            const listDoc = doc(db, 'lists', list.id);
            await updateDoc(listDoc, { title: newTitle });
        } catch (error) {
            console.error("Error updating list: ", error);
        }
    };

    return (
        <AuthConsumer>
            {({ user }) => (
                <div className="list">
                    <div className="list-header">
                        <input
                            type="text"
                            name="listTitle"
                            value={listTitle} 
                            onChange={updateList}
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
                        onSubmit={(e) => createNewCard(e, user.id)} 
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
            )}
        </AuthConsumer>
        
    );
}

List.propTypes = {
    list: PropTypes.object.isRequired,
    deleteList: PropTypes.func.isRequired
}

export default List;
