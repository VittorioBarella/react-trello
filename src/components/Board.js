import React, { useState, useEffect, useRef } from "react";
import List from './List';
import data from '../sampleData';
import { db, listsRef, addDoc } from "../firebase"; // Importar 'db'
import { useParams, useLocation } from 'react-router-dom';
import { doc, getDoc } from "firebase/firestore"; // Importar 'doc' e 'getDoc'

const Board = () => {
    const [currentLists, setCurrentLists] = useState([]);
    const addBoardInput = useRef();
    const { boardId } = useParams();
    const location = useLocation();
    const [currentBoard, setCurrentBoard] = useState({});

    useEffect(() => {
        getBoard(boardId);
        setCurrentLists(data.lists);
    }, [boardId]);

    const getBoard = async boardId => {
        try {   
            const boardDoc = doc(db, "boards", boardId); // Usar 'doc' com 'db'
            const boardSnapshot = await getDoc(boardDoc); // Usar 'getDoc'
            if (boardSnapshot.exists()) {
                setCurrentBoard(boardSnapshot.data());
            } else {
                console.log("Board does not exist!");
            }
        } catch (error) {
            console.log('Error getting board:', error);
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
                const newList = await addDoc(listsRef, list);
                const listObj = {
                    id: newList.id,
                    ...list
                };

                setCurrentLists([...currentLists, listObj]);
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
