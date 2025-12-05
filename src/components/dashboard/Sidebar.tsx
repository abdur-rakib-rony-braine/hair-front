"use client";

import { useState } from "react";
import { Home, Calendar, MapPin, Store, ToolCase, Users, UserCog, Settings } from "lucide-react";
import Link from "next/link";
import LogoutDialog from "./LogoutDialog";
import { useMarket } from "@/providers/MarketProvider";

const sidebarItems = [
  { name: "Home", icon: Home, href: "/dashboard" },
  { name: "Appointments", icon: Calendar, href: "/dashboard/appointments" },
  { name: "Services", icon: ToolCase, href: "/dashboard/services" },
  { name: "Stations", icon: MapPin, href: "/dashboard/stations" },
  { name: "Shops", icon: Store, href: "/dashboard/shops" },
  { name: "Clients", icon: Users, href: "/dashboard/clients" },
  { name: "Staff", icon: UserCog, href: "/dashboard/staff" },
  { name: "Settings", icon: Settings, href: "/dashboard/settings" },
];

export default function Sidebar({ activePage }: { activePage?: string }) {
  const [active, setActive] = useState(activePage || "Home");
  const { market } = useMarket();

  const getMarketTextGradient = () => {
    switch (market) {
      case 'finland': return 'text-gradient-finland';
      case 'germany': return 'text-gradient-germany';
      case 'usa': return 'text-gradient-usa';
      default: return 'text-gradient-global';
    }
  };

  return (
    <aside className="w-64 bg-card border-r border-border flex flex-col">
      <div className="p-4 border-b border-border flex items-center justify-center">
        <h1 className={`text-xl font-bold ${getMarketTextGradient()}`}>
          Salon Pro
        </h1>
      </div>

      <div className="flex-1 flex flex-col px-2 py-4 space-y-1">
        {sidebarItems.map((item) => (
          <Link 
            key={item.name} 
            href={item.href} 
            onClick={() => setActive(item.name)}
            className={`
              group flex items-center w-full px-4 py-2 rounded-lg 
              text-muted-foreground hover:bg-accent hover:text-accent-foreground 
              transition-all duration-200
              ${active === item.name 
                ? "bg-primary text-primary-foreground font-semibold" 
                : ""
              }`}
          >
            <item.icon className="w-5 h-5 mr-3" />
            {item.name}
          </Link>
        ))}
      </div>

      <div className="p-4 border-t border-border">
        <LogoutDialog triggerVariant="outline" className="w-full" />
      </div>
    </aside>
  );
}