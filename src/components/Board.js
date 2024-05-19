import React, { useState, useEffect, useRef } from "react";
import List from './List';
import { db } from "../firebase";
import { useParams } from 'react-router-dom';
import { collection, query, where, orderBy, onSnapshot, addDoc, doc, getDoc } from "firebase/firestore"; // Importar os métodos necessários

const Board = () => {
    const [currentLists, setCurrentLists] = useState([]);
    const addBoardInput = useRef();
    const { boardId } = useParams();
    const [currentBoard, setCurrentBoard] = useState({});

    useEffect(() => {
        getBoard(boardId);
        getLists(boardId);
    }, [boardId]);

    const getBoard = async (boardId) => {
        try {   
            const boardDoc = doc(db, "boards", boardId); 
            const boardSnapshot = await getDoc(boardDoc); 
            if (boardSnapshot.exists()) {
                setCurrentBoard(boardSnapshot.data());
            } else {
                console.log("Board does not exist!");
            }
        } catch (error) {
            console.log('Error getting board:', error);
        }
    };

    const getLists = async (boardId) => {
        try {
            const listsQuery = query(
                collection(db, 'lists'),
                where('list.board', '==', boardId),
                orderBy('list.createdAt')
            );

            onSnapshot(listsQuery, (snapshot) => {
                const updatedLists = [];
                snapshot.docChanges().forEach(change => {
                    if (change.type === 'added') {
                        const doc = change.doc;
                        const list = {
                            id: doc.id,
                            title: doc.data().list.title,
                            cards: doc.data().list.cards || [], // Inicializar com um array vazio se cards não existir
                        };
                        updatedLists.push(list);
                    }
                    if (change.type === 'removed') {
                        setCurrentLists(prevLists => prevLists.filter(list => list.id !== change.doc.id));
                    }
                });
                // Atualizar a lista de uma vez para evitar duplicações
                if (updatedLists.length) {
                    setCurrentLists(prevLists => {
                        const newListIds = updatedLists.map(list => list.id);
                        const filteredPrevLists = prevLists.filter(list => !newListIds.includes(list.id));
                        return [...filteredPrevLists, ...updatedLists];
                    });
                }
            });
        } catch (error) {
            console.error('Error fetching lists: ', error);
        }
    };

    const createNewList = async (e) => {
        e.preventDefault();
        const list = {
            title: addBoardInput.current.value,
            board: boardId,
            createdAt: new Date(),
        };

        try {
            if (list.title && list.board) {
                const newList = await addDoc(collection(db, 'lists'), { list });
                const listObj = {
                    id: newList.id,
                    title: list.title,
                    cards: [], // Inicializar com um array vazio
                };

                // Verificar se a lista já existe antes de adicionar
                setCurrentLists(prevLists => {
                    if (prevLists.some(existingList => existingList.id === listObj.id)) {
                        return prevLists; // Evitar duplicação
                    }
                    return [...prevLists, listObj];
                });
            }
            addBoardInput.current.value = '';
        } catch (error) {
            console.error('Error creating a new list: ', error);
        }
    };

    return (
        <div 
            className="board-wrapper"
            style={{
                backgroundColor: currentBoard.background
            }}
        >
            <div className="board-header">
                <h3>{currentBoard.title}</h3>
                <button>Delete board</button>
            </div>
            <div className="lists-wrapper">
                {currentLists.map(list => (
                    <List  
                        key={list.id}
                        list={list}
                    />
                ))}
            </div>
            <form 
                onSubmit={createNewList}
                className="new-list-wrapper"
            >
                <input 
                    type="text"
                    ref={addBoardInput}
                    name="name"
                    placeholder=" + New List"
                />
            </form>
        </div>
    );
};

export default Board;
