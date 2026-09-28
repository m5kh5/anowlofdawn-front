import React from 'react';

const Watermark = ({ text = "Protected Content" }) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden flex flex-wrap justify-between items-center opacity-15 select-none">
      {Array.from({ length: 16 }).map((_, index) => (
        <div
          key={index}
          className="text-gray-900 font-bold text-xl transform -rotate-45 p-8 whitespace-nowrap"
        >
          {text}
        </div>
      ))}
    </div>
  );
};

export default Watermark;