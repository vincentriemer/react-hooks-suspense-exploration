import React, { useCallback, useState } from "react";
import { VariableSizeList as List } from "react-window";
import { useWindowSize } from "the-platform";

import { useSessionState } from "../Hooks/useSessionState";
import { MovieListResource } from "../Resources/MovieList";
import { ImgResource } from "../Components/Image";
import { Spinner } from "../Components/Spinner";
import { MovieCell } from "../Components/MovieCell";
import { uiKit } from "../Typography";
import { ITEM_WIDTH, ITEM_HEIGHT, HEADER_HEIGHT } from "../Config";

const Home = React.memo(props => {
  const [isLoading, setLoading] = useState(false);

  const [currentPage, updateCurrentPage] = useSessionState(
    1,
    "movieListNumPages"
  );

  const data = new Array(currentPage)
    .fill(undefined)
    .reduce((acc, _, index) => {
      let pageData = [];
      const currentPage = index + 1;

      try {
        pageData = MovieListResource.read(currentPage);
      } catch (err) {
        // If this is the initial page fetch (throwing on a read of the first page),
        // re-throw the error up the tree to be caught by the route-level <Suspense />
        if (currentPage === 1) throw err;

        // Otherwise, we swallow the error and update the component's
        // isLoading state.

        // NOTE: We need to make sure we don't update the state if the
        // component is already loading (will cause an infinite loop)
        if (!isLoading) {
          setLoading(true);
          err.then(() => setLoading(false));
        }
      }

      return acc.concat(pageData);
    }, []);

  for (const movie of data) {
    ImgResource.preload(movie.placeholderPosterUrl);
  }

  const listData = [{ type: "header" }, ...data];
  isLoading && listData.push({ type: "footer" });
  const itemCount = listData.length;

  const { width, height } = useWindowSize();

  const onItemsRendered = useCallback(
    ({ visibleStopIndex }) => {
      if (itemCount - visibleStopIndex < 3) {
        updateCurrentPage(currentPage + 1);
      }
    },
    [itemCount]
  );

  const cellRenderer = useCallback(
    ({ index, style }) => {
      const itemData = listData[index];
      switch (itemData.type) {
        case "movie": {
          return (
            <div
              style={{
                ...style,
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <MovieCell {...itemData} />
            </div>
          );
        }
        case "header": {
          return (
            <div
              style={{
                ...style,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-end",
              }}
            >
              <div
                style={{
                  maxWidth: ITEM_WIDTH,
                  marginLeft: 30,
                  marginRight: 30,
                }}
              >
                <h1 style={{ display: "block", ...uiKit.largeTitleEmphasized }}>
                  Movies
                </h1>
              </div>
            </div>
          );
        }
        case "footer": {
          return (
            <div
              style={{
                ...style,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-start",
                paddingTop: 75,
              }}
            >
              <Spinner />
            </div>
          );
        }
        default: {
          return <div />;
        }
      }
    },
    [listData]
  );

  const itemSize = useCallback(
    index => {
      const itemData = listData[index];
      switch (itemData.type) {
        case "movie": {
          return ITEM_HEIGHT;
        }
        case "header": {
          return HEADER_HEIGHT;
        }
        case "footer": {
          return ITEM_HEIGHT;
        }
        default: {
          return 0;
        }
      }
    },
    [listData, itemCount]
  );

  const setTouchAction = useCallback(elem => {
    elem && elem.setAttribute("touch-action", "pan-y");
  }, []);

  const [scrollOffset, setScrollOffset] = useSessionState(
    0,
    "movieListScrollOffset",
    true
  );

  const handleScroll = useCallback(({ scrollOffset }) => {
    setScrollOffset(scrollOffset);
  }, []);

  return (
    <List
      onScroll={handleScroll}
      initialScrollOffset={scrollOffset}
      className="react-window"
      style={{
        overscrollBehavior: "contain",
      }}
      outerRef={setTouchAction}
      innerRef={setTouchAction}
      itemData={data}
      itemCount={itemCount}
      itemSize={itemSize}
      width={width}
      height={height}
      estimatedItemSize={ITEM_HEIGHT}
      overscanCount={2}
      onItemsRendered={onItemsRendered}
    >
      {cellRenderer}
    </List>
  );
});

export default () => (
  <>
    <Home />
  </>
);
