import "./img.css";

import React, { useRef } from "react";
import { unstable_createResource as createResource } from "react-cache";
import { absoluteFill } from "../Styles";

export const ImgResource = createResource(src => {
  return new Promise((resolve, reject) => {
    if (src == null) return resolve();
    const image = new Image();
    image.src = src;
    image.onload = resolve;
    image.onerror = reject;
  });
});

class ImageErrorContainer extends React.Component {
  state = { error: false };

  componentDidCatch() {
    this.setState({ error: true });
  }

  render() {
    return this.state.error ? null : this.props.children;
  }
}

export const Img = props => {
  ImgResource.read(props.src);
  return <img decoding="async" alt={props.alt} {...props} />;
};

const imgStyle = {
  ...absoluteFill,
  objectFit: "cover",
  pointerEvents: "none",
};

const InnerImg = React.memo(
  ({ src, placeholderSrc, isFallback = false, reveal = false, ...rest }) => (
    <>
      {isFallback &&
        placeholderSrc && (
          <Img
            key="fallback"
            className="img-placeholder"
            draggable={false}
            style={imgStyle}
            src={placeholderSrc}
            {...rest}
          />
        )}
      {!isFallback && (
        <Img
          className={reveal ? "reveal" : ""}
          key="original"
          draggable={false}
          style={imgStyle}
          src={isFallback ? null : src}
          {...rest}
        />
      )}
    </>
  )
);

const AsyncImage = React.memo(({ style, maxDuration = 300, ...rest }) => {
  const isCached = useRef(true);
  try {
    ImgResource.read(rest.src);
  } catch (_) {
    isCached.current = false;
  }

  const placeholderJSX = <InnerImg {...rest} isFallback={true} />;

  return (
    <div style={{ ...style, backgroundColor: "lightgray" }}>
      <ImageErrorContainer>
        <React.Suspense maxDuration={maxDuration} fallback={null}>
          <React.Suspense maxDuration={200} fallback={placeholderJSX}>
            {!isCached.current ? placeholderJSX : null}
            <InnerImg {...rest} reveal={!isCached.current} />
          </React.Suspense>
        </React.Suspense>
      </ImageErrorContainer>
    </div>
  );
});

export { AsyncImage as Image };
