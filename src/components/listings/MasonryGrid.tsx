"use client";

import React, { useState, useEffect } from "react";

interface MasonryGridProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  keyExtractor: (item: T) => string | number;
}

export default function MasonryGrid<T>({ items, renderItem, keyExtractor }: MasonryGridProps<T>) {
  const [columnCount, setColumnCount] = useState(3);

  useEffect(() => {
    const updateColumns = () => {
      if (window.innerWidth >= 1024) {
        setColumnCount(3); // lg
      } else if (window.innerWidth >= 768) {
        setColumnCount(2); // md
      } else {
        setColumnCount(1); // sm/mobile
      }
    };

    // Initial check
    updateColumns();

    // Debounce resize listener for performance
    let timeoutId: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updateColumns, 100);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  // Split items into columns round-robin style
  const columns = Array.from({ length: columnCount }, () => [] as T[]);
  items.forEach((item, index) => {
    columns[index % columnCount].push(item);
  });

  return (
    <div className="flex w-full items-start gap-6">
      {columns.map((columnItems, colIndex) => (
        <div key={colIndex} className="flex flex-col gap-6 flex-1 min-w-0">
          {columnItems.map((item, indexInCol) => 
            // We pass the global index (or just let the caller handle it if they need it, 
            // but for animations, it's better if we give them a somewhat predictable index)
            renderItem(item, colIndex + indexInCol * columnCount)
          )}
        </div>
      ))}
    </div>
  );
}
