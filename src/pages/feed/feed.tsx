import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { getFeedThunk, selectFeedState } from '@slices';
import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const { orders, isLoading } = useSelector(selectFeedState);

  useEffect(() => {
    dispatch(getFeedThunk());
  }, [dispatch]);

  if (isLoading || !orders.length) {
    return <Preloader />;
  }

  return (
    <FeedUI orders={orders} handleGetFeeds={() => dispatch(getFeedThunk())} />
  );
};
