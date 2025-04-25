import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from '@store';
import { RegisterUI } from '@ui-pages';
import {
  clearUserError,
  registerUserThunk,
  getUserErrorSelector
} from '@slices';

export const Register: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const error = useSelector(getUserErrorSelector);

  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    try {
      await dispatch(
        registerUserThunk({
          email,
          name: userName,
          password
        })
      ).unwrap(); // чтобы ловить ошибки

      navigate('/'); // или /profile, или откуда пришёл
    } catch (err) {
      console.error('Ошибка регистрации:', err);
    }
  };

  useEffect(() => {
    dispatch(clearUserError());
  }, [dispatch]);

  return (
    <RegisterUI
      errorText={error?.toString()}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
