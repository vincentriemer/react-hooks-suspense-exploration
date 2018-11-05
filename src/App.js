import React from "react";
import { Router, Redirect } from "@reach/router";
import { Spinner } from "./Components/Spinner";
import * as HistoryStack from "./Components/HistoryStack";

const Home = React.lazy(() => import("./Pages/Home"));
const Detail = React.lazy(() => import("./Pages/Detail"));

const App = React.memo(props => {
  return (
    <HistoryStack.Provider>
      <React.Suspense maxDuration={1000} fallback={<Spinner />}>
        <Router>
          <Redirect noThrow from="/" to="/movies" />
          <Home path="/movies" />
          <Detail path="/movies/:movieId" />
        </Router>
      </React.Suspense>
    </HistoryStack.Provider>
  );
});

export default App;
