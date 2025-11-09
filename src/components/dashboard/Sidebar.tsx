"use client";

import { useState } from "react";
import { Home, Calendar, MapPin, Store, ToolCase } from "lucide-react";
import Link from "next/link";
import LogoutDialog from "./LogoutDialog";

const sidebarItems = [
  { name: "Home", icon: Home, href: "/dashboard" },
  { name: "Appointments", icon: Calendar, href: "/dashboard/appointments" },
  { name: "Services", icon: ToolCase, href: "/dashboard/services" },
  { name: "Stations", icon: MapPin, href: "/dashboard/stations" },
  { name: "Shops", icon: Store, href: "/dashboard/shops" },
];

export default function Sidebar({ activePage }: { activePage?: string }) {
  const [active, setActive] = useState(activePage || "Home");

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200 flex items-center justify-center">
        <h1 className="text-xl font-bold text-purple-600">Salon Pro</h1>
      </div>

      <div className="flex-1 flex flex-col px-2 py-4 space-y-1">
        {sidebarItems.map((item) => (
          <Link key={item.name} href={item.href} onClick={() => setActive(item.name)} className={`group flex items-center w-full px-4 py-2 rounded-lg text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition ${active === item.name ? "bg-purple-100 text-purple-700 font-semibold" : ""
            }`}>

            <item.icon className="w-5 h-5 mr-3" />
            {item.name}
          </Link>
        ))}
      </div>

      <div className="p-4 border-t border-gray-200">
        <LogoutDialog triggerVariant="outline" className="w-full cursor-pointer"/>
      </div>
    </aside>
  );
}
