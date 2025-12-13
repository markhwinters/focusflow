import { useState, useEffect } from "react";
import { Settings } from "@/types";
import {
  getUserSettings,
  updateUserSettings,
} from "@/server/actions/settings-actions";

export function useSettings() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserSettings();
  }, []);

  const updateSettings = async (updates: Partial<Settings>) => {
    try {
      const data = await updateUserSettings(updates);

      if (!data) throw new Error("Failed to update settings");

      setSettings(data as Settings);
      return data;
    } catch (error) {
      console.error("Failed to update settings:", error);
      throw error;
    }
  };

  return {
    settings,
    loading,
    updateSettings,
    refetch: getUserSettings,
  };
}
