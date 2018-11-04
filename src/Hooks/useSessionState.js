import { useState, useCallback } from "react";

const pageStorage = {};

export function useSessionState(
  initialValue,
  persistKey,
  onlyReportInitialValue = false
) {
  const persistedValue = pageStorage[persistKey];

  const [value, setValue] = useState(
    persistedValue ? persistedValue : initialValue
  );

  const handleValueUpdate = useCallback(newValue => {
    pageStorage[persistKey] = newValue;
    !onlyReportInitialValue && setValue(newValue);
  }, []);

  return [value, handleValueUpdate];
}
