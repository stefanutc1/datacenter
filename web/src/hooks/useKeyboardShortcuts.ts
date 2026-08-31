"use client";

import { useEffect } from "react";
import { SubsystemCategory } from "@/data/infrastructure";

interface KeyboardShortcutsOptions {
  onSelectSubsystem: (subsystem: SubsystemCategory) => void;
  onResetView: () => void;
  onOpenCommandPalette: () => void;
  onCloseOverlays: () => void;
  onToggleAutoRotate: () => void;
}

export const useKeyboardShortcuts = ({
  onSelectSubsystem,
  onResetView,
  onOpenCommandPalette,
  onCloseOverlays,
  onToggleAutoRotate,
}: KeyboardShortcutsOptions) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input or textarea
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }

      // Command Palette (⌘K, Ctrl+K, or /)
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onOpenCommandPalette();
        return;
      }

      if (e.key === "/") {
        e.preventDefault();
        onOpenCommandPalette();
        return;
      }

      // Escape key (Close overlays or reset view)
      if (e.key === "Escape") {
        e.preventDefault();
        onCloseOverlays();
        return;
      }

      // 'R' toggles auto-rotate
      if (e.key.toLowerCase() === "r" && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        onToggleAutoRotate();
        return;
      }

      // Number keys for Subsystem navigation
      switch (e.key) {
        case "1":
          e.preventDefault();
          onSelectSubsystem("system");
          break;
        case "2":
          e.preventDefault();
          onSelectSubsystem("compute");
          break;
        case "3":
          e.preventDefault();
          onSelectSubsystem("network");
          break;
        case "4":
          e.preventDefault();
          onSelectSubsystem("security");
          break;
        case "5":
          e.preventDefault();
          onSelectSubsystem("orchestration");
          break;
        case "6":
          e.preventDefault();
          onSelectSubsystem("automation");
          break;
        case "7":
          e.preventDefault();
          onSelectSubsystem("observability");
          break;
        case "8":
          e.preventDefault();
          onSelectSubsystem("services");
          break;
        case "9":
          e.preventDefault();
          onSelectSubsystem("elo");
          break;
        case "0":
          e.preventDefault();
          onSelectSubsystem("edge");
          break;
        case "p":
        case "P":
          e.preventDefault();
          onSelectSubsystem("projects");
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    onSelectSubsystem,
    onResetView,
    onOpenCommandPalette,
    onCloseOverlays,
    onToggleAutoRotate,
  ]);
};
