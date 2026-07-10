const signaturePaths: readonly string[] = [];

export function Signature() {
  // A blank path list is intentional. It prevents a fake signature from reaching the site.
  if (signaturePaths.length === 0) {
    return null;
  }

  return (
    <svg
      viewBox="0 0 480 160"
      role="img"
      aria-label="Stephen Lajuwomi signature"
      className="ml-auto h-auto w-56 text-stone-700 dark:text-stone-300"
    >
      {signaturePaths.map((path, index) => (
        <path
          key={`${index}-${path.slice(0, 12)}`}
          d={path}
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="3"
        />
      ))}
    </svg>
  );
}
