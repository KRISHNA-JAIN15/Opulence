import { Link } from "react-router-dom";
import { Instagram, Facebook, Twitter, Mail, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-black text-white mt-auto">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Account */}
          <div>
            <h3 className="text-base font-black mb-6 uppercase tracking-wider">Account</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/login" className="text-gray-300 hover:text-white transition text-sm">
                  Sign in
                </Link>
              </li>
              <li>
                <Link to="/orders" className="text-gray-300 hover:text-white transition text-sm">
                  My orders
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-gray-300 hover:text-white transition text-sm">
                  Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-base font-black mb-6 uppercase tracking-wider">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-gray-300 hover:text-white transition text-sm">
                  Who we are
                </Link>
              </li>
              <li>
                <Link to="/brands" className="text-gray-300 hover:text-white transition text-sm">
                  Our brands
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-300 hover:text-white transition text-sm">
                  Terms and conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h3 className="text-base font-black mb-6 uppercase tracking-wider">Help</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/shipping" className="text-gray-300 hover:text-white transition text-sm">
                  How to place an order
                </Link>
              </li>
              <li>
                <Link to="/returns" className="text-gray-300 hover:text-white transition text-sm">
                  Delivery and return times
                </Link>
              </li>
              <li>
                <Link to="/payments" className="text-gray-300 hover:text-white transition text-sm">
                  Payments
                </Link>
              </li>
            </ul>
          </div>

          {/* Contacts */}
          <div>
            <h3 className="text-base font-black mb-6 uppercase tracking-wider">Contacts</h3>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center space-x-3 text-sm">
                <Phone size={18} />
                <span className="text-gray-300">(+91) 123 456 7890</span>
              </li>
              <li className="flex items-center space-x-3 text-sm">
                <Mail size={18} />
                <span className="text-gray-300">info@opulence.com</span>
              </li>
            </ul>
            <div>
              <h4 className="font-bold mb-4 text-sm uppercase tracking-wider">Follow Us</h4>
              <div className="flex space-x-4">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gray-300 transition transform hover:scale-110"
                  aria-label="Instagram"
                >
                  <Instagram size={24} />
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gray-300 transition transform hover:scale-110"
                  aria-label="Facebook"
                >
                  <Facebook size={24} />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gray-300 transition transform hover:scale-110"
                  aria-label="Twitter"
                >
                  <Twitter size={24} />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
          <p>© 2024, Opulence. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
