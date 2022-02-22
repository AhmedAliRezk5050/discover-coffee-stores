import { getCoffeeStoresWithImages } from '../../data/coffee-stores-api';

const getCoffeeStoresByLocation = async (req, res) => {
  const { lat, long, limit } = req.query;
  let location;
  if (lat && long) {
    location = { latitude: lat, longitude: long };
  }

  try {
    const coffeeStores = await getCoffeeStoresWithImages(
      undefined,
      location,
      limit,
    );
    res.status(200).json({ message: 'fetched Ok', coffeeStores });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'fetched fail' });
  }
};

export default getCoffeeStoresByLocation;
