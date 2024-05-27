import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { AuthConsumer } from './AuthContext';
import { addDoc } from 'firebase/firestore';
import { boardsRef } from '../firebase';

const CreateBoardForm = ({ createNewBoard }) => {
  const [title, setTitle] = useState('');
  const [background, setBackground] = useState('#80ccff');

  const handleSubmit = async (e, userId) => {
    e.preventDefault();
    try {
      const newBoard = {
        title,
        background,
        createdAt: new Date(),
        user: userId
      };
      
      await addDoc(boardsRef, { board: newBoard });
      createNewBoard(newBoard);
      setTitle('');
      setBackground('#80ccff');
    } catch (error) {
      console.error('Error creating a new board: ', error);
    }
  };

  return (
    <AuthConsumer>
      {({ user }) => (
        <form 
          className='create-board-wrapper'
          onSubmit={(e) => handleSubmit(e, user.id)}
        >
          <input 
            type='text'
            name="name"
            placeholder='Board name'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <select 
            name="background"
            value={background}
            onChange={(e) => setBackground(e.target.value)}
          >
            <option value="#80ccff">Blue</option>
            <option value="#80ffaa">Green</option>
            <option value="#f94a1e">Red</option>
            <option value="#ffb3ff">Pink</option>
            <option value="#bf00ff">Purple</option>
            <option value="#ffad33">Orange</option>
          </select>
          <button type='submit'>Create new board</button>
        </form>
      )}
    </AuthConsumer>
  );
};

CreateBoardForm.propTypes = { 
  createNewBoard: PropTypes.func.isRequired,
};

export default CreateBoardForm;
