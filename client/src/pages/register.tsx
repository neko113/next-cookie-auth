import { GetServerSideProps, GetServerSidePropsResult, NextPage } from 'next';
import Router from 'next/router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import useRegister from '@/hooks/queries/auth/useRegister';
import useGetME from '@/hooks/queries/user/useGetMe';
import { DehydratedState, QueryClient, dehydrate } from '@tanstack/react-query';
import { TextInput, Button, ErrorMessage } from '@/components/common';
import styled from '@emotion/styled';
import { flexCenter } from '@/lib/styles/shared';
import { isValidPassword, isValidUsername } from '@/lib/regex';

interface IFormInput {
  username: string;
  password: string;
}

const schema = yup.object().shape({
  username: yup
    .string()
    .required('필수항목입니다')
    .matches(isValidUsername, '숫자나 영문으로 이루어진 5~20글자여야 합니다.'),
  password: yup
    .string()
    .required('필수 항목입니다')
    .matches(isValidPassword, '숫자나 영문으로 이루어진 8~20글자여야 합니다.'),
});

const Register: NextPage = () => {
  const { mutate } = useRegister({
    onSuccess: async () => {
      Router.push('/login');
    },
    onError: (e) => {
      alert(e.response?.data.message);
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
    <Container>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <TextInput
          {...register('username')}
          type="text"
          placeholder="username"
          variant="underlined"
        />
        <ErrorMessage>{errors.username?.message}</ErrorMessage>
        <TextInput
          {...register('password')}
          type="password"
          placeholder="password"
          variant="underlined"
        />
        <ErrorMessage>{errors.password?.message}</ErrorMessage>
        <Button shadow size="lg" color="success" type="submit">
          REGISTER
        </Button>
      </Form>
    </Container>
  );
};

const Container = styled.div`
  ${flexCenter}
`;

const Form = styled.form`
  margin-top: 8rem;
  width: 250px;
  ${flexCenter}
  flex-direction: column;
  button {
    margin-top: 1rem;
  }
`;

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

export default Register;
