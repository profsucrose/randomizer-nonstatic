// adapted from https://gist.github.com/DominicTobias/c8579667e8a8bd7817c1b4d5b274eb4c

import { useRef, useCallback, useEffect, useState } from "react";

export default function useResizeObserver() {
  const [size, setSize] = useState({ width: 0, height: 0 });
  const resizeObserver = useRef<ResizeObserver | null>(null);

  const onResize = useCallback((entries) => {
    const { width, height } = entries[0].contentRect;
    setSize({ width, height });
  }, []);

  const ref = useCallback(
    (node) => {
      if (node !== null) {
        if (resizeObserver.current) {
          resizeObserver.current.disconnect();
        }
        resizeObserver.current = new ResizeObserver(onResize);
        resizeObserver.current.observe(node);
      }
    },
    [onResize]
  );

  useEffect(
    () => () => {
      resizeObserver.current?.disconnect();
    },
    []
  );

  return { ref, width: size.width, height: size.height };
}
