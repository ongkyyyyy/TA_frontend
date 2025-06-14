/* eslint-disable react/prop-types */
import { useState } from "react";
import { CgClose } from "react-icons/cg";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronRight } from "lucide-react";
import menuItems from "./menuItems";

function MobileSidebar({ mobileSidebar, toggleMobileSidebar, setConfirmLogout }) {
  const [openMenus, setOpenMenus] = useState({});

  const toggleMenu = (name) => {
    setOpenMenus((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <div
      className={`fixed top-0 ${mobileSidebar ? "left-0" : "-left-full"} 
      md:hidden w-64 max-w-xs h-screen bg-white transition-all duration-300 
      z-50 shadow-lg border-r border-gray-200`}
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-primary">Hotel Analytics</h2>
        <CgClose
          className="h-6 w-6 text-primary cursor-pointer"
          onClick={toggleMobileSidebar}
        />
      </div>
      <nav className="px-4 py-4">
        <ul className="space-y-1">
          {menuItems.map(({ name, icon: Icon, route, subItems }) => (
            <li key={name}>
              <div
                className="flex items-center justify-between w-full rounded-lg cursor-pointer transition"
                onClick={() => subItems && toggleMenu(name)}
              >
                {name === "Log Out" ? (
                  <button
                    onClick={() => {
                      toggleMobileSidebar();
                      setConfirmLogout(true);
                    }}
                    className="flex items-center gap-3 w-full px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition rounded-lg"
                  >
                    <Icon className="h-5 w-5 text-primary" />
                    <span>{name}</span>
                  </button>
                ) : (
                  <Link
                    to={route || "#"}
                    onClick={toggleMobileSidebar}
                    className="flex items-center gap-3 w-full px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition rounded-lg"
                  >
                    <Icon className="h-5 w-5 text-primary" />
                    <span>{name}</span>
                  </Link>
                )}

                {subItems && (
                  <ChevronDown
                    className={`h-4 w-4 text-gray-500 transition-transform ${
                      openMenus[name] ? "rotate-180" : ""
                    }`}
                  />
                )}
              </div>

              {subItems && openMenus[name] && (
                <ul className="ml-6 mt-1 space-y-1">
                  {subItems.map((subItem) => (
                    <li key={subItem.name}>
                      <Link
                        to={subItem.route}
                        onClick={toggleMobileSidebar}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm text-gray-600 hover:bg-gray-100 transition"
                      >
                        <ChevronRight className="h-4 w-4 text-primary" />
                        {subItem.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}

              {name === "Reviews and Sentiments" && (
                <div className="my-3 border-t border-gray-200" />
              )}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

export default MobileSidebar;
