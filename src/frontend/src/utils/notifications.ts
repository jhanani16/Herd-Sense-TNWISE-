export async function requestNotificationPermission(): Promise<boolean> {
  if (!("Notification" in window)) return false;
  if (Notification.permission === "granted") return true;
  if (Notification.permission === "denied") return false;
  try {
    const result = await Notification.requestPermission();
    return result === "granted";
  } catch {
    return false;
  }
}

export function sendPushNotification(title: string, body: string): void {
  if (!("Notification" in window) || Notification.permission !== "granted")
    return;
  try {
    new Notification(title, {
      body,
      icon: "/assets/generated/livestock-logo-transparent.dim_80x80.png",
      badge: "/assets/generated/livestock-logo-transparent.dim_80x80.png",
      tag: "livestock-alert",
      requireInteraction: false,
    });
  } catch {
    // Notification API may throw in some contexts; silently ignore
  }
}

export function isNotificationSupported(): boolean {
  return "Notification" in window;
}

export function getNotificationPermission():
  | NotificationPermission
  | "unsupported" {
  if (!("Notification" in window)) return "unsupported";
  return Notification.permission;
}
