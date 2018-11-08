import React from "react";
import Animated from "@vincentriemer/animated-dom";

import { absoluteFill } from "../Styles";

import { Spinner } from "../Components/Spinner";

const { Value, spring } = Animated;

export default class PanTransition extends React.Component {
  static navigationOptions = {
    createTransition: transition => ({
      ...transition,
      position: new Value(0),
    }),
    getBehindTransitionAnimatedStyle: transition => ({
      opacity: transition.position.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 0],
      }),
    }),
    runTransition: async (transition, _, fromState, toState) => {
      const isVisible = !!toState.routes.find(
        r => r.key === transition.transitionRouteKey
      );
      await new Promise(resolve => {
        spring(transition.position, {
          toValue: isVisible ? 1 : 0,
          bounciness: 1,
        }).start(resolve);
      });
    },
  };

  render() {
    const { transition } = this.props;
    let position = transition
      ? transition.position.interpolate({
          inputRange: [0, 1],
          outputRange: ["100%", "0%"],
        })
      : 0;

    let opacity = transition
      ? transition.position.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 1],
        })
      : 1;

    return (
      <Animated.div
        style={{
          ...absoluteFill,
          backgroundColor: "white",
          opacity,
          transform: [{ translateY: position }],
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <React.Suspense maxDuration={500} fallback={<Spinner />}>
          {this.props.children}
        </React.Suspense>
      </Animated.div>
    );
  }
}
