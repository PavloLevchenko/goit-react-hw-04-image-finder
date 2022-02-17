import PropTypes from 'prop-types';
import s from './ImageGallery.module.css';
import ImageGalleryItem from 'Components/ImageGalleryItem';

const ImageGallery = ({ images }) => (
  <ul className={s.ImageGallery}>
    {images.map(({ id, previewURL, tags }) => {
      return <ImageGalleryItem key={id} id={id} previewURL={previewURL} tags={tags} />;
    })}
  </ul>
);

ImageGallery.propTypes = {
  images: PropTypes.arrayOf(PropTypes.object),
};

export default ImageGallery;
