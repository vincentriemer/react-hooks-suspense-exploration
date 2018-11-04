import React, { useCallback, useEffect } from "react";
import { VariableSizeList as List } from "react-window";
import { useWindowSize } from "the-platform";

import { useSessionState } from "../Hooks/useSessionState";
import { MovieListResource } from "../Resources/MovieList";
import { ImgResource } from "../Components/Image";
import { Spinner } from "../Components/Spinner";
import { MovieCell } from "../Components/MovieCell";
import { uiKit } from "../Typography";
import {
  ITEM_WIDTH,
  ITEM_HEIGHT,
  HEADER_HEIGHT,
  FOOTER_HEIGHT,
} from "../Config";

const Home = React.memo(props => {
  // preload details chunk
  useEffect(() => {
    import("./Detail");
  }, []);

  const [currentPage, updateCurrentPage] = useSessionState(
    1,
    "movieListNumPages"
  );

  const data = new Array(currentPage)
    .fill(undefined)
    .reduce((acc, _, index) => {
      const pageData = MovieListResource.read(index + 1);
      return acc.concat(pageData);
    }, []);

  for (const movie of data) {
    ImgResource.preload(movie.placeholderPosterUrl);
  }

  const listData = [{ type: "header" }, ...data];
  const itemCount = listData.length;

  const { width, height } = useWindowSize();

  const onItemsRendered = useCallback(
    ({ visibleStopIndex }) => {
      if (itemCount - visibleStopIndex < 3) {
        setTimeout(() => {
          updateCurrentPage(currentPage + 1);
        });
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
                justifyContent: "flex-end",
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
          return FOOTER_HEIGHT;
        }
        default: {
          return 0;
        }
      }
    },
    [listData]
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
      className="react-window"
      style={{
        overscrollBehavior: "contain",
      }}
      onScroll={handleScroll}
      initialScrollOffset={scrollOffset}
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
