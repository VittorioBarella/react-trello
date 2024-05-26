import React, { useState, useEffect, useRef } from "react";
import List from './List';
import { db } from "../firebase";
import { useParams } from 'react-router-dom';
import { collection, query, where, orderBy, onSnapshot, addDoc, doc, getDoc, deleteDoc, updateDoc } from "firebase/firestore";
import PropTypes from 'prop-types';
import { AuthConsumer } from "./AuthContext";

const Board = ({ deleteBoard }) => {
    const [currentLists, setCurrentLists] = useState([]);
    const addBoardInput = useRef();
    const { boardId } = useParams();
    const [currentBoard, setCurrentBoard] = useState({});
    const [boardTitle, setBoardTitle] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        getBoard(boardId);
        getLists(boardId);
    }, [boardId]);

    const getBoard = async (boardId) => {
        try {
            const boardDoc = doc(db, "boards", boardId);
            const boardSnapshot = await getDoc(boardDoc);
            if (boardSnapshot.exists()) {
                const boardData = boardSnapshot.data();
                setCurrentBoard(boardData);
                setBoardTitle(boardData.title || "");
            } else {
                setMessage('Board not found...');
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
                            cards: doc.data().list.cards || [],
                        };
                        updatedLists.push(list);
                    }
                    if (change.type === 'removed') {
                        setCurrentLists(prevLists => prevLists.filter(list => list.id !== change.doc.id));
                    }
                });
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
                    cards: [],
                };

                setCurrentLists(prevLists => {
                    if (prevLists.some(existingList => existingList.id === listObj.id)) {
                        return prevLists;
                    }
                    return [...prevLists, listObj];
                });
            }
            addBoardInput.current.value = '';
        } catch (error) {
            console.error('Error creating a new list: ', error);
        }
    };

    const deleteList = async (listId) => {
        try {
            await deleteDoc(doc(db, 'lists', listId));
            setCurrentLists(prevLists => prevLists.filter(list => list.id !== listId));
        } catch (error) {
            console.error('Error deleting list: ', error);
        }
    };

    const handleDeleteBoard = async () => {
        try {
            await deleteBoard(boardId);
            setMessage('Board not found...');
        } catch (error) {
            console.error('Error deleting board:', error);
        }
    };

    const handleUpdateBoardTitle = async (e) => {
        const newTitle = e.target.value;
        setBoardTitle(newTitle);
        try {
            const boardDoc = doc(db, "boards", boardId);
            await updateDoc(boardDoc, { title: newTitle });
        } catch (error) {
            console.error('Error updating board title:', error);
        }
    };

    return (
        <AuthConsumer>
            {({ user }) => (
                <React.Fragment>
                    {user.id === currentBoard.user ? (
                        <div 
                            className="board-wrapper"
                            style={{
                                backgroundColor: currentBoard.background
                            }}
                        >
                            {message === '' ? (
                                <div className="board-header">
                                    <input
                                        type="text"
                                        value={boardTitle}
                                        onChange={handleUpdateBoardTitle}
                                    />
                                    <button onClick={handleDeleteBoard}>Delete board</button>
                                </div>
                            ) : (
                                <h2>{message}</h2>
                            )}
                            <div className="lists-wrapper">
                                {currentLists.map(list => (
                                    <List  
                                        key={list.id}
                                        list={list}
                                        deleteList={deleteList} 
                                    />
                                ))}
                            </div>
                            <form 
                                onSubmit={createNewList}
                                className="new-list-wrapper"
                            >
                                <input 
                                    type={message === '' ? 'text' : 'hidden'}  
                                    ref={addBoardInput}
                                    name="name"
                                    placeholder=" + New List"
                                />
                            </form>
                        </div>
                    ) : (
                        <span> </span>
                    )}
                </React.Fragment>
            )}
        </AuthConsumer>
    );
};

Board.propTypes = {
    deleteBoard: PropTypes.func.isRequired
};

export default Board;
