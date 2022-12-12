import { useState, useCallback } from 'react';
import { AxiosError, AxiosResponse } from 'axios';

type NetworkRequest = (p?: any) => Promise<AxiosResponse>;

export default function useNetwork<T>(
  requestMethod: NetworkRequest
): [(p?: any) => Promise<T | AxiosError>, { data: T | null; error: AxiosError | null; loading: boolean }] {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AxiosError | null>(null);

  const execute: (p?: any) => Promise<T | AxiosError> = useCallback(
    async (p?: any) => {
      setLoading(true);
      let result: T | AxiosError;

      try {
        const response = await requestMethod(p);
        setData(response.data);
        result = response.data;
      } catch (e) {
        const axiosError = e as AxiosError;
        if (!axiosError.status) {
          axiosError.status = axiosError.response?.status;
        }
        setError(axiosError);
        result = axiosError;
      }

      setLoading(false);
      return result;
    },
    [requestMethod]
  );

  return [execute, { data, loading, error }];
}
