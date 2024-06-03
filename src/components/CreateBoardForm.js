import React, { useState } from 'react'; // Importa a biblioteca React e o hook useState
import PropTypes from 'prop-types'; // Importa PropTypes para validação de tipos de propriedades
import { AuthConsumer } from './AuthContext'; // Importa o consumidor do contexto de autenticação
import { addDoc } from 'firebase/firestore'; // Importa a função addDoc do Firestore para adicionar documentos
import { boardsRef } from '../firebase'; // Importa a referência para a coleção de quadros no Firestore

const CreateBoardForm = ({ createNewBoard }) => {
  // Define estados locais para título e cor de fundo
  const [title, setTitle] = useState('');
  const [background, setBackground] = useState('#80ccff');

  // Função para lidar com o envio do formulário
  const handleSubmit = async (e, userId) => {
    e.preventDefault(); // Previne o comportamento padrão do formulário
    try {
      const newBoard = {
        title,
        background,
        createdAt: new Date(),
        user: userId // Associa o quadro ao usuário atual
      };
      
      // Adiciona o novo quadro ao Firestore
      await addDoc(boardsRef, { board: newBoard });
      createNewBoard(newBoard); // Chama a função passada via props para atualizar a lista de quadros
      setTitle(''); // Reseta o título do formulário
      setBackground('#80ccff'); // Reseta a cor de fundo do formulário
    } catch (error) {
      console.error('Error creating a new board: ', error); // Loga erros, se houver
    }
  };

  return (
    <AuthConsumer>
      {({ user }) => (
        <form 
          className='create-board-wrapper'
          onSubmit={(e) => handleSubmit(e, user.id)} // Chama handleSubmit ao enviar o formulário
        >
          <input 
            type='text'
            name="name"
            placeholder='Board name'
            value={title} // Define o valor do campo de título
            onChange={(e) => setTitle(e.target.value)} // Atualiza o estado title ao digitar
          />
          <select 
            name="background"
            value={background} // Define o valor do campo de cor de fundo
            onChange={(e) => setBackground(e.target.value)} // Atualiza o estado background ao selecionar uma opção
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

// Define os tipos esperados para as props do componente
CreateBoardForm.propTypes = { 
  createNewBoard: PropTypes.func.isRequired, // A função createNewBoard é obrigatória
};

export default CreateBoardForm; // Exporta o componente CreateBoardForm como padrão
