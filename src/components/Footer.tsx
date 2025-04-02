
import React from 'react';

const Footer = () => {
  return (
    <footer className="mt-12 text-center text-gray-500 text-sm p-4">
      <p>© {new Date().getFullYear()} Converter App</p>
      <p className="text-xs mt-1">
        Currency rates are simulated for demonstration purposes
      </p>
    </footer>
  );
};

export default Footer;
