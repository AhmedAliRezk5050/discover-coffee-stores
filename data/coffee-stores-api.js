import { getCoffeeStoresImages } from './unsplash-api';

const getCoffeeStoresUrl = (
  apiUrl,
  location = { latitude: 51.5072, longitude: 0.1276 },
  radius,
  query,
  fields,
  limit,
) => {
  return `${apiUrl}?ll=${location.latitude},${location.longitude}&radius=${radius}&query=${query}&fields=${fields}&limit=${limit}`;
};

export const getCoffeeStores = async (location, limit = 6) => {
  let coffeeStores = [];
  const url = getCoffeeStoresUrl(
    'https://api.foursquare.com/v3/places/search',
    location,
    100000,
    'coffee',
    'fsq_id,rating,name,location,website',
    limit,
  );
  try {
    const reponse = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: process.env.NEXT_PUBLIC_FOURSQUARE_API_KEY,
      },
    });

    const jsonResponse = await reponse.json();
    coffeeStores = jsonResponse.results.map(
      ({ fsq_id, location, name, rating }) => ({
        id: fsq_id,
        name,
        rating,
        address: location.address,
        neighborhood: location.neighborhood
          ? location.neighborhood.join(', ')
          : '',
      }),
    );
  } catch (error) {
    console.log(error);
  }
  return coffeeStores;
};

export const getCoffeStoreById = async (id, location) =>
  (await getCoffeeStores(location)).find((coffeStore) => coffeStore.id === id);

export const getCoffeStoresIds = async (location) =>
  (await getCoffeeStores(location)).map((coffeStore) => coffeStore.id);

export const getCoffeeStoresWithImages = async (
  imgSize = 'small',
  location,
  limit = 6,
) => {
  const coffeStores = await getCoffeeStores(location, limit);
  const photos = await getCoffeeStoresImages(imgSize, coffeStores.length);
  return coffeStores.map((coffeStore, index) => {
    coffeStore.imgUrl = photos[index];
    return coffeStore;
  });
};

export const getCoffeStoreByIdWithImage = async (id, imgSize, location) => {
  return (await getCoffeeStoresWithImages(imgSize, location)).find(
    (coffeStore) => coffeStore.id === id,
  );
};
