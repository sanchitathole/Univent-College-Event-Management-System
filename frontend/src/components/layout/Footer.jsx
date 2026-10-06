import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Univent</h3>
            <p className="text-gray-400">
              Univent is a college event management platform designed for Shah &amp; Anchor Kutchhi Engineering College, Chembur, enabling students to discover, register for, and participate in college events.
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/home" className="hover:text-white transition">Home</Link></li>
              <li><Link to="/events" className="hover:text-white transition">Events</Link></li>
              <li><Link to="/leaderboard" className="hover:text-white transition">Leaderboard</Link></li>
              <li><Link to="/announcements" className="hover:text-white transition">Announcements</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Contact</h3>
            <ul className="space-y-2 text-gray-400">
              <li>Shah &amp; Anchor Kutchhi Engineering College</li>
              <li>Chembur, Mumbai, Maharashtra</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
          <p>&copy; {currentYear} Univent. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;