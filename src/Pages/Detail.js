import React from "react";
import { useWindowSize } from "the-platform";

import { Image } from "../Components/Image";

import { colors } from "../Colors";
import { uiKit, human } from "../Typography";
import { absoluteFill } from "../Styles";

const DetailPage = ({ navigate, location, movieId }) => {
  const { width, height } = useWindowSize();

  const {
    title,
    releaseYear,
    posterUrl,
    placeholderPosterUrl,
  } = location.state;

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
          style={absoluteFill}
          src={posterUrl}
          placeholderSrc={placeholderPosterUrl}
        />
      </div>
      <div
        style={{
          backgroundColor: "white",
          padding: 15,
        }}
      >
        <h1 style={{ ...human.title1, fontWeight: "bold" }}>{title}</h1>
        <h2 style={{ ...uiKit.subhead, color: colors.gray }}>{releaseYear}</h2>
      </div>
    </div>
  );
};

export default DetailPage;
