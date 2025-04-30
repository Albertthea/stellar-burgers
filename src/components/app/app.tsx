import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';
import '../../index.css';
import styles from './app.module.css';
import {
  AppHeader,
  Modal,
  OrderInfo,
  IngredientDetails,
  RouteProtected
} from '@components';
import { useDispatch } from '../../services/store';
import { getIngredientsThunk, selectUserState, getUserThunk } from '@slices';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Preloader } from '../ui/preloader';

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const userLoading = useSelector(selectUserState).isLoading;
  const backgroundLocation = location.state?.background;

  useEffect(() => {
    dispatch(getUserThunk());
    dispatch(getIngredientsThunk());
  }, [dispatch]);

  if (userLoading) {
    return <Preloader />;
  }

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={backgroundLocation || location}>
        <Route path='/' element={<ConstructorPage />} />
        {!backgroundLocation && (
          <>
            <Route path='/ingredients/:id' element={<IngredientDetails />} />
            <Route path='/feed/:number' element={<OrderInfo />} />
            <Route element={<RouteProtected forAuthorized />}>
              <Route path='/profile/orders/:number' element={<OrderInfo />} />
            </Route>
          </>
        )}
        <Route path='/feed' element={<Feed />} />
        <Route element={<RouteProtected forAuthorized={false} />}>
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/reset-password' element={<ResetPassword />} />
        </Route>
        <Route element={<RouteProtected forAuthorized />}>
          <Route path='/profile' element={<Profile />} />
          <Route path='/profile/orders' element={<ProfileOrders />} />
        </Route>
        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {backgroundLocation && (
        <Routes>
          <Route
            path='/feed/:number'
            element={
              <Modal
                title={`#${location.pathname.match(/\d+/)?.[0]}`}
                onClose={() => navigate(-1)}
              >
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/ingredients/:id'
            element={
              <Modal title='Детали ингредиента' onClose={() => navigate(-1)}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route element={<RouteProtected forAuthorized />}>
            <Route
              path='/profile/orders/:number'
              element={
                <Modal
                  title={`#${location.pathname.match(/\d+/)?.[0]}`}
                  onClose={() => navigate('/profile/orders')}
                >
                  <OrderInfo />
                </Modal>
              }
            />
          </Route>
        </Routes>
      )}
    </div>
  );
};

export default App;
