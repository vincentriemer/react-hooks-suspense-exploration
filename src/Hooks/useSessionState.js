import { useState, useCallback } from "react";

const sessionStorage = {};

export function useSessionState(
  initialValue,
  persistKey,
  onlyReportInitialValue = false
) {
  const persistedValue = sessionStorage[persistKey];

  const [value, setValue] = useState(
    persistedValue ? persistedValue : initialValue
  );

  const handleValueUpdate = useCallback(newValue => {
    sessionStorage[persistKey] = newValue;
    !onlyReportInitialValue && setValue(newValue);
  }, []);

  return [value, handleValueUpdate];
}
