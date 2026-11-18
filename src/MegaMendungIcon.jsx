import React from 'react';

// SVG Megamendung Logo (Komponen bersama Admin & Siswa)
const MegaMendungIcon = ({ size = 1, shadow = false }) => (
  <svg
    width={40 * size}
    height={24 * size}
    viewBox="0 0 60 35"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={shadow ? { filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.3))' } : undefined}
  >
    <path d="M10 25C10 20 15 15 22 15C25 10 32 8 40 12C46 8 55 12 55 18C58 20 58 25 55 27C20 30 10 28 10 25Z" fill="#8B4513" opacity="0.4" />
    <path d="M5 28C5 22 11 17 19 17C23 11 30 9 38 13C44 9 52 13 52 19C56 22 55 27 51 29C44 32 25 32 5 28Z" fill="#E6C280" />
    <path d="M15 28C15 24 19 21 24 21C27 17 32 16 37 18C41 16 46 18 46 22C49 24 48 27 45 28C40 30 25 30 15 28Z" fill="#5C2C16" />
  </svg>
);

export default MegaMendungIcon;