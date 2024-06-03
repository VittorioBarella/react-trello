import React, { useState, useEffect, useRef } from "react";
import Card from "./Card";
import PropTypes from 'prop-types';
import { addDoc, collection, query, where, orderBy, onSnapshot, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { cardsRef, db } from "../firebase"; // Importa referências de Firebase
import { AuthConsumer } from "./AuthContext"; // Importa AuthConsumer para consumir o contexto de autenticação

const List = ({ list, deleteList }) => {
    const [currentCards, setCurrentCards] = useState([]); // Estado para armazenar os cartões atuais
    const [listTitle, setListTitle] = useState(list.title); // Estado para armazenar o título da lista
    const nameInput = useRef(); // Referência para o campo de entrada do nome do cartão

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

                return () => unsubscribe(); // Desinscreve do snapshot quando o componente desmonta
            } catch (error) {
                console.error("Error fetching cards: ", error); // Log de erro
            }
        };

        if (list) {
            fetchCards(list.id); // Busca cartões quando a lista é definida
        }

        return () => setCurrentCards([]); // Limpa cartões quando a lista muda
    }, [list]);

    useEffect(() => {
        const unsubscribe = onSnapshot(doc(db, "lists", list.id), (doc) => {
            if (doc.exists()) {
                setListTitle(doc.data().title); // Atualiza o título da lista quando há mudanças no documento
            }
        });

        return () => unsubscribe(); // Desinscreve do snapshot quando o componente desmonta
    }, [list.id]);

    const handleDeleteList = async () => {
        try {
            const listId = list.id;
            const cardsSnapshot = await getDocs(query(cardsRef, where('listId', '==', listId)));
            if (cardsSnapshot.docs.length !== 0) {
                cardsSnapshot.forEach(card => {
                    deleteDoc(card.ref); // Exclui cada cartão associado à lista
                });
            }
            await deleteDoc(doc(db, 'lists', listId)); // Exclui a lista
        } catch (error) {
            console.error('Error deleting list: ', error); // Log de erro
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

            nameInput.current.value = ''; // Limpa o campo de entrada após a criação do cartão
        } catch (error) {
            console.error("Error creating card: ", error); // Log de erro
        }
    };

    const updateList = async (e) => {
        try {
            const newTitle = e.currentTarget.value;
            setListTitle(newTitle);
            const listDoc = doc(db, 'lists', list.id);
            await updateDoc(listDoc, { title: newTitle }); // Atualiza o título da lista no Firestore
        } catch (error) {
            console.error("Error updating list: ", error); // Log de erro
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
                            onChange={updateList} // Atualiza o título da lista
                        />
                        <span onClick={handleDeleteList}>&times;</span> {/* Botão de excluir lista */}
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
    list: PropTypes.object.isRequired, // Validação de tipo para a lista
    deleteList: PropTypes.func.isRequired // Validação de tipo para a função de deletar lista
}

export default List; // Exporta o componente List como padrão
