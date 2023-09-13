export default function LoaderComponent({ className }: { className?: string }) {
    return (
      <div className={`loader bg-white dark:bg-gray-900`}>
        <div className={`circle ${className}`}></div>
      </div>
    );
  }
