"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const DrawerMenu = () => {
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Challenge", path: "/challenge" },
  ];

  return (
    <aside className="w-60 bg-gray-900 text-white p-6">
      <h2 className="text-xl font-bold mb-4">📊 메뉴</h2>
      <ul className="space-y-3">
        {menuItems.map((item) => (
          <li key={item.path}>
            <Link
              href={item.path}
              className={`block px-2 py-1 rounded ${
                pathname === item.path
                  ? "bg-gray-700 font-semibold"
                  : "hover:bg-gray-800"
              }`}
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default DrawerMenu;
