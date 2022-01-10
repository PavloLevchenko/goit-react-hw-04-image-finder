import React, { Component } from 'react';
import PropTypes from 'prop-types';
import s from './Button.module.css';

class Button extends Component {
  static propTypes = {
    onClick: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
  };

  render() {
    const { onClick, children } = this.props;
    return (
      <button className={s.Button} type="button" onClick={onClick}>
        {children}
      </button>
    );
  }
}
export default Button;
