import { useContext } from 'react';
import AlertContext, { AlertContextState } from '../contexts/AlertContext';

export default function useAlert(): AlertContextState {
  return useContext(AlertContext);
}
