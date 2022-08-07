import Button from '@/components/common/Button/Button';
import Modal from '@/components/common/Modal/Modal';
import useDisclosure from '@/libs/hooks/common/useDisclosure';
import useGetME from '@/libs/hooks/queries/user/useGetMe';
import { DehydratedState, QueryClient, dehydrate } from '@tanstack/react-query';
import { GetServerSideProps, GetServerSidePropsResult } from 'next';

const Search = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <div>
      <Button shadow onClick={onOpen}>
        Modal Open
      </Button>
      <Modal
        title="This is Modal"
        message="This is Message"
        visible={isOpen}
        onCancel={onClose}
        onConfirm={onClose}
      />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (): Promise<
  GetServerSidePropsResult<{
    dehydratedState: DehydratedState;
  }>
> => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(useGetME.getKey(), useGetME.fetcher());
  return { props: { dehydratedState: dehydrate(queryClient) } };
};

export default Search;
