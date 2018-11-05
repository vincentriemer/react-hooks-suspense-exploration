import React, { useEffect, useRef, useState } from "react";
import { Location } from "@reach/router";

export const Context = React.createContext({ hasNavigated: false });

const InnerProvider = React.memo(({ locationKey, children }) => {
  const [hasNavigated, setHasNavigated] = useState(false);

  const prevLocationRef = useRef({ hasNavigated: false });
  useEffect(
    () => {
      if (prevLocationRef.current != null && !hasNavigated) {
        setHasNavigated(true);
      }
      prevLocationRef.current = locationKey;
    },
    [locationKey]
  );

  return (
    <Context.Provider value={{ hasNavigated }}>{children}</Context.Provider>
  );
});

export const Provider = React.memo(({ children }) => {
  return (
    <Location>
      {({ location }) => (
        <InnerProvider locationKey={location.pathname}>
          {children}
        </InnerProvider>
      )}
    </Location>
  );
});
