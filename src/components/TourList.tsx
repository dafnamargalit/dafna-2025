'use client';

import { useEffect, useRef } from "react";

export function TourList() {
  // Explicitly type the ref so TypeScript knows this refers to a div element
  const scriptRoot = useRef<HTMLDivElement | null>(null);

  // This is just your raw HTML + script string
  const script = `
   <div id="seated-55fdf2c0" data-artist-id="872057c8-95df-4195-929f-d96a39b8509d" data-css-version="3"></div><script src="https://widget.seated.com/app.js"></script>
  `;

  useEffect(() => {
    // If the div is not yet rendered, bail out
    if (!scriptRoot.current) return;

    // Create a DocumentFragment from the raw HTML/script
    const range = document.createRange();
    const documentFragment = range.createContextualFragment(script);

    // Clear any existing child nodes before inserting
    while (scriptRoot.current.firstChild) {
      scriptRoot.current.removeChild(scriptRoot.current.firstChild);
    }

    // Append the new fragment into our div
    scriptRoot.current.append(documentFragment);
  }, [script]);

  return <div ref={scriptRoot} />;
}
