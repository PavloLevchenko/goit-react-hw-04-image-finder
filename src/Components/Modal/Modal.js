import React, { useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import s from './Modal.module.css';

const modalRoot = document.getElementById('modal-root');

const Modal = ({ children, toggleModal, showCloseBtn }) => {
  const escapeModal = useCallback(
    event => {
      const { key } = event;
      if (toggleModal && key === 'Escape') {
        toggleModal(event);
      }
    },
    [toggleModal],
  );

  useEffect(() => {
    if (toggleModal) {
      window.addEventListener('keydown', escapeModal);
      return () => {
        window.removeEventListener('keydown', escapeModal);
      };
    }
  }, [toggleModal, escapeModal]);

  const closeModal = event => {
    const { target, currentTarget } = event;
    if (toggleModal && target === currentTarget) {
      toggleModal(event);
    }
  };

  return createPortal(
    <div className={s.Overlay} onClick={closeModal}>
      <div className={s.Modal}>{children}</div>
      {toggleModal && showCloseBtn && (
        <button className={s.ModalBtn} onClick={toggleModal} type="button">
          Close
        </button>
      )}
    </div>,
    modalRoot,
  );
};

Modal.propTypes = {
  children: PropTypes.node,
  toggleModal: PropTypes.func,
  showCloseBtn: PropTypes.bool,
};

export default Modal;
