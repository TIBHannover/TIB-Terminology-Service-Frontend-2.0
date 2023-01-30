import { useLocation } from 'react-router-dom'
import { useEffect } from "react";

const useOnLocationChange = handleLocationChange => {
    const location = useLocation();
  
    useEffect(() => {
        handleLocationChange(location);
    }, [location, handleLocationChange]);
  };

  export default useOnLocationChange; 
  
