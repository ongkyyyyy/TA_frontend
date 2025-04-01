import { useState } from "react";
import {
  LayoutDashboard,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { FaMoneyBillTransfer } from "react-icons/fa6";
import { MdReviews, MdSentimentSatisfiedAlt } from "react-icons/md";
import { Link } from "react-router-dom";

const menuItems = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    subItems: [
      { name: "Analytics", route: "/analytics" },
      { name: "Reporting", route: "/reporting" },
    ],
  },
  { name: "Revenues", icon: FaMoneyBillTransfer, route: "/revenues" },
  { name: "Reviews", icon: MdReviews, route: "/reviews" },
  { name: "Sentiments", icon: MdSentimentSatisfiedAlt, route: "/sentiments" },
//   { name: "Profile", icon: User, route: "/profile" },
  { name: "Settings", icon: Settings, route: "/settings" },
  { name: "Log Out", icon: LogOut, route: "/logout" },
];

function Sidebar() {
  const [openMenus, setOpenMenus] = useState({});

  const toggleMenu = (name) => {
    setOpenMenus((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <div className="h-full w-full max-w-80 bg-white p-4 shadow-lg rounded-lg overflow-y-auto">
      <h2 className="mb-4 text-xl font-bold text-primary">Sidebar</h2>
      <nav>
        <ul className="space-y-2">
          {menuItems.map(({ name, icon: Icon, badge, route, subItems }) => (
            <li key={name}>
              <div
                className="relative flex items-center justify-between gap-3 p-3 rounded-lg cursor-pointer transition-all hover:bg-gray-100"
                onClick={() => subItems && toggleMenu(name)}
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-5 w-5 text-primary" />
                  <Link to={route || "#"} className="font-semibold text-primary">
                    {name}
                  </Link>
                </div>
                {badge && (
                  <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-gray-200 text-xs font-medium text-primary">
                    {badge}
                  </span>
                )}
                {subItems && (
                  <ChevronDown
                    className={`h-4 w-4 text-gray-600 transition-transform ${openMenus[name] ? "rotate-180" : ""}`}
                  />
                )}
              </div>
              {subItems && openMenus[name] && (
                <ul className="pl-8 space-y-1">
                  {subItems.map((subItem) => (
                    <li key={subItem.name}>
                      <Link
                        to={subItem.route}
                        className="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all hover:bg-gray-100"
                      >
                        <ChevronRight className="h-4 w-4 text-primary" />
                        <span className="text-primary">{subItem.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
              {name === "Sentiments" && <div className="my-2 border-t border-gray-300"></div>}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

export default Sidebar;
