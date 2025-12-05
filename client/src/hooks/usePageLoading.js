import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const usePageLoading = (delay = 500) => {
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsLoading(true);

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [location.pathname, delay]);

  return isLoading;
};

export default usePageLoading;
