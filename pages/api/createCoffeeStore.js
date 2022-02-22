import { createRecord, findRecordById, table } from '../../lib/airtable-api';

const createCoffeeStore = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(400).json({ message: 'request method must be post' });
  }
  const { id, name, address, neighborhood, imgUrl, voting } = req.body;

  if (!id || !name) {
    return res.status(400).json({ message: 'missing fields' });
  }

  try {
    const store = await findRecordById(id);

    if (store) {
      return res.status(200).json({ message: 'store already exists', store });
    }

    const createdRecord = await createRecord(
      id,
      name,
      address,
      neighborhood,
      imgUrl,
      voting,
    );

    res.status(201).json({ message: 'created', store: createdRecord });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'failed' });
  }
};

export default createCoffeeStore;
