"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useClerk, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  User,
  Shield,
  Download,
  Trash2,
  Mail,
  AlertTriangle,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";

export default function AccountPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();

  const [isExporting, setIsExporting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");

  const { signOut } = useClerk();

  // Handle Data Export
  const handleDataExport = async () => {
    setIsExporting(true);
    try {
      const response = await fetch("/api/user/export", {
        method: "POST",
      });

      if (response.status === 429) {
        toast.error("Rate limit exceeded. Maximum 5 exports per hour.");
        return;
      }

      if (!response.ok) {
        throw new Error("Export failed");
      }

      // Get the filename from response headers
      const contentDisposition = response.headers.get("Content-Disposition");
      const filenameMatch = contentDisposition?.match(/filename="(.+)"/);
      const filename = filenameMatch
        ? filenameMatch[1]
        : `focusflow-data-${Date.now()}.json`;

      // Convert response to blob and trigger download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success("Data exported successfully!");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export data. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  // Handle Account Deletion
  const handleAccountDelete = async () => {
    if (deleteConfirmation !== "DELETE") {
      toast.error("Please type DELETE to confirm");
      return;
    }

    setIsDeleting(true);
    try {
      // Delete database data first
      const response = await fetch("/api/user/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          confirmation: deleteConfirmation,
        }),
      });

      const data = await response.json();

      if (response.status === 429) {
        toast.error("Too many deletion attempts. Please try again later.");
        setIsDeleting(false);
        return;
      }

      if (!response.ok) {
        throw new Error(data.error || "Deletion failed");
      }

      // Close dialogs first
      setConfirmDialogOpen(false);
      setDeleteDialogOpen(false);

      toast.success("Account deleted successfully. Goodbye!");

      // Sign out immediately (this clears session/cookies)
      await signOut({ redirectUrl: "/" });
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(
        "Failed to delete account. Please try again or contact support."
      );
      setIsDeleting(false);
    }
  };

  if (!isLoaded || !isSignedIn) {
    return (
      <div className="space-y-8 max-w-4xl mx-auto py-8">
        <div className="text-gray-600 dark:text-gray-400">
          Loading account data...
        </div>
      </div>
    );
  }

  const memberSinceDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "N/A";

  const primaryEmail = user.primaryEmailAddress?.emailAddress || "N/A";

  return (
    <div className="space-y-8 max-w-4xl mx-auto py-8">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
          <User className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
          Account Overview
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Manage your personal information and membership details.
        </p>
      </div>

      {/* Account Information Card */}
      <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">
            Personal Details
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Information associated with your FocusFlow account.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-1">
            <Label className="text-gray-900 dark:text-white font-medium">
              Full Name
            </Label>
            <p className="text-gray-600 dark:text-gray-400">
              {user.fullName || "Not Set"}
            </p>
          </div>
          <Separator className="bg-gray-200 dark:bg-gray-800" />
          <div className="grid gap-1">
            <Label className="text-gray-900 dark:text-white font-medium flex items-center gap-1">
              <Mail className="h-4 w-4" /> Email Address
            </Label>
            <p className="text-gray-600 dark:text-gray-400">{primaryEmail}</p>
          </div>
          <Separator className="bg-gray-200 dark:bg-gray-800" />
          <div className="grid gap-1">
            <Label className="text-gray-900 dark:text-white font-medium">
              Member Since
            </Label>
            <p className="text-gray-600 dark:text-gray-400">
              {memberSinceDate}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Data Management Card */}
      <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
            <Shield className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            Data and Privacy
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Control your personal data in compliance with GDPR.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Export Data Section */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-0.5">
              <Label className="text-gray-900 dark:text-white">
                Export My Data
              </Label>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Download a JSON file containing all your sessions, settings, and
                profile data.
              </p>
            </div>
            <Button
              onClick={handleDataExport}
              disabled={isExporting}
              className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700"
            >
              <Download className="mr-2 h-4 w-4" />
              {isExporting ? "Exporting..." : "Export Data"}
            </Button>
          </div>

          <Separator className="bg-gray-200 dark:bg-gray-800" />

          {/* Delete Account Section */}
          <div className="space-y-4">
            <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-900 rounded-lg p-4">
              <div className="flex gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-red-900 dark:text-red-100">
                  <p className="font-semibold mb-1">Danger Zone</p>
                  <p>
                    Deleting your account will permanently remove all your
                    sessions, statistics, and account information. This action
                    cannot be undone.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-0.5">
                <Label className="text-lg font-semibold text-red-600 dark:text-red-400">
                  Delete Account
                </Label>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Permanently remove your account and all associated data.
                </p>
              </div>
              <Button
                onClick={() => setDeleteDialogOpen(true)}
                disabled={isDeleting}
                variant="destructive"
                className="w-full sm:w-auto bg-red-600 hover:bg-red-700"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Account
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* First Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-gray-900 dark:text-white">
              Are you absolutely sure?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600 dark:text-gray-400">
              This will permanently delete your account and remove all your data
              from our servers. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-gray-300 dark:border-gray-700">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setDeleteDialogOpen(false);
                setConfirmDialogOpen(true);
              }}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Second Confirmation Dialog with DELETE input */}
      <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <AlertDialogContent className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-gray-900 dark:text-white">
              Final Confirmation
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600 dark:text-gray-400">
              Type{" "}
              <span className="font-bold text-gray-900 dark:text-white">
                DELETE
              </span>{" "}
              below to confirm account deletion.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Input
            type="text"
            value={deleteConfirmation}
            onChange={(e) => setDeleteConfirmation(e.target.value)}
            placeholder="Type DELETE"
            className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
          />
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setDeleteConfirmation("");
              }}
              className="border-gray-300 dark:border-gray-700"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleAccountDelete}
              disabled={deleteConfirmation !== "DELETE" || isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white disabled:opacity-50"
            >
              {isDeleting ? "Deleting..." : "Delete Account"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
