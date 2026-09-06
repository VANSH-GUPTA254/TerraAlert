'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ShieldAlert,
  LayoutDashboard,
  Map,
  Brain,
  Bell,
  BarChart3,
  Camera,
  Settings,
  PhoneCall,
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();

  // Hide sidebar on Login & Register pages
  const authPages = ['/login', '/register'];

  if (authPages.includes(pathname)) {
    return null;
  }

  const links = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'GIS Map',
      href: '/gis-map',
      icon: Map,
    },
    {
      name: 'AI Prediction',
      href: '/predict',
      icon: Brain,
    },
    {
      name: 'Citizen Reports',
      href: '/report',
      icon: Camera,
    },
    {
      name: 'Alerts',
      href: '/alerts',
      icon: Bell,
    },
    {
      name: 'Analytics',
      href: '/analytics',
      icon: BarChart3,
    },
    {
      name: 'Operations HQ',
      href: '/admin',
      icon: Settings,
    },
  ];

  return (
    <aside className="w-72 h-screen fixed left-0 top-0 bg-white border-r z-50 flex flex-col">

      {/* Logo */}
      <div className="p-6 border-b">
        <div className="flex items-center gap-3">

          <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white">
            <ShieldAlert className="w-6 h-6" />
          </div>

          <div>
            <h1 className="text-2xl font-black">
              Terra<span className="text-blue-600">Alert</span>
            </h1>

            <p className="text-xs text-slate-500">
              Early Warning System
            </p>
          </div>

        </div>
      </div>

      {/* Menu */}
      <div className="flex-1 p-4 overflow-y-auto">

        <div className="space-y-2">
          {links.map((item) => {
            const Icon = item.icon;

            const active =
              pathname === item.href ||
              (item.href !== '/' && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                  active
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </div>

      </div>

      {/* Bottom */}
      <div className="p-4 border-t">

        <div className="bg-slate-50 rounded-xl p-3 mb-3">
          <p className="text-xs text-slate-500">
            Active Role
          </p>

          <p className="font-semibold">
            Disaster Officer
          </p>
        </div>

        <a
          href="tel:1070"
          className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white rounded-xl py-3 font-bold transition"
        >
          <PhoneCall className="w-4 h-4" />
          SOS 1070
        </a>

      </div>

    </aside>
  );
}