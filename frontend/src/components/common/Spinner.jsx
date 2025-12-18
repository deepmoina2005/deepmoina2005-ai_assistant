import React from "react";

const Spinner = () => {
  return (
    <div className="flex items-center justify-center p-8">
      <svg
        className="w-8 h-8 text-[#00d492] animate-spin"
        viewBox="0 0 100 101"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="3"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591V91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908H100Z"
        />
      </svg>
    </div>
  );
};

export default Spinner;
