"use client";

import React, { useEffect, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { ProgressiveImage } from "@/components/ui/ProgressiveImage";
import { Article } from "@/components/home/types";

interface BreakingNewsEditModalProps {
  isOpen: boolean;
  article: Article;
  onClose: () => void;
  onSave: (article: Article) => void;
  availableTags?: string[];
}

export default function BreakingNewsEditModal({
  isOpen,
  article,
  onClose,
  onSave,
  availableTags = [],
}: BreakingNewsEditModalProps) {
  const [draft, setDraft] = useState<Article>(article);
  const [localImageUrl, setLocalImageUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    setDraft(article);
    setLocalImageUrl(null);
  }, [article]);

  const handleChange = (field: keyof Article, value: any) => {
    setDraft((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Create a local preview URL for immediate feedback
    const url = URL.createObjectURL(file);
    setLocalImageUrl(url);
    setSelectedFile(file);
    // Use the preview URL directly so the image shows in cards immediately after save
    setDraft((prev) => ({ ...prev, imageUrl: url }));
  };

  const toggleTag = (tag: string) => {
    setDraft((prev) => {
      const current = prev.tags || [];
      return current.includes(tag)
        ? { ...prev, tags: current.filter((t) => t !== tag) }
        : { ...prev, tags: [...current, tag] };
    });
  };

  const handleSave = async () => {
    let finalArticle = { ...draft };

    if (selectedFile) {
      try {
        const formData = new FormData();
        formData.append("file", selectedFile);
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        if (res.ok) {
          const json = await res.json();
          if (json?.url) {
            finalArticle.imageUrl = json.url as string;
          }
        } else {
          console.error("Upload failed", await res.text());
        }
      } catch (e) {
        console.error("Upload error", e);
      }
    }

    onSave(finalArticle);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="full"
      className="rounded-none shadow-none"
      hideCloseButton
    >
      <div className="w-full" style={{ backgroundColor: "var(--card)" }}>
        {/* Header - flat with simple X */}
        <div
          className="px-6 py-4 flex items-center justify-between"
          style={{ backgroundColor: "var(--background)" }}
        >
          <h3 className="text-base font-bold">Edit Breaking News</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-base leading-none"
            style={{ background: "transparent", padding: 0, color: "inherit" }}
          >
            X
          </button>
        </div>

        {/* Body - flat layout, improved alignment */}
        <div className="px-6 py-4 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: Large image preview to match breaking news emphasis */}
            <div className="space-y-2">
              <label className="text-sm font-semibold block">Lead Image</label>
              <div className="relative w-full min-h-[200px]" style={{ aspectRatio: "16/9" }}>
                <ProgressiveImage
                  src={draft.imageUrl || ""}
                  alt={draft.title}
                  className="w-full h-full"
                  fill
                />
              </div>
              <div className="space-y-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-900 file:bg-black file:text-white file:px-3 file:py-2 file:mr-3 file:border-0 file:rounded-none"
                />
                <div className="space-y-1">
                  <label className="text-sm font-semibold block">Or Image URL</label>
                  <input
                    type="text"
                    value={draft.imageUrl || ""}
                    onChange={(e) => handleChange("imageUrl", e.target.value)}
                    className="w-full px-3 py-2 bg-white text-black rounded-none shadow-none border-0 focus:outline-none focus:ring-0"
                  />
                </div>
              </div>
            </div>

            {/* Right: Key fields with clear hierarchy */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold block">Title</label>
                <input
                  type="text"
                  value={draft.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  className="w-full px-3 py-2 bg-white text-black rounded-none shadow-none border-0 focus:outline-none focus:ring-0"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold block">Excerpt</label>
                <textarea
                  value={draft.excerpt || ""}
                  onChange={(e) => handleChange("excerpt", e.target.value)}
                  className="w-full min-h-[80px] px-3 py-2 bg-white text-black rounded-none shadow-none border-0 focus:outline-none focus:ring-0"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold block">Content</label>
                <textarea
                  value={draft.content || ""}
                  onChange={(e) => handleChange("content", e.target.value)}
                  className="w-full min-h-[140px] px-3 py-2 bg-white text-black rounded-none shadow-none border-0 focus:outline-none focus:ring-0"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold block">Tags</label>
                <div className="flex flex-wrap gap-2">
                  {(availableTags.length ? availableTags : draft.tags || []).map((tag) => {
                    const selected = (draft.tags || []).includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTag(tag)}
                        className={`px-2 py-1 text-xs ${selected ? "bg-black text-white" : "bg-gray-200 text-black"}`}
                        style={{ borderRadius: 0 }}
                        aria-pressed={selected}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Footer actions - flat */}
          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-black"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 bg-black text-white"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}