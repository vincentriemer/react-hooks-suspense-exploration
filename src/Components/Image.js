import "./img.css";

import React from "react";
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
  transition: "opacity 0.2s",
};

const InnerImg = React.memo(({ src, placholderSrc, isFallback, ...rest }) => (
  <>
    {placholderSrc && (
      <Img
        key="fallback"
        className="img-placeholder"
        draggable={false}
        style={imgStyle}
        src={placholderSrc}
        {...rest}
      />
    )}
    <Img
      key="original"
      draggable={false}
      style={{ ...imgStyle, opacity: isFallback ? 0 : 1 }}
      src={isFallback ? null : src}
      {...rest}
    />
  </>
));

const AsyncImage = React.memo(({ style, ...rest }) => {
  return (
    <div style={{ ...style, backgroundColor: "lightgray" }}>
      <ImageErrorContainer>
        <React.Suspense maxDuration={0} fallback={<div />}>
          <React.Suspense
            maxDuration={100}
            fallback={<InnerImg {...rest} isFallback={true} />}
          >
            <InnerImg {...rest} isFallback={false} />
          </React.Suspense>
        </React.Suspense>
      </ImageErrorContainer>
    </div>
  );
});

export { AsyncImage as Image };
