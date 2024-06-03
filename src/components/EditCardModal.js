import PropTypes from 'prop-types'; // Importa PropTypes para validação de tipos de propriedades
import React from "react"; // Importa a biblioteca React
import { cardsRef } from '../firebase'; // Importa a referência para a coleção de cartões no Firestore
import { doc, updateDoc } from "firebase/firestore"; // Importa funções do Firestore para manipulação de documentos

class EditCardModal extends React.Component {
    state = {
        availableLabels: [
            "#80ccff",
            "#80ffaa",
            "#f94a1e",
            "#ffb3ff",
            "#bf00ff",
            "#ffad33",
        ], // Lista de rótulos disponíveis
        selectedLabels: [] // Rótulos selecionados inicialmente vazios
    }

    componentDidMount() {
        // Define os rótulos selecionados com base nas props ao montar o componente
        this.setState({ selectedLabels: this.props.cardData.labels });
    }

    // Cria uma referência para o input de texto
    textInput = React.createRef();

    // Função para atualizar o cartão
    updateCard = async (e) => {
        try {
            e.preventDefault(); // Previne o comportamento padrão do formulário
            const cardId = this.props.cardData.id; // Obtém o ID do cartão das props
            const newText = this.textInput.current.value; // Obtém o novo texto do input
            const labels = this.state.selectedLabels; // Obtém os rótulos selecionados do estado
            const cardDocRef = doc(cardsRef, cardId); // Referencia o documento do cartão no Firestore
            await updateDoc(cardDocRef, {
                'text': newText, 
                'labels': labels
            }); // Atualiza o documento do cartão no Firestore
            this.props.toggleModal(); // Fecha o modal após atualização
        } catch (error) {
            console.error('Error updating card: ', error); // Loga erros, se houver
        }
    }

    // Função para definir rótulos (adicionar ou remover)
    setLabel = (label) => {
        const labels = [...this.state.selectedLabels];
        if (labels.includes(label)) {
            const newLabels = labels.filter((element) => element !== label);
            this.setState({ selectedLabels: newLabels });
        } else {
            labels.push(label);
            this.setState({ selectedLabels: labels });
        }
    }

    render() {
        return (
            <div 
                className="modal-wrapper"
                style={{ display: this.props.modalOpen ? 'block' : 'none'}} // Define se o modal está visível
            >
                <div className="modal-body">
                    <form onSubmit={this.updateCard}>
                        <div>
                            <span onClick={this.props.toggleModal} className="modal-close">&times;</span> {/* Botão para fechar o modal */}
                            <p className="label-title">add / remove labels:</p> {/* Título para adição/remoção de rótulos */}
                            {this.state.availableLabels.map((label, index) => {
                                return (
                                    <span 
                                        key={index}
                                        className="label" 
                                        onClick={() => this.setLabel(label)} 
                                        style={{ background: label }} // Mostra os rótulos disponíveis
                                    ></span>
                                );
                            })}
                            <hr />
                        </div>
                        <div className="edit-area">
                            <span className="edit-icon">&#x270E;</span> {/* Ícone de edição */}
                            <textarea
                                className="textbox-edit"
                                defaultValue={this.props.cardData.text} // Texto do cartão a ser editado
                                ref={this.textInput} // Referência ao textarea
                            ></textarea>
                        </div>
                        <div>
                            <p className="label-title">labels:</p> {/* Título para rótulos selecionados */}
                            {this.state.selectedLabels.map((label, index) => {
                                return (
                                    <span 
                                        key={index}
                                        className="label" 
                                        style={{ background: label }} // Mostra os rótulos selecionados
                                    ></span>
                                );
                            })}
                        </div>
                        <button type="submit">Save changes</button> {/* Botão para salvar as alterações */}
                    </form>
                </div>
            </div>
        )
    }
}

// Define os tipos esperados para as props do componente
EditCardModal.propTypes = {
    modalOpen: PropTypes.bool.isRequired, // O modalOpen é obrigatório e deve ser um booleano
    toggleModal: PropTypes.func.isRequired, // A função toggleModal é obrigatória
    cardData: PropTypes.object.isRequired, // A propriedade cardData é obrigatória e deve ser um objeto
}

export default EditCardModal; // Exporta o componente EditCardModal como padrão
