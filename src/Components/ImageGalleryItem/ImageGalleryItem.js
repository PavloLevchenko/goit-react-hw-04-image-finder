import PropTypes from 'prop-types';
import s from './ImageGalleryItem.module.css';

const ImageGalleryItem = ({ id, previewURL, tags }) => (
  <li className={s.ImageGalleryItem}>
    <img src={previewURL} alt={tags} className={s.ImageGalleryItemImage} data-id={id} />
  </li>
);

ImageGalleryItem.propTypes = {
  id: PropTypes.number.isRequired,
  previewURL: PropTypes.string.isRequired,
  tags: PropTypes.string.isRequired,
};
export default ImageGalleryItem;
