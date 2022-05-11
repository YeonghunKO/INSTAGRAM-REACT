import PropTypes from 'prop-types';
import React from 'react';
import { Navigate } from 'react-router-dom';
import * as ROUTES from '../constants/routes';
import useUser from '../hooks/useUser';

function ProtectedRoute({ user, children }) {
  if (!user) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }
  const { activeUser } = useUser(user.uid);

  return React.cloneElement(children, { activeUser });
}

export default ProtectedRoute;

ProtectedRoute.propTypes = {
  user: PropTypes.object,
  children: PropTypes.object.isRequired,
};
