import { useRef, useState, useCallback } from 'react';

function useRefState(initialValue) {
  const [_, setRender] = useState(0); // Just to trigger re-renders
  const ref = useRef(initialValue);

  // Function to update the ref and force re-render
  const setRefState = useCallback((newValue) => {
    ref.current = typeof newValue === 'function' ? newValue(ref.current) : newValue;
    setRender((prev) => prev + 1); // Trigger a re-render
  }, []);

  return [ref.current, setRefState];
}

export default useRefState;
