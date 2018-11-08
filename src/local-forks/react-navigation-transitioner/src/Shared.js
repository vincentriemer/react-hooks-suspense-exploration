import React from 'react';
import { TransitionContext } from './Transitioner';
import StyleSheet from './StyleSheet';
import Animated from '@vincentriemer/animated-dom';
import Easing from '@vincentriemer/animated-dom/lib/Easing';

const measureEl = async sharedElement => {
  const layout = await new Promise((resolve, reject) => {
    const { top, left, width, height } = sharedElement.getBoundingClientRect();
    resolve({ x: left, y: top, w: width, h: height });
  });
  return layout;
};

const setLayoutOnKey = (obj, key, layout) => {
  const layoutObj = obj[key] || (obj[key] = {});
  layoutObj.w = layout.w;
  layoutObj.h = layout.h;
  layoutObj.x = layout.x;
  layoutObj.y = layout.y;
  layoutObj.hasMeasured = 1;
};

const getLayout = (layoutsObj, id) => {
  if (!layoutsObj) {
    return null;
  }
  const layout =
    layoutsObj[id] ||
    (layoutsObj[id] = {
      hasMeasured: 0,
      x: 0,
      y: 0,
      w: 0,
      h: 0,
    });
  return layout;
};

const createSharedTransition = transition => {
  const progress = new Animated.Value(0);

  return {
    ...transition,
    progress,
    fromLayouts: {},
    transitionLayouts: {},
    transitionScreenLayout: {},
    fromScreenLayout: {},
  };
};

const runSharedTransition = async (
  transition,
  transitionScreenRefs,
  fromState,
  toState
) => {
  // By now, everything is already rendered. This is our opportunity to measure shared
  // elements and set those measurements into Animated values so that the pre-rendered
  // transition looks correct

  const transitionRouteKey = transition.transitionRouteKey;
  const fromRouteKey = transition.fromRouteKey;
  const fromScreen = transitionScreenRefs[fromRouteKey].current;
  const transitionScreen = transitionScreenRefs[transitionRouteKey].current;
  const fromSharedElements = (fromScreen && fromScreen.sharedElements) || {};
  const toSharedElements =
    (transitionScreen && transitionScreen.sharedElements) || {};
  const sharedElementIds = Object.keys(fromSharedElements).filter(
    i => Object.keys(toSharedElements).indexOf(i) !== -1
  );
  const fromLayouts = await Promise.all(
    sharedElementIds.map(async id => {
      const element = fromSharedElements[id];
      return await measureEl(element);
    })
  ); // todo, collapse these into one parallel promise.all:
  const transitionLayouts = await Promise.all(
    sharedElementIds.map(async id => {
      const element = toSharedElements[id];
      return await measureEl(element);
    })
  );
  const transitionScreenLayout = await measureEl(transitionScreen.getEl());
  const fromScreenLayout = await measureEl(fromScreen.getEl());

  setLayoutOnKey(transition, 'transitionScreenLayout', transitionScreenLayout);
  setLayoutOnKey(transition, 'fromScreenLayout', fromScreenLayout);

  sharedElementIds.forEach((sharedElId, index) => {
    setLayoutOnKey(
      transition.transitionLayouts,
      sharedElId,
      transitionLayouts[index]
    );
    setLayoutOnKey(transition.fromLayouts, sharedElId, fromLayouts[index]);
  });

  const destValue = toState.routes.find(
    r => r.key === transition.transitionRouteKey
  )
    ? 1
    : 0;

  await new Promise(resolve => {
    Animated.timing(transition.progress, {
      easing: Easing.out(Easing.cubic),
      duration: 600,
      toValue: destValue,
    }).start(resolve);
  });
};

const SharedScreenContext = React.createContext(null);

export class SharedFadeTransition extends React.Component {
  static navigationOptions = {
    createTransition: createSharedTransition,
    runTransition: runSharedTransition,
  };

  sharedElements = {};
  _screenEl = React.createRef();

  getEl = () => {
    return this._screenEl.current;
  };

  _setSharedElement = (id, ref) => {
    this.sharedElements[id] = ref;
  };

  _sharedScreenContext = {
    setSharedElement: this._setSharedElement,
    getNavigation: () => this.props.navigation,
    getTransitioningFromState: () => this.props.transitioningFromState,
    getTransitioningToState: () => this.props.transitioningToState,
  };

  render() {
    const { transition, children } = this.props;
    let opacity = 1;
    if (transition) {
      const { progress } = transition;
      opacity = progress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
      });
    }
    return (
      <SharedScreenContext.Provider value={this._sharedScreenContext}>
        <Animated.div
          domRef={elem => {
            this._screenEl.current = elem;
          }}
          style={{
            ...StyleSheet.absoluteFillObject,
            flex: 1,
            opacity,
            ...this.props.style,
          }}
        >
          {children}
        </Animated.div>
      </SharedScreenContext.Provider>
    );
  }
}

const getTransitionElementStyle = (transitionContext, screenContext, id) => {
  const transition = transitionContext.getTransition();
  const thisScreenKey = screenContext.getNavigation().state.key;
  if (!transition) {
    return [{ transform: [] }];
  }
  const transitionLayout = getLayout(transition.transitionLayouts, id);
  const fromLayout = getLayout(transition.fromLayouts, id);

  if (!transitionLayout || !fromLayout) {
    throw new Error('This is unexpected');
  }
  const transitionRouteKey = transition.transitionRouteKey;
  const fromRouteKey = transition.fromRouteKey;
  const isTransitionScreen = transitionRouteKey === thisScreenKey;
  const isFromScreen = fromRouteKey === thisScreenKey;

  const isMeasured = transitionLayout.hasMeasured && fromLayout.hasMeasured;

  const doInterpolate = (measureVal, start, end) =>
    transition.progress.interpolate({
      inputRange: [0, Number.EPSILON, 1],
      outputRange: [measureVal, start, end],
    });

  const interpolateScale = (to, from) => {
    if (isTransitionScreen) {
      return doInterpolate(1, from / to, 1);
    } else if (isFromScreen) {
      return doInterpolate(1, 1, to / from);
    } else {
      return doInterpolate(1, 1, 1);
    }
  };

  const interpolateTranslate = (toOffset, fromOffset, toScale, fromScale) => {
    if (isTransitionScreen) {
      return doInterpolate(
        0,
        fromOffset + fromScale / 2 - (toOffset + toScale / 2)
      );
    } else if (isFromScreen) {
      return doInterpolate(
        0,
        toOffset + toScale / 2 - (fromOffset + fromScale / 2)
      );
    } else {
      return doInterpolate(0, 0, 0);
    }
  };

  const scaleTransform = (to, from) =>
    isMeasured ? interpolateScale(to, from) : 1;

  const translateTransform = (toOffset, fromOffset, toScale, fromScale) =>
    isMeasured
      ? interpolateTranslate(toOffset, fromOffset, toScale, fromScale)
      : 0;

  return {
    transform: [
      {
        translateX: translateTransform(
          transitionLayout.x,
          fromLayout.x,
          transitionLayout.w,
          fromLayout.w
        ),
      },
      {
        translateY: translateTransform(
          transitionLayout.y,
          fromLayout.y,
          transitionLayout.h,
          fromLayout.h
        ),
      },
      {
        scaleX: scaleTransform(transitionLayout.w, fromLayout.w),
      },
      {
        scaleY: scaleTransform(transitionLayout.h, fromLayout.h),
      },
    ],
  };
};

class SharedViewWithContext extends React.Component {
  render() {
    const {
      sharedScreenContext,
      transitionContext,
      id,
      style,
      children,
    } = this.props;

    const sharedElId = `${id}_view`;

    if (!sharedScreenContext) {
      throw new Error('Cannot render shared element outside of shared screen!');
    }
    const { setSharedElement } = sharedScreenContext;

    if (!transitionContext) {
      throw new Error('Cannot render shared element outside of transitioner!');
    }

    const transitionStyle = getTransitionElementStyle(
      transitionContext,
      sharedScreenContext,
      sharedElId
    );

    return (
      <Animated.div
        style={{
          ...style,
          ...transitionStyle,
        }}
        domRef={r => setSharedElement(sharedElId, r)}
      >
        {children}
      </Animated.div>
    );
  }
}

export const SharedView = props => (
  <TransitionContext.Consumer>
    {transitionContext => (
      <SharedScreenContext.Consumer>
        {sharedScreenContext => (
          <SharedViewWithContext
            {...props}
            transitionContext={transitionContext}
            sharedScreenContext={sharedScreenContext}
          />
        )}
      </SharedScreenContext.Consumer>
    )}
  </TransitionContext.Consumer>
);

class SharedTextWithContext extends React.Component {
  render() {
    const {
      sharedScreenContext,
      transitionContext,
      id,
      style,
      children,
      fontSize,
      color,
    } = this.props;

    const sharedElId = `${id}_text`;

    if (!sharedScreenContext) {
      throw new Error('Cannot render shared element outside of shared screen!');
    }
    const { setSharedElement } = sharedScreenContext;

    if (!transitionContext) {
      throw new Error('Cannot render shared element outside of transitioner!');
    }

    return (
      <Animated.div
        style={{
          ...style,
          ...getTransitionElementStyle(
            transitionContext,
            sharedScreenContext,
            sharedElId
          ),
          alignSelf: 'center',
        }}
        domRef={r => setSharedElement(sharedElId, r)}
      >
        <Animated.span style={{ fontSize, color }}>{children}</Animated.span>
      </Animated.div>
    );
  }
}

export const SharedText = props => (
  <TransitionContext.Consumer>
    {transitionContext => (
      <SharedScreenContext.Consumer>
        {sharedScreenContext => (
          <SharedTextWithContext
            {...props}
            transitionContext={transitionContext}
            sharedScreenContext={sharedScreenContext}
          />
        )}
      </SharedScreenContext.Consumer>
    )}
  </TransitionContext.Consumer>
);
