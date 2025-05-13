import {
    LayoutDashboard,
    LogOut,
  } from "lucide-react";
  import {
    MdMoney,
    MdComment,
    MdHotel,
  } from "react-icons/md";
  
  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard,route: "/analytics" },
    { name: "Hotels", icon: MdHotel, route: "/hotels" },
    { name: "Revenues", icon: MdMoney, route: "/revenues" },
    { name: "Reviews and Sentiments", icon: MdComment, route: "/reviews" },
    { name: "Log Out", icon: LogOut, route: "/logout" },
  ];
  
  export default menuItems;
  