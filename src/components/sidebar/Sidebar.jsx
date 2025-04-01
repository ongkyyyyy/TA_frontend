import { useState } from "react";
import {
  LayoutDashboard,
  ShoppingCart,
  Mail,
  User,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

const menuItems = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    subItems: [
      { name: "Analytics" },
      { name: "Reporting" },
    ],
  },
  { name: "E-Commerce", icon: ShoppingCart },
  { name: "Inbox", icon: Mail, badge: 14 },
  { name: "Profile", icon: User },
  { name: "Settings", icon: Settings },
  { name: "Log Out", icon: LogOut },
];

function Sidebar() {
  const [openMenus, setOpenMenus] = useState({});

  const toggleMenu = (name) => {
    setOpenMenus((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <div className="h-screen w-full max-w-80 bg-white p-4 shadow-lg rounded-lg">
      <h2 className="mb-4 text-xl font-bold text-primary">Sidebar</h2>
      <nav>
        <ul className="space-y-2">
          {menuItems.map(({ name, icon: Icon, badge, subItems }) => (
            <li key={name}>
              <div
                className="relative flex items-center justify-between gap-3 p-3 rounded-lg cursor-pointer transition-all hover:bg-gray-100"
                onClick={() => subItems && toggleMenu(name)}
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-5 w-5 text-primary" />
                  <span className="font-semibold text-primary">{name}</span>
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
                    <li
                      key={subItem.name}
                      className="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all hover:bg-gray-100"
                    >
                      <ChevronRight className="h-4 w-4 text-primary" />
                      <span className="text-primary">{subItem.name}</span>
                    </li>
                  ))}
                </ul>
              )}
              {name === "E-Commerce" && <div className="my-2 border-t border-gray-300"></div>}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

export default Sidebar;