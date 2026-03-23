"use client";
import { useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import API from "@/lib/api";

export default function SaveOneSignalId() {
  const { user } = useAuth();
  const saved = useRef(false);

  useEffect(() => {
    if (saved.current) return;

    async function saveId() {
      if (!user?.id) return;

      try {
        let attempts = 0;
        while (!window.OneSignal?.User?.PushSubscription && attempts < 20) {
          await new Promise(res => setTimeout(res, 1000));
          attempts++;
        }

        const playerId = window.OneSignal?.User?.PushSubscription?.id;

        if (!playerId) {
          console.log("⏳ Waiting for Player ID...");
          setTimeout(saveId, 2000);
          return;
        }

        console.log("📱 Player ID:", playerId);

        await API.post("/auth/update-onesignal-id", {
          onesignal_id: playerId
        });

        console.log("✅ Player ID saved");
        saved.current = true;

      } catch (err) {
        console.error("Save Player ID Error:", err);
      }
    }

    saveId();
  }, [user]);

  return null;
}