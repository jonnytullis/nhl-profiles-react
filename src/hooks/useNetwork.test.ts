import { renderHook, act } from '@testing-library/react';
import useNetwork from './useNetwork';

it('returns data on resolve', async () => {
  const successfulNetworkMethod = jest
    .fn()
    .mockImplementation(() => new Promise((resolve) => setTimeout(() => resolve({ data: 'data' }), 500)));
  const { result } = renderHook(() => useNetwork('success_key', successfulNetworkMethod));

  const [execute, { data, error, loading }] = result.current;
  expect(data).toBeNull();
  expect(error).toBeNull();
  expect(loading).toBeFalsy();

  await act(async () => {
    await execute();
  });

  const [execute2, { data: data2, error: error2, loading: loading2 }] = result.current;

  expect(data2).toEqual('data');
  expect(loading2).toBeFalsy();
  expect(error2).toBeNull();
});

it('returns error on reject', async () => {
  const successfulNetworkMethod = jest
    .fn()
    .mockImplementation(() => new Promise((resolve, reject) => setTimeout(() => reject({ message: 'message' }), 500)));
  const { result } = renderHook(() => useNetwork('success_key', successfulNetworkMethod));

  const [execute, { data, error, loading }] = result.current;
  expect(data).toBeNull();
  expect(error).toBeNull();
  expect(loading).toBeFalsy();

  await act(async () => {
    await execute();
  });

  const [execute2, { data: data2, error: error2, loading: loading2 }] = result.current;

  expect(data2).toBeNull();
  expect(loading2).toBeFalsy();
  expect(error2).toEqual({ message: 'message' });
});

it('sets loading while awaiting', async () => {
  const successfulNetworkMethod = jest
    .fn()
    .mockImplementation(() => new Promise((resolve) => setTimeout(() => resolve({ data: 'data' }), 2000)));
  const { result } = renderHook(() => useNetwork('success_key', successfulNetworkMethod));

  const [execute, { data, error, loading }] = result.current;
  expect(data).toBeNull();
  expect(error).toBeNull();
  expect(loading).toBeFalsy();

  await act(async () => {
    execute();
    await new Promise((resolve) => setTimeout(resolve, 500)); // Only wait part of the time
  });

  const [execute2, { data: data2, error: error2, loading: loading2 }] = result.current;
  expect(data2).toBeNull();
  expect(loading2).toBeTruthy();
  expect(error2).toBeNull();
});
