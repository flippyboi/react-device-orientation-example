import React from "react";

declare global {
  interface Window {
    //adds definition to Document, but you can do the same with HTMLElement
    addEventListener<K extends keyof CustomEventMap>(
      type: K,
      listener: (this: Document, ev: CustomEventMap[K]) => void
    ): void;
    dispatchEvent<K extends keyof CustomEventMap>(ev: CustomEventMap[K]): void;
  }
}

interface CustomEventMap {
  gestureSwipe: CustomEvent<string>;
}

export const useDeviceOrientation = () => {
  const [or, setOr] = React.useState<{
    gamma: number;
    beta: number;
    alpha: number;
  }>({ gamma: 0, beta: 0, alpha: 0 });

  const handleOrientation = React.useCallback(
    ({ alpha, beta, gamma }: DeviceOrientationEvent) => {
      const format = (n: number | null) =>
        Number.parseFloat((n ?? 0).toFixed(2));

      setOr({
        alpha: format(alpha),
        beta: format(beta),
        gamma: format(gamma),
      });
    },
    []
  );

  const isLandscape = window.matchMedia("(orientation: landscape)").matches;

  const isInHand = React.useMemo(() => {
    if (isLandscape) {
      return or.gamma < -35 && or.gamma > -90;
    }

    return or.beta > 30 && or.beta < 90;
  }, [isLandscape, or.beta, or.gamma]);

  React.useEffect(() => {
    if (
      //figure out type
      (DeviceOrientationEvent as any)?.requestPermission
    ) {
      Promise.all([
        //figure out type
        (DeviceOrientationEvent as any).requestPermission(),
      ]).then((results) => {
        if (results.every((result: string) => result === "granted")) {
          window.addEventListener("deviceorientation", handleOrientation);
        }
      });
    } else {
      window.addEventListener("deviceorientation", handleOrientation);
    }
  }, [handleOrientation]);

  React.useEffect(() => {
    window.addEventListener("deviceorientation", handleOrientation);

    return () =>
      window.removeEventListener("deviceorientation", handleOrientation);
  }, [handleOrientation]);

  const swipeState = React.useMemo(() => {
    const swipeOffset = 15;
    if (or?.[isLandscape ? "beta" : "gamma"] > swipeOffset) {
      return "right";
    }
    if (or?.[isLandscape ? "beta" : "gamma"] < -swipeOffset) {
      return "left";
    }

    return "default";
  }, [isLandscape, or]);

  React.useEffect(() => {
    if (isInHand) {
      if (swipeState === "right") {
        window.dispatchEvent(
          new CustomEvent("gestureSwipe", {
            detail: {
              dir: "right",
            },
          })
        );
      } else if (swipeState === "left") {
        window.dispatchEvent(
          new CustomEvent("gestureSwipe", {
            detail: {
              dir: "left",
            },
          })
        );
      }
    }
  }, [isInHand, swipeState]);

  return { ...or, isLandscape, isInHand, swipeState };
};
