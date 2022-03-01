import PropTypes from 'prop-types';
import s from './ImageGallery.module.css';
import ImageGalleryItem from 'Components/ImageGalleryItem';

const ImageGallery = ({ images, openModal }) => (
  <ul className={s.ImageGallery}>
    {images.map(({ id, previewURL, tags }) => {
      return (
        <ImageGalleryItem
          key={id}
          previewURL={previewURL}
          tags={tags}
          onClick={() => openModal(id)}
        />
      );
    })}
  </ul>
);

ImageGallery.propTypes = {
  images: PropTypes.arrayOf(PropTypes.object),
  openModal: PropTypes.func,
};

export default ImageGallery;
