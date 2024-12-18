export const UserIcon = ({ isActive }: { isActive: boolean }) => {
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 21 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10.5 17.75C14.6421 17.75 18 14.3921 18 10.25C18 6.10786 14.6421 2.75 10.5 2.75C6.35786 2.75 3 6.10786 3 10.25C3 14.3921 6.35786 17.75 10.5 17.75Z"
        stroke={isActive ? "#C45EC6" : "#DADADA"}
        strokeWidth="0.925781"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.5 12.75C12.2259 12.75 13.625 11.3509 13.625 9.625C13.625 7.89911 12.2259 6.5 10.5 6.5C8.77411 6.5 7.375 7.89911 7.375 9.625C7.375 11.3509 8.77411 12.75 10.5 12.75Z"
        stroke={isActive ? "#C45EC6" : "#DADADA"}
        strokeWidth="0.925781"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.48413 15.8281C5.95437 14.9019 6.67191 14.124 7.55721 13.5806C8.44251 13.0372 9.46099 12.7495 10.4998 12.7495C11.5385 12.7495 12.557 13.0372 13.4423 13.5806C14.3276 14.124 15.0451 14.9019 15.5154 15.8281"
        stroke={isActive ? "#C45EC6" : "#DADADA"}
        strokeWidth="0.925781"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
