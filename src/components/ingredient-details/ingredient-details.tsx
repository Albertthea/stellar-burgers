import { FC } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { getIngredientsSelector } from '@slices';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';

export const IngredientDetails: FC = () => {
  const { id: ingredientId } = useParams<{ id: string }>();
  const ingredients = useSelector(getIngredientsSelector);
  const ingredient = ingredients.find(({ _id }) => _id === ingredientId);

  return ingredient ? (
    <IngredientDetailsUI ingredientData={ingredient} />
  ) : (
    <Preloader />
  );
};
