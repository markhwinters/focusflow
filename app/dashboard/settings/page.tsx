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
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <SettingsIcon className="h-8 w-8" />
          Settings
        </h1>
        <p className="text-muted-foreground mt-2">
          Customize your FocusFlow experience
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Timer Settings
          </CardTitle>
          <CardDescription>Set your default timer durations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>
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
              <p className="text-xs text-muted-foreground">
                Choose between 5 and 60 minutes for focus sessions
              </p>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>
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
              <p className="text-xs text-muted-foreground">
                Choose between 1 and 15 minutes for breaks
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Volume2 className="h-5 w-5" />
            Notifications
          </CardTitle>
          <CardDescription>Configure audio and haptic feedback</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="sound">Sound Notifications</Label>
              <p className="text-sm text-muted-foreground">
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

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="haptic">Haptic Feedback</Label>
              <p className="text-sm text-muted-foreground">
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

      <Card>
        <CardHeader>
          <CardTitle>Recommended Settings</CardTitle>
          <CardDescription>Popular timer configurations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() =>
              setFormData({
                ...formData,
                defaultDuration: 1500,
                breakDuration: 300,
              })
            }
          >
            <div className="text-left">
              <div className="font-medium">Pomodoro Technique</div>
              <div className="text-xs text-muted-foreground">
                25 min focus / 5 min break
              </div>
            </div>
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() =>
              setFormData({
                ...formData,
                defaultDuration: 3000,
                breakDuration: 600,
              })
            }
          >
            <div className="text-left">
              <div className="font-medium">Deep Work</div>
              <div className="text-xs text-muted-foreground">
                50 min focus / 10 min break
              </div>
            </div>
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() =>
              setFormData({
                ...formData,
                defaultDuration: 900,
                breakDuration: 180,
              })
            }
          >
            <div className="text-left">
              <div className="font-medium">Quick Sprints</div>
              <div className="text-xs text-muted-foreground">
                15 min focus / 3 min break
              </div>
            </div>
          </Button>
        </CardContent>
      </Card>

      {hasChanges && (
        <div className="flex justify-end gap-4 sticky bottom-4 bg-background/80 backdrop-blur-sm p-4 rounded-lg border">
          <Button
            variant="outline"
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
          <Button onClick={handleSave} disabled={saving}>
            <Save className="mr-2 h-4 w-4" />
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      )}
    </div>
  );
}
