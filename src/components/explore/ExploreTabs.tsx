'use client';

import type { LucideIcon } from 'lucide-react';

import { cn } from '@/lib/utils/cn';

export interface ExploreTab<T extends string> {
  id: T;
  label: string;
  icon: LucideIcon;
  count: number;
}

interface ExploreTabsProps<T extends string> {
  tabs: ExploreTab<T>[];
  activeTab: T;
  onTabChange: (tab: T) => void;
}

export default function ExploreTabs<T extends string>({ tabs, activeTab, onTabChange }: ExploreTabsProps<T>) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 mb-4 md:mb-8">
      {/* Mobile: Segmented Control Style */}
      <div className="md:hidden p-1.5">
        <div className="flex gap-1.5 bg-gray-100 rounded-xl p-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  'flex-1 relative px-3 py-2.5 rounded-lg font-medium text-sm transition-all duration-200',
                  isActive
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-gray-600'
                )}
              >
                <div className="flex items-center justify-center gap-2">
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  <span className={cn(
                    'text-xs px-1.5 py-0.5 rounded-full',
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'bg-gray-200 text-gray-600'
                  )}>
                    {tab.count}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Desktop: Original Design */}
      <div className="hidden md:block p-2">
        <div className="grid grid-cols-2 gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className="cursor-pointer relative"
              >
                <div
                  className={cn(
                    'relative flex items-center justify-center gap-3 px-4 py-4 rounded-xl font-medium transition-colors',
                    isActive
                      ? 'text-white'
                      : 'text-gray-600 hover:bg-gray-50'
                  )}
                >
                  {isActive && (
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary to-primary-dark shadow-lg" />
                  )}

                  <div className="relative flex items-center gap-3">
                    <div className={cn(
                      'w-10 h-10 rounded-lg items-center justify-center transition-all flex',
                      isActive ? 'bg-white/20' : 'bg-gray-100'
                    )}>
                      <Icon className={cn(
                        'w-5 h-5',
                        isActive ? 'text-white' : 'text-gray-600'
                      )} />
                    </div>

                    <div className="flex flex-col items-start">
                      <span className="text-sm font-semibold">
                        {tab.label}
                      </span>
                      <span
                        className={cn(
                          'text-xs',
                          isActive ? 'text-white/80' : 'text-gray-500'
                        )}
                      >
                        {tab.count} disponible{tab.count > 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
