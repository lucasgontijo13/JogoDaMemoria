import React from 'react';
import './ConfirmModal.css';

function ConfirmModal({ isOpen, onClose, onConfirm, message }) {
  // Se não estiver aberto, não renderiza nada
  if (!isOpen) {
    return null;
  }

  return (
    // O fundo escurecido
    <div className="modal-overlay">
      <div className="modal-content">
        <p className="modal-message">{message}</p>
        <div className="modal-buttons">
          <button onClick={onConfirm} className="btn btn-yellow">Confirmar</button>
          <button onClick={onClose} className="btn btn-magenta">Cancelar</button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
