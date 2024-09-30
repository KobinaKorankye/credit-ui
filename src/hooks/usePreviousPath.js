import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function usePreviousPath() {
  const location = useLocation();
  const [previousPath, setPreviousPath] = useState(null);

  useEffect(() => {
    // Store the current path as the previous path before the next render
    return () => {
      setPreviousPath(location.pathname);
    };
  }, [location]);

  return previousPath;
}