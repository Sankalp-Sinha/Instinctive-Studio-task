// components/Navbar.js
import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
  return (
    <nav className="bg-gray-800 text-white p-4 flex items-center justify-between shadow-lg">
      <div className="flex items-center space-x-2">
        
        <div className="text-xl font-bold border border-blue-500 p-1">MANDLACX</div>
      </div>

      
      <div className="flex space-x-8">
        <NavLink href="/" icon="📊" text="Dashboard" />
        <NavLink href="/" icon="📹" text="Cameras" />
        <NavLink href="/" icon="🎬" text="Scenes" />
        <NavLink href="/" icon="⚠️" text="Incidents" />
        <NavLink href="/" icon="👥" text="Users" />
      </div>

      <div className="flex items-center space-x-2">
        <div className="rounded-full bg-gray-600 w-8 h-8 flex items-center justify-center text-sm font-medium">
          S.S
          
        </div>
        <div className="text-right">
          <div className="font-medium text-sm">Sankalp Kumar Sinha</div>
          <div className="text-xs text-gray-400">sankalpsinha620@gmail.com</div>
        </div>
        <span className="text-gray-400 text-sm">&#9660;</span> 
      </div>
    </nav>
  );
}

function NavLink({ href, icon, text }) {
  return (
    <Link href={href} className="flex items-center space-x-2 text-gray-300 hover:text-white hover:bg-gray-700 px-3 py-2 rounded-md transition-colors duration-200">
      <span className="text-lg">{icon}</span> 
      <span>{text}</span>
    </Link>
  );
}