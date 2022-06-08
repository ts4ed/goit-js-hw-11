import axios from "axios";
const BASE_URL = 'https://pixabay.com/api/'
const key = 'key=27923124-abae4833d2be49fca3c02a38e';
const paramas = 'image_type=photo&orientation=horizontal&safesearch=true';
export async function fetchImages(name) {
  try {
    let page = 1;
    let limit = 40;

    const params = new URLSearchParams({
      page: page,
      per_page: limit,
    });

    const url = `${BASE_URL}?${key}&q=${name}&${params}&${paramas}`;

    const response = await axios.get(url);
    const responseFormat = await response.data;
    page += 1;
    return responseFormat;
  } catch (error) {
      console.error(error);
    }
}