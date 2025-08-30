'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useSession } from 'next-auth/react';

export function NewsTicker() {
  const { data: session } = useSession();
  const isAdmin = !!session?.user && (session.user as any).role === 'ADMIN';

  const [items, setItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [draftItems, setDraftItems] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await fetch('/api/content', { cache: 'no-store' });
        if (res.ok) {
          const json = await res.json();
          const data = json?.data;
          const list = Array.isArray(data?.breakingNews) ? data.breakingNews : [];
          if (mounted) {
            setItems(list);
          }
        } else {
          // fallback to defaults in UI if API fails
          if (mounted) {
            setItems([
              'Supreme Court declares Articles of Impeachment vs VP Sara Duterte as unconstitutional',
              'President Marcos addresses the nation on economic recovery plans',
              'Iglesia ni Cristo holds National Rally for Peace with 1.5 million attendees',
              'OFW remittances reach all-time high this quarter',
              'Renewable energy projects accelerate nationwide development',
              'Filipino scientists develop breakthrough cancer treatment',
              'Gilas Pilipinas prepares for FIBA World Cup qualifiers'
            ]);
          }
        }
      } catch (e) {
        if (mounted) {
          setItems([
            'Supreme Court declares Articles of Impeachment vs VP Sara Duterte as unconstitutional',
            'President Marcos addresses the nation on economic recovery plans',
            'Iglesia ni Cristo holds National Rally for Peace with 1.5 million attendees',
            'OFW remittances reach all-time high this quarter',
            'Renewable energy projects accelerate nationwide development',
            'Filipino scientists develop breakthrough cancer treatment',
            'Gilas Pilipinas prepares for FIBA World Cup qualifiers'
          ]);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (editMode) setDraftItems(items);
  }, [editMode, items]);

  const handleSave = async () => {
    try {
      setSaving(true);
      const clean = draftItems.map(s => s.trim()).filter(Boolean);
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ op: 'setBreakingNews', items: clean })
      });
      if (res.ok) {
        setItems(clean);
        setEditMode(false);
      }
    } finally {
      setSaving(false);
    }
  };

  const tickerItems = useMemo(() => (items.length ? items : [
    'Supreme Court declares Articles of Impeachment vs VP Sara Duterte as unconstitutional',
    'President Marcos addresses the nation on economic recovery plans',
    'Iglesia ni Cristo holds National Rally for Peace with 1.5 million attendees',
    'OFW remittances reach all-time high this quarter',
    'Renewable energy projects accelerate nationwide development',
    'Filipino scientists develop breakthrough cancer treatment',
    'Gilas Pilipinas prepares for FIBA World Cup qualifiers'
  ]), [items]);

  return (
    <>
      <style jsx global>{`
        @keyframes ticker-scroll {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .ticker-animation { animation: ticker-scroll 45s linear infinite; }
        .ticker-animation:hover { animation-play-state: paused; }
        .angled-edge { clip-path: polygon(0 0, calc(100% - 40px) 0, 100% 100%, 0 100%); }
      `}</style>
      <div className="bg-gray-300 dark:bg-gray-600 overflow-hidden h-12 flex items-center">
        {/* Breaking News Label with Angled Edge */}
        <div className="relative">
          <div className="bg-blue-500 dark:bg-blue-600 h-12 flex items-center px-6 pr-16 angled-edge">
            <span className="text-white font-bold text-sm uppercase tracking-wider whitespace-nowrap">
              Breaking News
            </span>
          </div>
        </div>

        {/* Ticker Content or Editor */}
        <div className="flex-1 overflow-hidden bg-gray-300 dark:bg-gray-600 h-12">
          {!editMode ? (
            <div className="flex items-center h-full ticker-animation">
              {tickerItems.map((item, index) => (
                <div key={index} className="flex items-center">
                  <span className="whitespace-nowrap text-black dark:text-white font-medium text-sm px-8">
                    {item}
                  </span>
                  <div className="w-1 h-1 bg-black/40 dark:bg-white/40 mx-4 flex-shrink-0"></div>
                </div>
              ))}
              {/* Duplicate for seamless loop */}
              {tickerItems.map((item, index) => (
                <div key={`duplicate-${index}`} className="flex items-center">
                  <span className="whitespace-nowrap text-black dark:text-white font-medium text-sm px-8">
                    {item}
                  </span>
                  <div className="w-1 h-1 bg-black/40 dark:bg-white/40 mx-4 flex-shrink-0"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-full flex items-center overflow-x-auto">
              <div className="flex items-center gap-4 px-4">
                {draftItems.map((val, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      value={val}
                      onChange={(e) => setDraftItems(di => di.map((v, i) => i === idx ? e.target.value : v))}
                      className="px-2 py-1 bg-white text-black"
                      style={{ borderRadius: 0 }}
                    />
                    <button
                      type="button"
                      className="px-2 py-1 bg-gray-200"
                      style={{ borderRadius: 0 }}
                      onClick={() => setDraftItems(di => di.filter((_, i) => i !== idx))}
                    >
                      remove
                    </button>
                  </div>
                ))}
                <button type="button" className="px-2 py-1 bg-black text-white" style={{ borderRadius: 0 }} onClick={() => setDraftItems(di => [...di, ''])}>
                  + add item
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Admin toolbar */}
        {isAdmin && (
          <div className="pl-2 pr-4 flex items-center gap-2">
            {!editMode ? (
              <button type="button" className="px-3 py-1 bg-black text-white" style={{ borderRadius: 0 }} onClick={() => setEditMode(true)}>
                Edit
              </button>
            ) : (
              <>
                <button type="button" className="px-3 py-1 bg-gray-200" style={{ borderRadius: 0 }} onClick={() => { setEditMode(false); setDraftItems(items); }}>
                  Cancel
                </button>
                <button type="button" className="px-3 py-1 bg-black text-white" style={{ borderRadius: 0 }} onClick={handleSave} disabled={saving}>
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
}