import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { Bell, User } from 'lucide-react';
import { useState } from 'react';
import { logout } from '../store/authSlice';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

interface HeaderProps {
  title: string;
  isAdminPanel: boolean;
}

const Header: React.FC<HeaderProps> = ({ title, isAdminPanel }) => {
  const user = useSelector((state: RootState) => state.auth.user) as User | null;
  const notifications = useSelector((state: RootState) => state.notification.notifications);
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const notificationsCount = notifications.filter(notification => !notification.read).length;

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const handleLogout = async () => {
    console.log('User  logged out');
    await dispatch(logout());
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-md py-4 px-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
        <div className="flex items-center space-x-4">
          <button
            className="relative text-gray-600 hover:text-gray-800"
            aria-label="Notifications"
          >
            <Bell size={20} />
            {notificationsCount > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1">
                {notificationsCount}
              </span>
            )}
          </button>
          <div className="relative">
            <button
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
              onClick={toggleDropdown}
              aria-label="User  menu"
            >
              <User  size={20} />
              <span className="text-gray-800">{user?.name || 'Guest'}</span>
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                <ul className="py-1">
                  {isAdminPanel ? (
                    <>
                      <li>
                        <a
                          href="/admin/profile"
                          className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                        >
                          Admin Profile
                        </a>
                      </li>
                      <li>
                        <a
                          href="/admin/settings"
                          className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                        >
                          Admin Settings
                        </a>
                      </li>
                    </>
                  ) : (
                    <>
                      <li>
                        <a
                          href="/user/profile"
                          className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                        >
                          User Profile
                        </a>
                      </li>
                      <li>
                        <a
                          href="/user/settings"
                          className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                        >
                          User Settings
                        </a>
                      </li>
                    </>
                  )}
                  <li>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;