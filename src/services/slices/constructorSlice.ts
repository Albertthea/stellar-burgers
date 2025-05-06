import { TConstructorIngredient, TOrder } from '@utils-types';
import { createSlice, createAsyncThunk, nanoid } from '@reduxjs/toolkit';
import { orderBurgerApi } from '@api';
import { RootState } from '../store';
import { PayloadAction } from '@reduxjs/toolkit';

export interface ConstructorState {
  isLoading: boolean;
  constructorItems: {
    bun: TConstructorIngredient | null;
    ingredients: TConstructorIngredient[];
  };
  orderRequest: boolean;
  orderModalData: TOrder | null;
  error: string | null;
}

const initialState: ConstructorState = {
  isLoading: false,
  constructorItems: {
    bun: null,
    ingredients: []
  },
  orderRequest: false,
  orderModalData: null,
  error: null
};

export const sendOrderThunk = createAsyncThunk(
  'constructorburger/sendOrder',
  (data: string[]) => orderBurgerApi(data)
);

const constructorSlice = createSlice({
  name: 'constructorburger',
  initialState,
  reducers: {
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        const ingredient = action.payload;
        if (ingredient.type === 'bun') {
          state.constructorItems.bun = ingredient;
        } else {
          state.constructorItems.ingredients.push(ingredient);
        }
      },
      prepare: (ingredient: Omit<TConstructorIngredient, 'id'>) => ({
        payload:
          ingredient.type === 'bun'
            ? (ingredient as TConstructorIngredient)
            : { ...ingredient, id: nanoid() }
      })
    },
    removeIngredient: (state, action) => {
      state.constructorItems.ingredients =
        state.constructorItems.ingredients.filter(
          (ingredient) => ingredient.id !== action.payload
        );
    },
    setOrderRequest: (state, action) => {
      state.orderRequest = action.payload;
    },
    setNullOrderModalData: (state) => {
      state.orderModalData = null;
    },
    moveIngredientDown: (state, action: PayloadAction<number>) => {
      const idx = action.payload;
      [
        state.constructorItems.ingredients[idx],
        state.constructorItems.ingredients[idx + 1]
      ] = [
        state.constructorItems.ingredients[idx + 1],
        state.constructorItems.ingredients[idx]
      ];
    },
    moveIngredientUp: (state, action: PayloadAction<number>) => {
      const idx = action.payload;
      [
        state.constructorItems.ingredients[idx],
        state.constructorItems.ingredients[idx - 1]
      ] = [
        state.constructorItems.ingredients[idx - 1],
        state.constructorItems.ingredients[idx]
      ];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendOrderThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sendOrderThunk.rejected, (state, { error }) => {
        state.isLoading = false;
        state.error = error.message || 'Unknown error';
      })
      .addCase(sendOrderThunk.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        state.orderRequest = false;
        state.orderModalData = payload.order;
        state.constructorItems = {
          bun: null,
          ingredients: []
        };
      });
  }
});
export const getConstructorSelector = (state: RootState) =>
  state.constructorburger;

export const {
  addIngredient,
  removeIngredient,
  setOrderRequest,
  setNullOrderModalData,
  moveIngredientDown,
  moveIngredientUp
} = constructorSlice.actions;

export default constructorSlice.reducer;
