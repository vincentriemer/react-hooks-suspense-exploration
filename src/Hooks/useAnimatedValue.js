import { useRef, useEffect } from "react";
import Animated from "@vincentriemer/animated-dom";

function defaultFactory(animatedValue, toValue) {
  return Animated.spring(animatedValue, {
    toValue,
  });
}

export const useAnimatedValue = (value, animFactory = defaultFactory) => {
  const animatedValueRef = useRef(new Animated.Value(value));
  const animatedValue = animatedValueRef.current;

  const prevValueRef = useRef(null);
  useEffect(
    () => {
      prevValueRef.current = value;
    },
    [value]
  );

  if (prevValueRef.current != null && value !== prevValueRef.current) {
    animFactory(animatedValue, value).start();
  }

  return animatedValue;
};
