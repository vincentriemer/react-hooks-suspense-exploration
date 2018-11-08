import { useState, useRef, useEffect, useCallback } from "react";
import invariant from "invariant";

const keycodes = {
  SPACE: 32,
  ENTER: 13,
};

const usePress = (role, callback, preventDefault = false) => {
  invariant(
    ["button", "link"].includes(role),
    `usePress: Invalid role provided, must be one of: button, link`
  );

  const pressRef = useRef(null);
  const pointerCleanupRef = useRef(null);
  const [isPressed, setPressed] = useState(false);

  const handleKeyUp = useCallback(() => {
    setPressed(false);
    requestAnimationFrame(() => {
      callback();
    });

    const element = pressRef.current;
    element.removeEventListener("keyup", handleKeyUp, false);
  }, []);

  const handleKeyDown = useCallback(event => {
    const isValidEnterPress = event.keyCode === keycodes.ENTER;
    const isValidSpacePress =
      role === "button" && event.keyCode === keycodes.SPACE;

    if (isValidEnterPress || isValidSpacePress) {
      preventDefault && event.preventDefault();

      setPressed(true);

      const element = pressRef.current;
      element.addEventListener("keyup", handleKeyUp, false);
    }
  }, []);

  const handlePointerCancel = useCallback(() => {
    setPressed(false);
    pointerCleanupRef.current();
  }, []);

  const handlePointerUp = useCallback(() => {
    setPressed(false);
    // unstable_runWithPriority(unstable_IdlePriority, () => callback());
    setTimeout(() => callback(), 16);
    pointerCleanupRef.current();
  }, []);

  pointerCleanupRef.current = useCallback(() => {
    const element = pressRef.current;
    document.removeEventListener("pointerup", handlePointerUp, false);
    element.removeEventListener("pointercancel", handlePointerCancel, false);
    element.removeEventListener("pointerleave", handlePointerCancel, false);
  }, []);

  const handlePointerDown = useCallback(event => {
    setPressed(true);

    const element = pressRef.current;
    document.addEventListener("pointerup", handlePointerUp, false);
    element.addEventListener("pointercancel", handlePointerCancel, false);
    element.addEventListener("pointerleave", handlePointerCancel, false);
  }, []);

  const clickPd = useCallback(event => {
    event.preventDefault();
  }, []);

  useEffect(() => {
    const element = pressRef.current;

    invariant(
      element instanceof HTMLElement,
      `usePress: ref has not been attached to an html element`
    );

    // Necessary for pointer events polyfill
    element.setAttribute("touch-action", "maniuplation");
    element.setAttribute("draggable", "false");

    element.addEventListener("pointerdown", handlePointerDown, false);
    element.addEventListener("keydown", handleKeyDown, false);
    preventDefault && element.addEventListener("click", clickPd, false);
    return () => {
      element.removeEventListener("pointerdown", handlePointerDown, false);
      element.removeEventListener("keydown", handleKeyDown, false);
      preventDefault && element.removeEventListener("click", clickPd, false);
    };
  }, []);

  const props = {
    role,
    tabIndex: 0,
    "aria-pressed": isPressed,
  };

  return [pressRef, isPressed, props];
};

export { usePress };
