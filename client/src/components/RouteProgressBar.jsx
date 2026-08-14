import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

// A slim animated bar under the navbar that briefly appears on every route
// change, giving instant feedback that "something is happening" while the
// new page's data loads — similar to YouTube/GitHub's top loading bar.
export default function RouteProgressBar() {
  const location = useLocation();
  const [visible, setVisible] = useState(false);
  const [width, setWidth] = useState(0);
  const timers = useRef([]);

  useEffect(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];

    setVisible(true);
    setWidth(20);

    timers.current.push(setTimeout(() => setWidth(70), 100));
    timers.current.push(setTimeout(() => setWidth(90), 350));
    timers.current.push(setTimeout(() => {
      setWidth(100);
      timers.current.push(setTimeout(() => setVisible(false), 250));
    }, 550));

    return () => timers.current.forEach(clearTimeout);
  }, [location.pathname, location.search]);

  if (!visible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-0.5 bg-transparent">
      <div
        className="h-full bg-brand-500 transition-all duration-300 ease-out"
        style={{ width: `${width}%`, opacity: width === 100 ? 0 : 1 }}
      />
    </div>
  );
}
