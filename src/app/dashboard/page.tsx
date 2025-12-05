"use client";

import { useMarket } from "@/providers/MarketProvider";

export default function DashboardPage() {
  const { locale } = useMarket();

  const getLocalizedText = () => {
    if (locale === 'fi') {
      return {
        welcome: 'Tervetuloa kojelaudalle',
        overview: 'Hallinnoi varauksia, asiakkaita ja muuta.',
        statistics: 'Tilastot',
        recentActivity: 'Viimeaikainen toiminta',
        quickActions: 'Pikatoiminnot',
      };
    }
    if (locale === 'de') {
      return {
        welcome: 'Willkommen bei Ihrem Dashboard',
        overview: 'Verwalten Sie Termine, Kunden und mehr.',
        statistics: 'Statistiken',
        recentActivity: 'Letzte Aktivitäten',
        quickActions: 'Schnellaktionen',
      };
    }
    return {
      welcome: 'Welcome to Your Dashboard',
      overview: 'Manage your appointments, clients, and more.',
      statistics: 'Statistics',
      recentActivity: 'Recent Activity',
      quickActions: 'Quick Actions',
    };
  };

  const localized = getLocalizedText();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 text-foreground">
        {localized.welcome}
      </h1>
      <p className="text-muted-foreground">
        {localized.overview}
      </p>
      
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card p-4 rounded-lg border">
          <h3 className="font-semibold mb-2">{localized.statistics}</h3>
          <p className="text-sm text-muted-foreground">Your business stats here</p>
        </div>
        
        <div className="bg-card p-4 rounded-lg border">
          <h3 className="font-semibold mb-2">{localized.recentActivity}</h3>
          <p className="text-sm text-muted-foreground">Recent activities here</p>
        </div>
        
        <div className="bg-card p-4 rounded-lg border">
          <h3 className="font-semibold mb-2">{localized.quickActions}</h3>
          <p className="text-sm text-muted-foreground">Quick actions here</p>
        </div>
      </div>
    </div>
  );
}