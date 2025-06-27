function CustomLoader({ message = "" }: { message?: string }) {

  return (
    <div className={`flex justify-center items-center gap-2`}>
      <div className="animate-spin rounded-full size-6 border-b-2 border-t-2 border-black mr-2"></div>
      <span className="text-sm text-gray-500">{message}</span>
    </div>
  );
};

export default CustomLoader;
