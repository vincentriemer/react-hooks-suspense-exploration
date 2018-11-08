import React, { useEffect } from "react";
import { IoIosClose } from "react-icons/io";
import Animated from "@vincentriemer/animated-dom";

import PanTransition from "../Transitions/PanTransition";
import { Image } from "../Components/Image";

import { usePress } from "../Hooks/usePress";
import { useAnimatedValue } from "../Hooks/useAnimatedValue";

import { colors } from "../Colors";
import { uiKit, human } from "../Typography";
import { absoluteFill } from "../Styles";
import { MovieDetailResourcce } from "../Resources/MovieDetails";

const DetailPage = ({ navigation }) => {
  const {
    replace,
    setParams,
    pop,
    dangerouslyGetParent,
    getParam,
  } = navigation;

  const movieId = getParam("movieId");
  const movieTitle = getParam("movieTitle");

  const [closePressRef, isClosedPressed] = usePress(
    "link",
    () => {
      const numStacks = dangerouslyGetParent().state.routes.length;
      numStacks === 1 ? replace("Home") : pop();
    },
    true
  );
  const closeAnimVal = useAnimatedValue(isClosedPressed ? 1 : 0);

  const {
    title,
    releaseYear,
    posterUrl,
    placeholderPosterUrl,
    synopsis,
  } = MovieDetailResourcce.read(movieId);

  useEffect(() => {
    if (movieTitle == null) {
      setParams({ movieTitle: title });
    }
  });

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        overflow: "hidden",
        overflowY: "auto",
        backgroundColor: "white",
        WebkitOverflowScrolling: "touch",

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
      <Animated.anchor
        href="/movies"
        title="Go to movie list"
        domRef={elem => {
          closePressRef.current = elem;
        }}
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
          overflowX: "hidden",
          overflowY: "auto",
          opacity: closeAnimVal.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 0.3],
          }),
        }}
      >
        <IoIosClose
          style={{ display: "block" }}
          size={45}
          color={colors.black}
        />
      </Animated.anchor>
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
        style={{
          backgroundColor: "white",
          paddingLeft: 20,
          paddingRight: 20,
          paddingBottom: 50,
        }}
      >
        <p style={uiKit.body}>{synopsis}</p>
      </div>
    </div>
  );
};

export default class extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam("movieTitle", "Movie"),
    ...PanTransition.navigationOptions,
  });

  render() {
    return (
      <PanTransition
        {...this.props}
        style={{ ...absoluteFill, ...this.props.style }}
      >
        <DetailPage {...this.props} />
      </PanTransition>
    );
  }
}
