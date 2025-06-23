
import React from 'react';
import { Navigate } from 'react-router-dom';

// Redirect to the dashboard
const Index: React.FC = () => {
  return <Navigate to="/" replace />;
};

export default Index;
