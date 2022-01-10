import React, { Component } from 'react';
import PropTypes from 'prop-types';
import s from './Searchbar.module.css';

class Searchbar extends Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
  };
  state = {
    searchQuery: '',
  };
  handleInputChange = event => {
    const { value, name } = event.currentTarget;
    this.setState({
      [name]: value,
    });
  };
  render() {
    const { onSubmit } = this.props;
    const { searchQuery } = this.state;
    return (
      <header
        onSubmit={event => {
          event.preventDefault();
          onSubmit(searchQuery);
        }}
        className={s.Searchbar}
      >
        <form className={s.SearchForm}>
          <button type="submit" className={s.SearchFormButton}>
            <span className={s.SearchFormButtonLabel}>Search</span>
          </button>

          <input
            className={s.SearchFormInput}
            onChange={this.handleInputChange}
            type="text"
            name="searchQuery"
            autoComplete="off"
            autoFocus
            placeholder="Search images and photos"
          />
        </form>
      </header>
    );
  }
}
export default Searchbar;
