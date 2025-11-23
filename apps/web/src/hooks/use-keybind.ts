import { useCallback, useEffect } from "react";

export function useEventListener<T extends keyof GlobalEventHandlersEventMap>(
  event: T,
  callback: (event: GlobalEventHandlersEventMap[T]) => unknown
) {
  const handleEvent = useCallback(
    (event: GlobalEventHandlersEventMap[T]) => {
      callback(event);
    },
    [callback]
  );

  useEffect(() => {
    window.addEventListener(event, handleEvent);
    return () => window.removeEventListener(event, handleEvent);
  }, [event, handleEvent]);
}
