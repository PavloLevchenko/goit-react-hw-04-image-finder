//код делает запрос на сервер и возвращает массив ссылок на изображения с описанием

// Импорт HTTP клиента
import axios from 'axios';

const FETCH_URL = 'https://pixabay.com/api/';
const API_KEY = '24909321-421e53eed99bbb069ae01ec93';

export default async function getImages(text, page = 1, limit = 12, onLoad, onFailture) {
  const params = {
    key: API_KEY,
    q: text,
    image_type: 'photo',
    orientation: 'horizontal',
    page: page,
    per_page: limit,
  };
  try {
    const response = await axios.get(FETCH_URL, { params });
    if (response.data.totalHits !== 0) {
      let totalPages = Math.trunc(response.data.totalHits / limit);
      if (response.data.totalHits % limit !== 0) {
        totalPages += 1;
      }
      onLoad(response.data.hits, totalPages);
    } else {
      onFailture('Sorry, there are no images matching your search query. Please try again.');
    }
  } catch (error) {
    onFailture(error.message);
  }
}
