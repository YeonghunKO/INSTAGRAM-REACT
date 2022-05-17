import PropTypes from 'prop-types';
import React from 'react';
import { Navigate } from 'react-router-dom';
import * as ROUTES from '../constants/routes';

function ProtectedRoute({ user, activeUser, children }) {
  if (!user) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return React.cloneElement(children, { activeUser });
}

export default ProtectedRoute;

ProtectedRoute.propTypes = {
  activeUser: PropTypes.object,
  user: PropTypes.object,
  children: PropTypes.object.isRequired,
};
