import React from 'react';

export const LoadingSpinner = ({ fullScreen = false, size = 'md', message = 'Loading...' }) => {
  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        className={`${sizeClasses[size] || sizeClasses.md} border-orange-500 border-t-transparent rounded-full animate-spin`}
      />
      {message && <p className="text-sm font-medium text-slate-600">{message}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
        {spinner}
      </div>
    );
  }

  return <div className="py-12 flex justify-center">{spinner}</div>;
};

export const ProductSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-4 animate-pulse shadow-sm">
      <div className="w-full h-48 bg-slate-200 rounded-xl mb-4" />
      <div className="h-4 bg-slate-200 rounded w-1/3 mb-2" />
      <div className="h-6 bg-slate-200 rounded w-3/4 mb-3" />
      <div className="h-4 bg-slate-200 rounded w-full mb-4" />
      <div className="flex items-center justify-between pt-2">
        <div className="h-7 bg-slate-200 rounded w-1/3" />
        <div className="h-10 bg-slate-200 rounded-xl w-28" />
      </div>
    </div>
  );
};

export default LoadingSpinner;
