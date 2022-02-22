import { table, findRecordById } from '../../lib/airtable-api';

const upVoteCoffeeStoreById = async (req, res) => {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method is not allowed' });
  }

  const { id } = req.body;

  if (!id) {
    return res.status(404).json({ message: 'No id is provided' });
  }

  try {
    const pendingUpdateRecord = await findRecordById(id);

    if (!pendingUpdateRecord) {
      return res.status(400).json({ message: 'Id is not correct' });
    }
    const { voting, airtable_id } = pendingUpdateRecord;
    const [store] = await table.update([
      { id: airtable_id, fields: { voting: voting + 1 } },
    ]);

    return res
      .status(200)
      .json({ message: 'Store updated successfully', store: store.fields });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Error updating store' });
  }
};

export default upVoteCoffeeStoreById;
