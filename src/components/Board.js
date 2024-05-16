import React, { useState, useEffect, useRef } from "react";
import List from './List';
import data from '../sampleData';
import { listsRef, addDoc } from "../firebase";
import { useParams, useLocation } from 'react-router-dom';

const Board = () => {
    const [currentLists, setCurrentLists] = useState([]);
    const addBoardInput = useRef();
    const { boardId } = useParams();
    const location = useLocation();

    useEffect(() => {
        setCurrentLists(data.lists);
    }, []);

    const createNewList = async (e) => {
        e.preventDefault();
        const list = {
            title: addBoardInput.current.value,
            board: boardId,
            createdAt: new Date(),
        };

        try {
            if (list.title && list.board) {
                const newList = await addDoc(listsRef, list); // Use addDoc para adicionar um novo documento
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
                backgroundColor: location.state.background
            }}
        >
            <div className="board-header">
                <h3>{location.state.title}</h3>
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
