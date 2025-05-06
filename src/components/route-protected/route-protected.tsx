import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';

interface Props {
  forAuthorized: boolean;
}

const isAuthorizedSelector = (state: any) => state.user?.isAuthorized;

export const RouteProtected = ({ forAuthorized }: Props) => {
  const isAuthorized = useSelector(isAuthorizedSelector);
  const location = useLocation();

  if (forAuthorized && !isAuthorized) {
    return <Navigate to='/login' replace state={{ from: location }} />;
  }

  if (!forAuthorized && isAuthorized) {
    const from = location.state?.from?.pathname || '/';
    return <Navigate to={from} replace />;
  }

  return <Outlet />;
};

export default RouteProtected;
