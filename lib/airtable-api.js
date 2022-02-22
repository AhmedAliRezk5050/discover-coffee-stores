import Airtable from 'airtable';

const base = Airtable.base(process.env.AIRTABLE_BASE_ID);

export const table = base('coffee-stores');

export const findRecordById = async (id) => {
  let fetchedRecord;

  const results = await table.select({
    filterByFormula: `id='${id}'`,
  });

  await results.eachPage(function page(records, fetchNextPage) {
    records.forEach(function (record) {
      fetchedRecord =
        record.fields.id === id
          ? { ...record.fields, airtable_id: record.id }
          : undefined;
    });

    fetchNextPage();
  });
  return fetchedRecord;
};

export const createRecord = async (
  id,
  name,
  address,
  neighborhood,
  imgUrl,
  voting,
) => {
  const records = await table.create([
    {
      fields: {
        id,
        name,
        address,
        neighborhood,
        imgUrl,
        voting,
      },
    },
  ]);

  let createdRecord;

  records.forEach(function (record) {
    createdRecord = record.fields;
  });

  return createdRecord;
};
