const UserIcon = () => {
  return (
    <svg height={21} width={21} viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <circle cx='9' cy='7' r='3' stroke='white' stroke-width='2' fill='none' />
      <path d='M3 20c0-4 2.7-7 6-7s6 3 6 7' stroke='white' stroke-width='2' stroke-linecap='round' />

      <rect x='16' y='3' width='6' height='8' rx='1' stroke='white' stroke-width='1.5' fill='none' />
      <rect x='17.5' y='1' width='3' height='2' rx='0.5' stroke='white' stroke-width='1' fill='white' opacity='0.2' />
      <line x1='17.5' y1='5.5' x2='20.5' y2='5.5' stroke='white' stroke-width='1' stroke-linecap='round' />
      <line x1='17.5' y1='7' x2='20.5' y2='7' stroke='white' stroke-width='1' stroke-linecap='round' />
      <line x1='17.5' y1='8.5' x2='19.5' y2='8.5' stroke='white' stroke-width='1' stroke-linecap='round' />

      <rect x='16' y='13' width='2' height='4' rx='0.5' fill='white' opacity='0.7' />
      <rect x='18.5' y='15' width='2' height='2' rx='0.5' fill='white' opacity='0.5' />
      <rect x='21' y='14' width='2' height='3' rx='0.5' fill='white' opacity='0.6' />

      <path
        d='M14 12 Q15 11 16 12'
        stroke='white'
        stroke-width='1.5'
        stroke-linecap='round'
        fill='none'
        opacity='0.8'
      />

      <circle cx='15' cy='16' r='0.8' fill='white' opacity='0.4' />
      <circle cx='17' cy='18' r='0.8' fill='white' opacity='0.4' />
    </svg>
  );
};

export default UserIcon;
