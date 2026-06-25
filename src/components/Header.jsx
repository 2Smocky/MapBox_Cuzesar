import React from 'react';

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 h-20 bg-[#ff0000] shadow-md z-50 flex items-center px-30">
      <img
        src="/logo-cusezar.svg"
        alt="Cusezar Logo"
        className="h-7 object-contain"
      />
    </header>
  );
};

export default Header;
