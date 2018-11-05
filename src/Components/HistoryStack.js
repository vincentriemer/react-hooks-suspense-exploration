import React, { useEffect, useRef, useState } from "react";
import { Location } from "@reach/router";

export const Context = React.createContext({ hasNavigated: false });

const InnerProvider = React.memo(({ locationKey, children }) => {
  const updateOnlyRef = useRef(false);

  const [hasNavigated, setHasNavigated] = useState(false);
  useEffect(
    () => {
      if (updateOnlyRef && !hasNavigated) {
        setHasNavigated(true);
      }
    },
    [locationKey]
  );

  useEffect(() => {
    updateOnlyRef.current = true;
  }, []);

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
