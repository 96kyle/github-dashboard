"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaGithub } from "react-icons/fa";
import { FaChartSimple } from "react-icons/fa6";
import { FaFireFlameSimple } from "react-icons/fa6";

const DrawerMenu = () => {
  const pathname = usePathname();

  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <FaChartSimple size={20} />,
    },
    {
      name: "Challenge",
      path: "/challenge",
      icon: <FaFireFlameSimple size={20} />,
    },
  ];

  return (
    <div className="w-[330px] bg-[#f4f5ff] text-fontNavy py-2 px-4 border-r-2 border-gray-300">
      <div className="flex flex-row items-center">
        <FaGithub size={32} color="black" className="mr-2" />
        <div className="text-2xl font-bold py-2">Github Dashboard</div>
      </div>
      <ul className="py-6">
        {menuItems.map((item) => (
          <li key={item.path}>
            <Link
              href={item.path}
              className={`block px-2 py-3 rounded text-base ${
                pathname === item.path
                  ? "bg-gray-700 font-bold text-white"
                  : "hover:bg-gray-200 font-semibold text-fontGrey"
              }`}
            >
              <div className="flex flex-row items-center gap-2">
                {item.icon}
                {item.name}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DrawerMenu;
