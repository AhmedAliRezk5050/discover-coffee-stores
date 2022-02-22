import { useCallback, useEffect, useReducer } from 'react';
import { useStoresLocationContext } from '../context/stores-location-context';

const initialState = {
  coffeeStores: null,
  loading: false,
  error: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_START':
      return {
        coffeeStores: null,
        loading: true,
        error: null,
      };
    case 'FETCH_SUCCESS':
      return {
        coffeeStores: action.payload,
        loading: false,
        error: null,
      };
    case 'FETCH_FAILURE':
      return {
        coffeeStores: null,
        loading: false,
        error: action.payload,
      };
  }
};

const useFetchNearByCoffeeStores = () => {
  const [{ coffeeStores, loading, error }, dispatch] = useReducer(
    reducer,
    initialState,
  );
  const { dispatch: setNearBycoffeStores } = useStoresLocationContext();
  const fetchNearByCoffeeStores = useCallback(
    async (location, limit) => {
      const { latitude, longitude } = location;
      try {
        dispatch({ type: 'FETCH_START' });
        const response = await fetch(
          `/api/getCoffeeStoresByLocation?lat=${latitude}&long=${longitude}&limit=${limit}`,
        );
        const coffeeStores = (await response.json()).coffeeStores;
        dispatch({ type: 'FETCH_SUCCESS', payload: coffeeStores });
        setNearBycoffeStores({
          type: 'SET_NEAR_BY_COFFEE_STORES',
          payload: coffeeStores,
        });
      } catch (error) {
        dispatch({
          type: 'FETCH_FAILURE',
          payload: error.message || 'Fetching failed',
        });
      }
    },
    [setNearBycoffeStores],
  );

  return {
    nearByCoffeeStores: coffeeStores,
    loadingNearByCoffeeStores: loading,
    errorFetchingNearByCoffeeStores: error,
    fetchNearByCoffeeStores,
  };
};

export default useFetchNearByCoffeeStores;
