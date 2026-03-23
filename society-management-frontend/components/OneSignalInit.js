"use client";
import { useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import API from "@/lib/api";

export default function OneSignalInit() {
  const { user } = useAuth();
  const savedForUserId = useRef(null);

  useEffect(() => {
    if (!user?.id) return;
    if (savedForUserId.current === user.id) return;

    async function initOneSignal() {
      try {
        // Wait for OneSignal SDK to load
        let attempts = 0;
        while (!window.OneSignal && attempts < 20) {
          await new Promise((resolve) => setTimeout(resolve, 500));
          attempts++;
        }

        if (!window.OneSignal) {
          console.error("OneSignal SDK not loaded.");
          return;
        }

        const OneSignal = window.OneSignal;

        // Init
        try {
          await OneSignal.init({
            appId: process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID,
            allowLocalhostAsSecureOrigin: true,
          });
          console.log("OneSignal initialized");
        } catch (initErr) {
          console.log("ℹ️ OneSignal already initialized, continuing...");
        }

        //  KEY: Link this subscription to your DB user ID as external_id
        // This lets backend target by include_external_user_ids: [user.id]
        // which works reliably on the v1 /notifications API
        try {
          await OneSignal.login(String(user.id));
          console.log(" OneSignal external_id set to:", user.id);
        } catch (loginErr) {
          console.warn(" OneSignal.login() failed:", loginErr.message);
        }

        // Show notification even when tab is in foreground
        OneSignal.Notifications.addEventListener("foregroundWillDisplay", (event) => {
          console.log(" Foreground notification received:", event.notification);
          event.notification.display();
        });

        // Request permission
        const permission = OneSignal.Notifications.permission;
        if (permission !== true) {
          await OneSignal.Notifications.requestPermission();
        }

        // Wait for player/subscription ID
        let playerId = null;
        let subAttempts = 0;
        while (!playerId && subAttempts < 20) {
          playerId = OneSignal.User?.PushSubscription?.id;
          if (!playerId) await new Promise((resolve) => setTimeout(resolve, 1000));
          subAttempts++;
        }

        if (!playerId) {
          console.warn("⚠️ No Player ID — permission likely denied.");
          return;
        }

        console.log("📱 Player ID:", playerId);

        // Save to backend (kept for reference, targeting now done via external_id)
        await API.post("/auth/update-onesignal-id", {
          onesignal_id: playerId,
        });

        console.log(" Player ID saved in DB for user:", user.id);
        savedForUserId.current = user.id;

      } catch (err) {
        console.error(" OneSignal error:", err);
      }
    }

    initOneSignal();
  }, [user?.id]);

  return null;
}