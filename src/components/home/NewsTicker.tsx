'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Modal } from '@/components/ui/Modal';

export function NewsTicker() {
  const { data: session } = useSession();
  const isAdmin = !!session?.user && session.user.role === 'ADMIN';

  const [items, setItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [draftItems, setDraftItems] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  // For seamless fill: ensure at least one full viewport width in a half, then duplicate halves
  const containerRef = useRef<HTMLDivElement | null>(null);
  const halfRef = useRef<HTMLDivElement | null>(null);
  const [unitRepeats, setUnitRepeats] = useState(2);
  // Modal UI/UX state
  // const [showBulk, setShowBulk] = useState(false); // removed bulk edit
  // const [bulkText, setBulkText] = useState(''); // removed bulk edit

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
    if (isEditOpen) setDraftItems(items);
  }, [isEditOpen, items]);

  // Measure and ensure the half strip fills at least one full viewport width (no empty space)
  useEffect(() => {
    const measure = () => {
      const cw = containerRef.current?.clientWidth || 0;
      const hw = halfRef.current?.scrollWidth || 0;
      if (cw === 0 || hw === 0) return;
      if (hw < cw) {
        const needed = Math.ceil(cw / hw) + 1; // ensure strictly wider than container
        setUnitRepeats(prev => (needed > prev ? needed : prev));
      }
    };
    // Run after paint
    const id = window.requestAnimationFrame(measure);

    const handleResize = () => measure();
    window.addEventListener('resize', handleResize);
    return () => {
      window.cancelAnimationFrame(id);
      window.removeEventListener('resize', handleResize);
    };
  }, [items, unitRepeats]);

  const openEditor = () => {
    setDraftItems(items);
    setIsEditOpen(true);
  };

  const closeEditor = () => {
    setIsEditOpen(false);
    setDraftItems(items);
  };

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
        setIsEditOpen(false);
      }
    } finally {
      setSaving(false);
    }
  };

  const cleanDraft = useMemo(() => draftItems.map(s => s.trim()).filter(Boolean), [draftItems]);
  const canSave = cleanDraft.length > 0 && !saving;

  const moveItem = (from: number, to: number) => {
    setDraftItems((di) => {
      if (to < 0 || to >= di.length) return di;
      const copy = [...di];
      const [it] = copy.splice(from, 1);
      copy.splice(to, 0, it);
      return copy;
    });
  };


  const baseItems = useMemo(() => (items.length ? items : [
    'Supreme Court declares Articles of Impeachment vs VP Sara Duterte as unconstitutional',
    'President Marcos addresses the nation on economic recovery plans',
    'Iglesia ni Cristo holds National Rally for Peace with 1.5 million attendees',
    'OFW remittances reach all-time high this quarter',
    'Renewable energy projects accelerate nationwide development',
    'Filipino scientists develop breakthrough cancer treatment',
    'Gilas Pilipinas prepares for FIBA World Cup qualifiers'
  ]), [items]);

  const halfItems = useMemo(() => {
    const out: string[] = [];
    const reps = Math.max(2, unitRepeats);
    for (let i = 0; i < reps; i++) out.push(...baseItems);
    return out;
  }, [baseItems, unitRepeats]);

  return (
    <>
      <style jsx global>{`
        @keyframes ticker-scroll-flat { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .ticker-inner { animation: ticker-scroll-flat 45s linear infinite; will-change: transform; }
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

        {/* Ticker Content */}
        <div ref={containerRef} className="flex-1 overflow-hidden bg-gray-300 dark:bg-gray-600 h-12">
          <div className="h-full flex items-center">
            <div className="ticker-inner flex items-center h-full" style={{ width: 'max-content' }}>
              {/* Half A */}
              <div ref={halfRef} className="flex items-center">
                {halfItems.map((item, index) => (
                  <div key={`a-${index}`} className="flex items-center">
                    <span className="whitespace-nowrap text-black dark:text-white font-medium text-sm px-8">{item}</span>
                    <div className="w-1 h-1 bg-black/40 dark:bg-white/40 mx-4 flex-shrink-0" />
                  </div>
                ))}
              </div>
              {/* Half B (duplicate of A) */}
              <div className="flex items-center">
                {halfItems.map((item, index) => (
                  <div key={`b-${index}`} className="flex items-center">
                    <span className="whitespace-nowrap text-black dark:text-white font-medium text-sm px-8">{item}</span>
                    <div className="w-1 h-1 bg-black/40 dark:bg-white/40 mx-4 flex-shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Admin toolbar */}
        {isAdmin && (
          <div className="pl-2 pr-4 flex items-center gap-2">
            <button type="button" className="px-3 py-1 bg-blue-600 dark:bg-blue-600 text-white rounded-none focus:outline-none transition-none" style={{ borderRadius: 0 }} onClick={openEditor}>
              Edit
            </button>
          </div>
        )}
      </div>

      {/* Edit Modal - flat design */}
      <Modal isOpen={isEditOpen} onClose={closeEditor} size="xl" variant="flat">
        <div className="w-full" style={{ backgroundColor: 'var(--card)' }}>
          {/* Header (sticky) */}
          <div className="px-5 py-3 sticky top-0 z-10" style={{ backgroundColor: 'var(--background)' }}>
             <div className="flex items-center justify-between gap-4">
               <div>
                 <h3 className="text-base font-bold">Edit Breaking News</h3>
                 <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Short, punchy headlines work best. Keep it concise.</p>
               </div>
               <div className="flex items-center gap-2" />
             </div>
           </div>
            <div className="h-px bg-gray-200 dark:bg-gray-700" />

            {/* Body */}
            <div className="px-5 py-4 space-y-3">
                {draftItems.map((val, idx) => {
                  const isEmpty = !val.trim();
                  return (
                    <React.Fragment key={idx}>
                      {idx > 0 && <div className="h-px bg-gray-200 dark:bg-gray-700 w-full" />}
                      <div className="flex items-center gap-3 py-2">
                        {/* index chip */}
                        <div className="px-2 py-2 bg-gray-200 text-black text-xs select-none w-10 text-center">{String(idx + 1).padStart(2, '0')}</div>
                        <input
                          value={val}
                          placeholder="Enter headline..."
                          onChange={(e) => setDraftItems((di) => di.map((v, i) => (i === idx ? e.target.value : v)))}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey && idx === draftItems.length - 1 && val.trim()) {
                              e.preventDefault();
                              setDraftItems((di) => [...di, '']);
                            }
                          }}
                          className={`flex-1 px-2 py-2 bg-white text-black text-[16px] rounded-none shadow-none border-0 focus:outline-none focus:ring-0 ${isEmpty ? 'bg-red-50' : ''}`}
                          style={{ borderRadius: 0 }}
                        />
                        {/* reorder/remove controls */}
                        <div className="flex items-center gap-1">
                          <button type="button" aria-label="Move up" className="px-3 py-2 bg-gray-200 dark:bg-gray-700 text-black dark:text-white rounded-none focus:outline-none transition-none" onClick={() => moveItem(idx, idx - 1)}>↑</button>
                          <button type="button" aria-label="Move down" className="px-3 py-2 bg-gray-200 dark:bg-gray-700 text-black dark:text-white rounded-none focus:outline-none transition-none" onClick={() => moveItem(idx, idx + 1)}>↓</button>
                          <button
                            type="button"
                            aria-label="Remove item"
                            className="px-3 py-2 bg-red-600 dark:bg-red-500 text-white rounded-none focus:outline-none transition-none"
                            onClick={() => setDraftItems((di) => di.filter((_, i) => i !== idx))}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </React.Fragment>
                  );
                })}
                <div className="h-px bg-gray-200 dark:bg-gray-700 w-full" />
                <div className="mt-2">
                  <button type="button" className="px-3 py-2 text-[16px] bg-blue-600 dark:bg-blue-600 text-white rounded-none focus:outline-none transition-none" onClick={() => setDraftItems((di) => [...di, ''])}>
                    + Add item
                  </button>
                </div>
              </div>

           <div className="h-px bg-gray-200 dark:bg-gray-700" />

           {/* Footer (sticky) */}
            <div className="px-5 py-3 sticky bottom-0 z-10" style={{ backgroundColor: 'var(--background)' }}>
              <div className="h-px bg-gray-200 dark:bg-gray-700 mb-3" />
              <div className="flex items-center justify-end gap-2">
                <button
                  onClick={closeEditor}
                  className="px-3 py-2 text-[16px] text-gray-800 dark:text-gray-200 bg-transparent"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-3 py-2 text-[16px] text-white bg-blue-600"
                  disabled={!canSave}
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
        </div>
      </Modal>
    </>
  );
}