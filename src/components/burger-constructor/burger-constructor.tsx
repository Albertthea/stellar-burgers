import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import { useNavigate } from 'react-router-dom';
import {
  setOrderRequest,
  sendOrderThunk,
  setNullOrderModalData,
  selectIsAuthorized,
  getConstructorSelector
} from '@slices';

export const BurgerConstructor: FC = () => {
  console.log('[BurgerConstructor] render');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const constructorState = useSelector(getConstructorSelector);
  const isAuthorized = useSelector(selectIsAuthorized);

  const constructorItems = constructorState.constructorItems;
  const orderRequest = constructorState.orderRequest;

  const orderModalData = constructorState.orderModalData;

  // if (!constructorItems) {
  //   return null;
  // }
  // if (!constructorItems) {
  //   return <div>constructorItems is null</div>;
  // }

  const onOrderClick = () => {
    if (constructorItems.bun && !isAuthorized) navigate('/login');
    if (constructorItems.bun && isAuthorized) {
      dispatch(setOrderRequest(true));

      const bunId = constructorItems.bun._id;
      const ingredientsIds = constructorItems.ingredients.map(
        (ingredient) => ingredient._id
      );
      const order = [bunId, ...ingredientsIds, bunId];
      dispatch(sendOrderThunk(order));
    }
  };
  const closeOrderModal = () => {
    dispatch(setOrderRequest(false));
    dispatch(setNullOrderModalData());
  };

  const price = useMemo(() => {
    const bunPrice = constructorItems?.bun ? constructorItems.bun.price * 2 : 0;
    const ingredientsPrice =
      constructorItems?.ingredients?.reduce(
        (sum: number, ingredient: TConstructorIngredient) =>
          sum + ingredient.price,
        0
      ) ?? 0;
    return bunPrice + ingredientsPrice;
  }, [constructorItems]);
  console.log('constructorItems:', constructorItems);
  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
