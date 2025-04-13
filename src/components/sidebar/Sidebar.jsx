import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { MdSentimentSatisfiedAlt, MdMoney, MdComment } from "react-icons/md";
import MobileSidebar from "./MobileSidebar";
import { CgMenuRight } from "react-icons/cg";

import Logo from "../../assets/images/Logo.png";

const menuItems = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    subItems: [
      { name: "Analytics", route: "/analytics" },
      { name: "Reporting", route: "/reporting" },
    ],
  },
  { name: "Revenues", icon: MdMoney, route: "/revenues" },
  { name: "Reviews", icon: MdComment, route: "/reviews" },
  { name: "Sentiments", icon: MdSentimentSatisfiedAlt, route: "/sentiments" },
  { name: "Settings", icon: Settings, route: "/settings" },
  { name: "Log Out", icon: LogOut, route: "/logout" },
];

function Sidebar() {
  const location = useLocation(); 
  const [openMenus, setOpenMenus] = useState({});
  const [mobileSidebar, setMobileSidebar] = useState(false);

  const toggleMenu = (name) => {
    setOpenMenus((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const toggleMobileSidebar = () => {
    setMobileSidebar((prev) => !prev);
  };

  const isActive = (route) => location.pathname === route;

  return (
    <>
        <MobileSidebar
            mobileSidebar={mobileSidebar}
            toggleMobileSidebar={toggleMobileSidebar}
        />
        <div className="hidden md:flex flex-col w-64 bg-white h-full shadow-lg border-r border-gray-200 px-4 py-6">
        <Link to="/" className="mb-8 flex items-center gap-2">
          <img src={Logo} alt="Logo" className="h-20" />
          <span className="text-xl font-bold text-primary">Hotel Analytics</span>
        </Link>

        <nav className="flex-1">
          <ul className="space-y-2">
            {menuItems.map(({ name, icon: Icon, route, subItems }) => {
              const isSubMenuOpen = openMenus[name];
              const hasSubItems = !!subItems;

              return (
                <li key={name}>
                  {hasSubItems ? (
                    <>
                      <button
                        onClick={() => toggleMenu(name)}
                        className="flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="h-5 w-5 text-primary" />
                          <span>{name}</span>
                        </div>
                        <ChevronDown
                          className={`h-4 w-4 transition-transform ${
                            isSubMenuOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {isSubMenuOpen && (
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
                      )}
                    </>
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

                  {name === "Sentiments" && (
                    <div className="my-3 border-t border-gray-200"></div>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
      <CgMenuRight
        className="h-10 w-10 text-primary cursor-pointer md:hidden fixed top-4 left-4 p-2 bg-white shadow-md rounded-full transition-all duration-300 hover:bg-gray-100 active:scale-95"
        onClick={toggleMobileSidebar}
        />
    </>
  );
}

export default Sidebar;
