import React from "react";
import { Router } from "@reach/router";
import { Spinner } from "./Components/Spinner";
import * as HistoryStack from "./Components/HistoryStack";

const Home = React.lazy(() => import("./Pages/Home"));
const Detail = React.lazy(() => import("./Pages/Detail"));

const App = React.memo(props => {
  return (
    <HistoryStack.Provider>
      <React.Suspense maxDuration={400} fallback={<Spinner />}>
        <Router>
          <Detail path="/:movieId" />
          <Home path="/" />
        </Router>
      </React.Suspense>
    </HistoryStack.Provider>
  );
});

export default App;
