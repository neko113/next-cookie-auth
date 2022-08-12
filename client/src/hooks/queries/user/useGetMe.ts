import UserAPI from '@/lib/api/user';
import { ICustomAxiosError, IUser } from '@/lib/interfaces';
import { UseQueryOptions, useQuery } from '@tanstack/react-query';

const useGetME = (options?: UseQueryOptions<IUser, ICustomAxiosError>) => {
  return useQuery<IUser, ICustomAxiosError>(['me'], UserAPI.me, options);
};

useGetME.fetcher = () => UserAPI.me;
useGetME.getKey = () => ['me'];

export default useGetME;