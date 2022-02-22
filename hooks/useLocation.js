import { useReducer, useState } from 'react';
import { useStoresLocationContext } from '../context/stores-location-context';

const initialState = {
  location: null,
  loading: false,
  error: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_START':
      return {
        location: null,
        loading: true,
        error: null,
      };
    case 'FETCH_SUCCESS':
      return {
        location: action.payload,
        loading: false,
        error: null,
      };
    case 'FETCH_FAILURE':
      return {
        location: null,
        loading: false,
        error: action.payload,
      };
  }
};

const useLocation = () => {
  const [{ location, loading, error }, dispatch] = useReducer(
    reducer,
    initialState,
  );
  const { dispatch: setLocation } = useStoresLocationContext();
  const getLocation = () => {
    const onSuccess = (position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      dispatch({
        type: 'FETCH_SUCCESS',
        payload: { latitude, longitude },
      });

      setLocation({ type: 'SET_LOCATION', payload: { latitude, longitude } });
    };

    const onError = () => {
      dispatch({
        type: 'FETCH_FAILURE',
        payload: 'Unable to retrieve your location',
      });
    };

    if (!navigator.geolocation) {
      dispatch({
        type: 'FETCH_FAILURE',
        payload: 'Geolocation is not supported by your browser',
      });
    } else {
      dispatch({
        type: 'FETCH_START',
      });
      navigator.geolocation.getCurrentPosition(onSuccess, onError);
    }
  };

  return { location, loading, error, getLocation };
};

export default useLocation;
