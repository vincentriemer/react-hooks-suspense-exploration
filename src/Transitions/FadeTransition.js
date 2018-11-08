import React from "react";
import Animated from "@vincentriemer/animated-dom";
import Easing from "@vincentriemer/animated-dom/lib/Easing";

import { Spinner } from "../Components/Spinner";

const { Value, timing } = Animated;

export default class FadeTransition extends React.Component {
  static navigationOptions = {
    createTransition: transition => ({
      ...transition,
      opacity: new Value(0),
    }),
    runTransition: async (transition, _, fromState, toState) => {
      const isVisible = !!toState.routes.find(
        r => r.key === transition.transitionRouteKey
      );
      await new Promise(resolve => {
        timing(transition.opacity, {
          toValue: isVisible ? 1 : 0,
          duration: 500,
          easing: Easing.inOut(Easing.cubic),
        }).start(resolve);
      });
    },
  };

  render() {
    const { transition } = this.props;

    let opacity = 1;
    if (transition) {
      opacity = transition.opacity;
    }

    return (
      <Animated.div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "white",
          display: "flex",
          flexDirection: "center",
          justifyContent: "center",
          opacity,
        }}
      >
        <React.Suspense maxDuration={3000} fallback={<Spinner />}>
          {this.props.children}
        </React.Suspense>
      </Animated.div>
    );
  }
}
