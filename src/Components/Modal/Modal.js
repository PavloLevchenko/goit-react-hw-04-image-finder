import React, { Component } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import s from './Modal.module.css';

const modalRoot = document.getElementById('modal-root');

class Modal extends Component {
  static propTypes = {
    children: PropTypes.node,
    toggleModal: PropTypes.func,
    showCloseBtn: PropTypes.bool,
  };

  componentDidMount() {
    window.addEventListener('keydown', this.escapeModal);
  }
  componentWillUnmount() {
    window.removeEventListener('keydown', this.escapeModal);
  }

  escapeModal = event => {
    const { key } = event;
    const { toggleModal } = this.props;
    if (toggleModal && key === 'Escape') {
      toggleModal(event);
    }
  };

  closeModal = event => {
    const { target, currentTarget } = event;
    const { toggleModal } = this.props;
    if (toggleModal && target === currentTarget) {
      toggleModal(event);
    }
  };

  render() {
    const { children, toggleModal, showCloseBtn } = this.props;

    return createPortal(
      <div className={s.Overlay} onClick={this.closeModal}>
        <div className={s.Modal}>{children}</div>
        {this.props.toggleModal && showCloseBtn && (
          <button className={s.ModalBtn} onClick={toggleModal} type="button">
            Close
          </button>
        )}
      </div>,
      modalRoot,
    );
  }
}
export default Modal;
