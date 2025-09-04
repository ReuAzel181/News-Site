'use client';

import React from 'react';
import { NavigationItem } from './NavigationItem';
import { navigation } from './navigationConfig';

interface DesktopNavigationProps {
  onNavigationClick: (e: React.MouseEvent<HTMLAnchorElement>, href: string) => void;
  activeSection?: string;
}

export function DesktopNavigation({ onNavigationClick, activeSection }: DesktopNavigationProps) {
  return (
    <div className="hidden md:block">
      <div className="ml-10 flex items-baseline space-x-8" role="menubar">
        {navigation.map((item, index) => (
          <NavigationItem
            key={item.name}
            item={item}
            index={index}
            onClick={onNavigationClick}
            isActive={activeSection === item.href}
            variant="desktop"
          />
        ))}
      </div>
    </div>
  );
}