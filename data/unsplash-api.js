import { createApi } from 'unsplash-js';

export const unsplashApi = createApi({
  accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY,
});

export const getCoffeeStoresImages = async (size, limit = 6) => {
  const result = await unsplashApi.search.getPhotos({
    query: 'cofee shop',
    page: 1,
    perPage: limit,
  });
  return result.response.results.map((r) => r.urls[size]);
};
