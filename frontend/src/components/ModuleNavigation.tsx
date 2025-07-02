'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  BarChart3, 
  Home, 
  Shield, 
  Store, 
  Hotel, 
  Leaf,
  MapPin 
} from 'lucide-react';

interface ModuleNavProps {
  className?: string;
}

const modules = [
  { id: 'overview', name: 'Overview', icon: BarChart3, href: '/dashboard' },
  { id: 'real-estate', name: 'Imobiliário', icon: Home, href: '/modules/real-estate' },
  { id: 'security', name: 'Segurança', icon: Shield, href: '/modules/security' },
  { id: 'infrastructure', name: 'Infraestrutura', icon: Store, href: '/modules/infrastructure' },
  { id: 'hospitality', name: 'Hospedagem', icon: Hotel, href: '/modules/hospitality' },
  { id: 'environmental', name: 'Ambiental', icon: Leaf, href: '/modules/environmental' },
];

export default function ModuleNavigation({ className = '' }: ModuleNavProps) {
  const pathname = usePathname();

  return (
    <nav className={`bg-white border-b border-gray-200 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <MapPin className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">LocationIQ Pro</h1>
              <p className="text-xs text-gray-500">Análise Inteligente de Localização</p>
            </div>
          </Link>
          
          {/* Module Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {modules.map((module) => {
              const Icon = module.icon;
              const isActive = pathname === module.href;
              
              return (
                <Link
                  key={module.id}
                  href={module.href}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors
                    ${isActive 
                      ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }
                  `}
                >
                  <Icon className="h-4 w-4" />
                  <span>{module.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Mobile menu button - pode ser expandido depois */}
          <div className="md:hidden">
            <button className="text-gray-600 hover:text-gray-900">
              <BarChart3 className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-gray-200">
          <div className="flex overflow-x-auto py-2 space-x-1">
            {modules.map((module) => {
              const Icon = module.icon;
              const isActive = pathname === module.href;
              
              return (
                <Link
                  key={module.id}
                  href={module.href}
                  className={`
                    flex flex-col items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors min-w-0
                    ${isActive 
                      ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }
                  `}
                >
                  <Icon className="h-4 w-4" />
                  <span>{module.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
