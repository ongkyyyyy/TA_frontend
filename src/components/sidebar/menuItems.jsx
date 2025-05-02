import {
    LayoutDashboard,
    Settings,
    LogOut,
  } from "lucide-react";
  import {
    MdMoney,
    MdComment,
    MdHotel,
    MdWebStories,
  } from "react-icons/md";
  
  const menuItems = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      subItems: [
        { name: "Analytics", route: "/analytics" },
        { name: "Reporting", route: "/reporting" },
      ],
    },
    { name: "Hotels", icon: MdHotel, route: "/hotels" },
    { name: "Revenues", icon: MdMoney, route: "/revenues" },
    { name: "Reviews and Sentiments", icon: MdComment, route: "/reviews" },
    { name: "Scraping", icon: MdWebStories, route: "/scraping" },
    { name: "Settings", icon: Settings, route: "/settings" },
    { name: "Log Out", icon: LogOut, route: "/logout" },
  ];
  
  export default menuItems;
  