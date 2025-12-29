import { useEffect } from "react";
import { enqueueSnackbar } from "notistack";
import { register } from "../https";
import {
  getOfflineQueue,
  removeOfflineEntries,
  OFFLINE_QUEUE_TYPES,
} from "../utils/offlineQueue";

const buildResultMessage = (successCount, failureCount) => {
  const parts = [];

  if (successCount) {
    parts.push(
      `${successCount} registro${successCount > 1 ? "s" : ""} sincronizado${
        successCount > 1 ? "s" : ""
      } correctamente.`
    );
  }

  if (failureCount) {
    parts.push(
      `${failureCount} registro${failureCount > 1 ? "s" : ""} no pudo sincronizarse.`
    );
  }

  return parts.join(" ");
};

const useOfflineSync = () => {
  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    let isProcessing = false;

    const syncRegistrations = async () => {
      if (isProcessing) return;
      isProcessing = true;

      try {
        const registrations = getOfflineQueue(
          OFFLINE_QUEUE_TYPES.USER_REGISTRATION
        );

        if (!registrations.length) return;

        const successfulIds = [];
        let failedCount = 0;

        for (const entry of registrations) {
          try {
            await register(entry.payload);
            successfulIds.push(entry.id);
          } catch {
            failedCount += 1;
          }
        }

        if (successfulIds.length) {
          removeOfflineEntries(
            OFFLINE_QUEUE_TYPES.USER_REGISTRATION,
            successfulIds
          );
        }

        if (successfulIds.length || failedCount) {
          const variant = failedCount
            ? successfulIds.length
              ? "warning"
              : "error"
            : "success";

          enqueueSnackbar(buildResultMessage(successfulIds.length, failedCount), {
            variant,
          });
        }
      } finally {
        isProcessing = false;
      }
    };

    const handleOnline = () => {
      if (typeof navigator !== "undefined" && navigator.onLine) {
        syncRegistrations();
      }
    };

    window.addEventListener("online", handleOnline);

    if (typeof navigator !== "undefined" && navigator.onLine) {
      syncRegistrations();
    }

    return () => {
      window.removeEventListener("online", handleOnline);
    };
  }, []);
};

export default useOfflineSync;
