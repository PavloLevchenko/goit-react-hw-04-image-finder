import PropTypes from 'prop-types';
import s from './ImageGalleryItem.module.css';

const ImageGalleryItem = ({ openModal, previewURL, tags }) => (
  <li className={s.ImageGalleryItem}>
    <img src={previewURL} alt={tags} className={s.ImageGalleryItemImage} onClick={openModal} />
  </li>
);

ImageGalleryItem.propTypes = {
  openModal: PropTypes.func,
  previewURL: PropTypes.string.isRequired,
  tags: PropTypes.string.isRequired,
};
export default ImageGalleryItem;
