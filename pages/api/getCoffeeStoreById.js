import { findRecordById } from '../../lib/airtable-api';

const getCoffeeStoreById = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method is not allowed' });
  }

  const { id } = req.query;

  if (!id) {
    return res.status(404).json({ message: 'No id provided' });
  }

  try {
    const store = await findRecordById(id);
    if (!store) {
      return res
        .status(404)
        .json({ message: 'No store found matching the provided id' });
    }
    return res
      .status(200)
      .json({ message: 'Store is fetched successfully', store });
  } catch (error) {
    return res.status(500).json({ message: 'Fetching store failed' });
  }
};

export default getCoffeeStoreById;
