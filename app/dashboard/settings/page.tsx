"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useSettings } from "@/hooks/use-settings";
import {
  Settings as SettingsIcon,
  Volume2,
  Vibrate,
  Clock,
  Save,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
  const { settings, loading, updateSettings } = useSettings();
  const [formData, setFormData] = useState({
    defaultDuration: 1500,
    breakDuration: 300,
    soundEnabled: true,
    hapticEnabled: true,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (settings) {
      setFormData({
        defaultDuration: settings.defaultDuration,
        breakDuration: settings.breakDuration,
        soundEnabled: settings.soundEnabled,
        hapticEnabled: settings.hapticEnabled,
      });
    }
  }, [settings]);

  const handleSave = async () => {
    try {
      setSaving(true);
      await updateSettings(formData);
      toast.success("Settings saved successfully!");
    } catch (error) {
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const hasChanges =
    settings &&
    (formData.defaultDuration !== settings.defaultDuration ||
      formData.breakDuration !== settings.breakDuration ||
      formData.soundEnabled !== settings.soundEnabled ||
      formData.hapticEnabled !== settings.hapticEnabled);

  if (loading) {
    return <div className="text-gray-600 dark:text-gray-400">Loading...</div>;
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto py-8">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
          <SettingsIcon className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
          Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Customize your FocusFlow experience
        </p>
      </div>

      <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
            <Clock className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            Timer Settings
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Set your default timer durations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-gray-900 dark:text-white">
                Default Focus Duration:{" "}
                {Math.floor(formData.defaultDuration / 60)} minutes
              </Label>
              <Slider
                value={[formData.defaultDuration]}
                onValueChange={(value) =>
                  setFormData({ ...formData, defaultDuration: value[0] })
                }
                min={300}
                max={3600}
                step={300}
                className="w-full"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Choose between 5 and 60 minutes for focus sessions
              </p>
            </div>

            <Separator className="bg-gray-200 dark:bg-gray-800" />

            <div className="space-y-2">
              <Label className="text-gray-900 dark:text-white">
                Default Break Duration:{" "}
                {Math.floor(formData.breakDuration / 60)} minutes
              </Label>
              <Slider
                value={[formData.breakDuration]}
                onValueChange={(value) =>
                  setFormData({ ...formData, breakDuration: value[0] })
                }
                min={60}
                max={900}
                step={60}
                className="w-full"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Choose between 1 and 15 minutes for breaks
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
            <Volume2 className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            Notifications
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Configure audio and haptic feedback
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="sound" className="text-gray-900 dark:text-white">
                Sound Notifications
              </Label>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Play a sound when timer completes
              </p>
            </div>
            <Switch
              id="sound"
              checked={formData.soundEnabled}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, soundEnabled: checked })
              }
            />
          </div>

          <Separator className="bg-gray-200 dark:bg-gray-800" />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="haptic" className="text-gray-900 dark:text-white">
                Haptic Feedback
              </Label>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Vibrate device when timer completes (mobile only)
              </p>
            </div>
            <Switch
              id="haptic"
              checked={formData.hapticEnabled}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, hapticEnabled: checked })
              }
            />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">
            Recommended Settings
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Popular timer configurations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            variant="outline"
            className="w-full justify-start border-gray-300 dark:border-gray-700"
            onClick={() =>
              setFormData({
                ...formData,
                defaultDuration: 1500,
                breakDuration: 300,
              })
            }
          >
            <div className="text-left">
              <div className="font-medium text-gray-900 dark:text-white">
                Pomodoro Technique
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                25 min focus / 5 min break
              </div>
            </div>
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start border-gray-300 dark:border-gray-700"
            onClick={() =>
              setFormData({
                ...formData,
                defaultDuration: 3000,
                breakDuration: 600,
              })
            }
          >
            <div className="text-left">
              <div className="font-medium text-gray-900 dark:text-white">
                Deep Work
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                50 min focus / 10 min break
              </div>
            </div>
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start border-gray-300 dark:border-gray-700"
            onClick={() =>
              setFormData({
                ...formData,
                defaultDuration: 900,
                breakDuration: 180,
              })
            }
          >
            <div className="text-left">
              <div className="font-medium text-gray-900 dark:text-white">
                Quick Sprints
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                15 min focus / 3 min break
              </div>
            </div>
          </Button>
        </CardContent>
      </Card>

      {hasChanges && (
        <div className="flex justify-end gap-4 sticky bottom-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm p-4 rounded-lg border border-gray-200 dark:border-gray-800">
          <Button
            variant="outline"
            className="border-gray-300 dark:border-gray-700"
            onClick={() =>
              settings &&
              setFormData({
                defaultDuration: settings.defaultDuration,
                breakDuration: settings.breakDuration,
                soundEnabled: settings.soundEnabled,
                hapticEnabled: settings.hapticEnabled,
              })
            }
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            <Save className="mr-2 h-4 w-4" />
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      )}
    </div>
  );
}
