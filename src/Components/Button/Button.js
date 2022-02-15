import PropTypes from 'prop-types';
import s from './Button.module.css';

const Button = ({ onClick, children }) => (
  <button className={s.Button} type="button" onClick={onClick}>
    {children}
  </button>
);

Button.propTypes = {
  onClick: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};
export default Button;
