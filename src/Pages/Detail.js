import React, { useCallback, useContext } from "react";
import { useWindowSize } from "the-platform";
import { IoIosClose } from "react-icons/io";
import { useSpring, animated, config } from "react-spring";

import * as HistoryStack from "../Components/HistoryStack";
import { Image } from "../Components/Image";

import { usePress } from "../Hooks/usePress";

import { colors } from "../Colors";
import { uiKit, human } from "../Typography";
import { absoluteFill } from "../Styles";
import { MovieDetailResourcce } from "../Resources/MovieDetails";

const DetailPage = ({ navigate, location, movieId }) => {
  const { hasNavigated } = useContext(HistoryStack.Context);
  const { width, height } = useWindowSize();

  const [closePressRef, isClosedPressed] = usePress(
    "link",
    () => {
      hasNavigated ? window.history.back() : navigate("/movies");
    },
    true
  );

  const [closeAnimProps] = useSpring({
    opacity: isClosedPressed ? 0.4 : 1.0,
    native: true,
    config: config.stiff,
  });

  const loadData = useCallback(() => {
    try {
      return MovieDetailResourcce.read(movieId);
    } catch (err) {
      if (location.state) {
        return location.state;
      }
      throw err;
    }
  }, []);

  const {
    title,
    releaseYear,
    posterUrl,
    placeholderPosterUrl,
    synopsis,
  } = loadData();

  return (
    <div
      style={{
        width,
        height,
        overflow: "hidden",
        backgroundColor: "white",

        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        justifyContent: "flex-start",
      }}
    >
      <div style={{ width: "100%", height: "40%", minHeight: 300 }}>
        <Image
          alt=""
          maxDuration={800}
          style={absoluteFill}
          src={posterUrl}
          placeholderSrc={placeholderPosterUrl}
        />
      </div>
      <animated.a
        href="/movies"
        title="Go to movie list"
        ref={closePressRef}
        style={{
          position: "absolute",
          top: 30,
          right: 30,
          width: 50,
          height: 50,
          borderRadius: 25,
          backgroundColor: "rgba(255, 255, 255, 0.6)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          overflow: "hidden",
          willChange: "opacity",
          ...closeAnimProps,
        }}
      >
        <IoIosClose
          style={{ display: "block" }}
          size={45}
          color={colors.black}
        />
      </animated.a>
      <div
        style={{
          backgroundColor: "white",
          padding: 20,
        }}
      >
        <h1 style={{ ...human.title1, fontWeight: "bold" }}>{title}</h1>
        <h2 style={{ ...uiKit.subhead, color: colors.black, opacity: 0.7 }}>
          {releaseYear}
        </h2>
      </div>
      <div
        style={{ backgroundColor: "white", paddingLeft: 20, paddingRight: 20 }}
      >
        <p style={uiKit.body}>{synopsis}</p>
      </div>
    </div>
  );
};

export default DetailPage;
