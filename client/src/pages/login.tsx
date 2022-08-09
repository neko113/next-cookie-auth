import { GetServerSideProps, GetServerSidePropsResult, NextPage } from 'next';
import Router from 'next/router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import useLogin from '@/libs/hooks/queries/auth/useLogin';
import useGetME from '@/libs/hooks/queries/user/useGetMe';
import { DehydratedState, QueryClient, dehydrate } from '@tanstack/react-query';
import TextInput from '@/components/common/TextInput/TextInput';
import Button from '@/components/common/Button/Button';
import ErrorMessage from '@/components/common/ErrorMessage/ErrorMessage';

interface IFormInput {
  username: string;
  password: string;
}

const schema = yup.object().shape({
  username: yup.string().required('필수항목입니다'),
  password: yup.string().required('필수 항목입니다'),
});

const Login: NextPage = () => {
  const { mutate } = useLogin({
    onSuccess: async () => {
      Router.push('/');
    },
  });
  const onSubmit = (input: IFormInput) => {
    mutate(input);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextInput
          {...register('username')}
          type="text"
          placeholder="username"
        />
        <ErrorMessage>{errors.username?.message}</ErrorMessage>
        <TextInput
          {...register('password')}
          type="password"
          placeholder="password"
        />
        <ErrorMessage>{errors.password?.message}</ErrorMessage>
        <Button shadow type="submit">
          LOGIN
        </Button>
        <Button shadow type="button" onClick={() => Router.push('/register')}>
          REGISTER
        </Button>
      </form>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (): Promise<
  GetServerSidePropsResult<{
    dehydratedState: DehydratedState;
  }>
> => {
  const queryClient = new QueryClient();
  const user = await queryClient.fetchQuery(
    useGetME.getKey(),
    useGetME.fetcher(),
  );
  if (user)
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  return { props: { dehydratedState: dehydrate(queryClient) } };
};

export default Login;
