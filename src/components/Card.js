import React from "react"; // Importa a biblioteca React
import PropTypes from 'prop-types'; // Importa PropTypes para validação de tipos de propriedades
import { cardsRef } from "../firebase"; // Importa a referência para a coleção de cartões no Firestore
import { doc, deleteDoc } from "firebase/firestore"; // Importa funções do Firestore para manipulação de documentos
import EditCardModal from "./EditCardModal"; // Importa o componente de modal para editar cartão

class Card extends React.Component {
    state = {
        modalOpen: false // Estado inicial para controlar a abertura do modal
    }

    // Função para alternar a abertura do modal
    toggleModal = () => {
        this.setState({ modalOpen: !this.state.modalOpen });
    }

    // Função para deletar um cartão
    deleteCard = async e => {
        try {
            e.preventDefault(); // Previne o comportamento padrão do formulário
            const cardId = this.props.data.id; // Pega o ID do cartão a partir das props
            const cardDocRef = doc(cardsRef, cardId); // Referencia o documento do cartão no Firestore
            await deleteDoc(cardDocRef); // Deleta o documento do cartão no Firestore
        } catch (error) {
            console.error('Error deleting card: ', error); // Loga erros, se houver
        }
    }

    render() {
        return (
            <React.Fragment>
                <div className="card">
                    <div className="card-labels">
                        {this.props.data.labels.map((label, index) => {
                            return <span key={index} style={{ background: label }} className="label"></span>; // Renderiza os rótulos do cartão
                        })}
                    </div>
                    <div className="card-body">
                        <p onClick={this.toggleModal}>{this.props.data.text}</p>
                        <span onClick={this.deleteCard}>&times;</span>
                    </div>
                </div>
                <EditCardModal
                    modalOpen={this.state.modalOpen} // Passa o estado de abertura do modal como prop
                    toggleModal={this.toggleModal} // Passa a função para alternar o modal como prop
                    cardData={this.props.data} // Passa os dados do cartão como prop
                />
            </React.Fragment>
        );
    }
}

// Define os tipos esperados para as props do componente
Card.propTypes = {
    data: PropTypes.object.isRequired // A propriedade data é obrigatória e deve ser um objeto
}

export default Card; // Exporta o componente Card como padrão
