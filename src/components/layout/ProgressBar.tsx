import React from "react";

interface ProgressBarProps {
  scrollProgress: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ scrollProgress }) => {
  return (
    <div
      className="fixed top-0 left-0 h-1 bg-gradient-to-r from-indigo-500 to-cyan-500 z-50 transition-all duration-300"
      style={{ width: `${scrollProgress}%` }}
    />
  );
};

export default ProgressBar;