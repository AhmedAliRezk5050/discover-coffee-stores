import { createContext, useContext, useReducer } from 'react';

const StoresLocationContext = createContext();

const initialState = {
  location: null,
  nearByCoffeeStores: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOCATION':
      return { ...state, location: action.payload };
    case 'SET_NEAR_BY_COFFEE_STORES':
      return { ...state, nearByCoffeeStores: action.payload };
    default:
      return state;
  }
};

const StoresLocationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <StoresLocationContext.Provider value={{ state, dispatch }}>
      {children}
    </StoresLocationContext.Provider>
  );
};

export default StoresLocationProvider;

export const useStoresLocationContext = () => {
  return useContext(StoresLocationContext);
};
