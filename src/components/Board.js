import React, { useState, useEffect, useRef } from "react"; // Importa React e os hooks useState, useEffect, useRef
import List from './List'; // Importa o componente List
import { db } from "../firebase"; // Importa a configuração do Firebase
import { useParams } from 'react-router-dom'; // Importa hook para pegar parâmetros da URL
import { collection, query, where, orderBy, onSnapshot, addDoc, doc, getDoc, deleteDoc, updateDoc } from "firebase/firestore"; // Importa funções do Firestore
import PropTypes from 'prop-types'; // Importa PropTypes para validação de tipos de propriedades
import { AuthConsumer } from "./AuthContext"; // Importa o consumidor do contexto de autenticação

const Board = ({ deleteBoard }) => {
    const [currentLists, setCurrentLists] = useState([]); // Estado para armazenar as listas atuais
    const addBoardInput = useRef(); // useRef para referenciar o input de adicionar lista
    const { boardId } = useParams(); // Pega o parâmetro boardId da URL
    const [currentBoard, setCurrentBoard] = useState({}); // Estado para armazenar o quadro atual
    const [boardTitle, setBoardTitle] = useState(""); // Estado para armazenar o título do quadro
    const [message, setMessage] = useState(""); // Estado para mensagens

    // useEffect para buscar dados do quadro e listas quando o boardId muda
    useEffect(() => {
        console.log("Fetching board...");
        getBoard(boardId);
        getLists(boardId);
    }, [boardId]);

    // Função para buscar dados do quadro
    const getBoard = async (boardId) => {
        try {
            console.log("Getting board data for boardId:", boardId); // Log para verificar boardId
            const boardDoc = doc(db, "boards", boardId);
            const boardSnapshot = await getDoc(boardDoc);
            if (boardSnapshot.exists()) {
                const boardData = boardSnapshot.data();
                console.log("Board data:", boardData);
                setCurrentBoard(boardData);
                setBoardTitle(boardData.title || "");
            } else {
                console.log("Board not found for boardId:", boardId); // Log adicional
                setMessage('Board not found...');
            }
        } catch (error) {
            console.log('Error getting board:', error);
        }
    };

    // Função para buscar listas do quadro
    const getLists = async (boardId) => {
        try {
            console.log("Fetching lists for boardId:", boardId); // Log adicional
            const listsQuery = query(
                collection(db, 'lists'),
                where('list.board', '==', boardId),
                orderBy('list.createdAt')
            );

            // Escuta para mudanças em tempo real nas listas
            onSnapshot(listsQuery, (snapshot) => {
                console.log("Snapshot size:", snapshot.size); // Log adicional

                if (snapshot.empty) {
                    console.log("No lists found for boardId:", boardId);
                }

                const updatedLists = [];

                snapshot.docChanges().forEach(change => {
                    console.log("Document change type:", change.type); // Log adicional
                    console.log("Document data:", change.doc.data()); // Log adicional

                    if (change.type === 'added') {
                        const docData = change.doc.data();
                        const list = {
                            id: change.doc.id,
                            title: docData.list.title,
                            cards: docData.list.cards || [],
                        };
                        updatedLists.push(list);
                    }
                    if (change.type === 'removed') {
                        setCurrentLists(prevLists => prevLists.filter(list => list.id !== change.doc.id));
                    }
                });

                console.log("Updated lists after processing changes:", updatedLists); // Log adicional

                if (updatedLists.length) {
                    setCurrentLists(prevLists => {
                        const newListIds = updatedLists.map(list => list.id);
                        const filteredPrevLists = prevLists.filter(list => !newListIds.includes(list.id));
                        return [...filteredPrevLists, ...updatedLists];
                    });
                } else {
                    setCurrentLists([]);
                }
            });
        } catch (error) {
            console.error('Error fetching lists: ', error);
        }
    };

    // Função para criar uma nova lista
    const createNewList = async (e, userId) => {
        e.preventDefault(); // Previne o comportamento padrão do formulário
        const list = {
            title: addBoardInput.current.value,
            board: boardId,
            createdAt: new Date(),
            user: userId
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

    // Função para deletar uma lista
    const deleteList = async (listId) => {
        try {
            await deleteDoc(doc(db, 'lists', listId));
            setCurrentLists(prevLists => prevLists.filter(list => list.id !== listId));
        } catch (error) {
            console.error('Error deleting list: ', error);
        }
    };

    // Função para deletar o quadro
    const handleDeleteBoard = async () => {
        try {
            await deleteBoard(boardId);
            setMessage('Board not found...');
        } catch (error) {
            console.error('Error deleting board:', error);
        }
    };

    // Função para atualizar o título do quadro
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
                                onSubmit={(e) => createNewList(e, user.id)}
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

// Define os tipos esperados para as props do componente
Board.propTypes = {
    deleteBoard: PropTypes.func.isRequired // deleteBoard deve ser uma função e é obrigatória
};

export default Board; // Exporta o componente Board como padrão
