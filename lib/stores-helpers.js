import fs from 'fs/promises';
import path from 'path';

export const getStores = async () => {
  const sourcePath = path.join(process.cwd(), 'data/', 'coffee-stores.json');
  const fileContent = await fs.readFile(sourcePath, 'utf-8');
  return JSON.parse(fileContent);
};

export const getStoresIds = async () =>
  (await getStores()).map((store) => store.id);

export const getStoreById = async (id) =>
  (await getStores()).find((store) => store.id === id);
