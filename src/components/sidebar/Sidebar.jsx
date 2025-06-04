/* eslint-disable react/prop-types */
import { useLocation, Link } from "react-router-dom";
import { ChevronDown, ChevronRight } from "lucide-react";
import { CgMenuRight } from "react-icons/cg";
import Logo from "../../assets/images/Logo.png";
import menuItems from "./menuItems";

function Sidebar({ toggleMobileSidebar, setConfirmLogout }) {
  const location = useLocation();
  const isActive = (route) => location.pathname === route;

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-col w-64 bg-white h-full shadow-lg border-r border-gray-200 px-4 py-6">
        <Link to="/analytics" className="mb-8 flex items-center gap-2">
          <img src={Logo} alt="Logo" className="h-20" />
          <span className="text-xl font-bold text-primary">Hotel Analytics</span>
        </Link>

        <nav className="flex-1">
          <ul className="space-y-2">
            {menuItems.map(({ name, icon: Icon, route, subItems }) => (
              <li key={name}>
                {subItems ? (
                  <details className="group">
                    <summary className="flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 cursor-pointer list-none transition">
                      <div className="flex items-center gap-3">
                        <Icon className="h-5 w-5 text-primary" />
                        <span>{name}</span>
                      </div>
                      <ChevronDown className="h-4 w-4 group-open:rotate-180 transition-transform" />
                    </summary>
                    <ul className="ml-8 mt-2 space-y-1">
                      {subItems.map((subItem) => (
                        <li key={subItem.name}>
                          <Link
                            to={subItem.route}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm ${
                              isActive(subItem.route)
                                ? "bg-primary/10 text-primary"
                                : "text-gray-600 hover:bg-gray-100"
                            } transition`}
                          >
                            <ChevronRight className="h-4 w-4 text-primary" />
                            {subItem.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </details>
                ) : name === "Log Out" ? (
                  <button
                    onClick={() => setConfirmLogout(true)}
                    className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition text-left"
                  >
                    <Icon className="h-5 w-5 text-primary" />
                    <span>{name}</span>
                  </button>
                ) : (
                  <Link
                    to={route}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium ${
                      isActive(route)
                        ? "bg-primary/10 text-primary"
                        : "text-gray-700 hover:bg-gray-100"
                    } transition`}
                  >
                    <Icon className="h-5 w-5 text-primary" />
                    <span>{name}</span>
                  </Link>
                )}

                {name === "Reviews and Sentiments" && (
                  <div className="my-3 border-t border-gray-200" />
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Mobile Sidebar Toggle Button */}
      <CgMenuRight
        className="h-10 w-10 text-primary cursor-pointer md:hidden fixed top-4 left-4 p-2 bg-white shadow-md rounded-full transition-all duration-300 hover:bg-gray-100 active:scale-95 z-50"
        onClick={toggleMobileSidebar}
      />
    </>
  );
}

export default Sidebar;
