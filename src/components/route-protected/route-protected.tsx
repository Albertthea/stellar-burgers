import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

interface Props {
  forAuthorized: boolean;
}

const isAuthorizedSelector = (state: any) => state.user?.isAuthorized;

export const RouteProtected = ({ forAuthorized }: Props) => {
  const isAuthorized = useSelector(isAuthorizedSelector);

  if (forAuthorized && !isAuthorized) {
    return <Navigate to='/login' replace />;
  }

  if (!forAuthorized && isAuthorized) {
    return <Navigate to='/' replace />;
  }

  return <Outlet />;
};

export default RouteProtected;
