import { FC, useMemo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { RootState } from '../../services/store';
import { getIngredientsStateSelector } from '../../services/slices/ingredientsSlice';
import {
  getOrderSelector,
  getOrderThunk
} from '../../services/slices/orderSlice';
import { useParams } from 'react-router-dom';
import type { AppDispatch } from '../../services/store';
export const useAppDispatch = () => useDispatch<AppDispatch>();

export const OrderInfo: FC = () => {
  const dispatch = useAppDispatch();
  const { number } = useParams<{ number: string }>();
  const orderNumber = Number(number);

  useEffect(() => {
    if (!isNaN(orderNumber)) {
      dispatch(getOrderThunk(orderNumber));
    }
  }, [dispatch, orderNumber]);

  const ingredients = useSelector(
    (state: RootState) => getIngredientsStateSelector(state).items
  );
  const orderState = useSelector((state: RootState) => getOrderSelector(state));
  const orderData = orderState.order;
  const isLoading = orderState.isLoading;

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsMap = ingredients.reduce<Record<string, TIngredient>>(
      (acc, ingredient) => {
        acc[ingredient._id] = ingredient;
        return acc;
      },
      {}
    );

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, itemId) => {
        const ingredient = ingredientsMap[itemId];
        if (ingredient) {
          if (!acc[itemId]) {
            acc[itemId] = {
              ...ingredient,
              count: 1
            };
          } else {
            acc[itemId].count++;
          }
        }
        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (isLoading || !orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
