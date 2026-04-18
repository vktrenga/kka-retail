// Utility function to show notifications
export const showNotification = (message: string, type: "success" | "error" = "success") => {
  const notification = document.createElement("div");
  notification.textContent = message;
  notification.className = `fixed top-16 right-4 px-4 py-2 rounded shadow text-white z-50 ${
    type === "success" ? "bg-green-500" : "bg-red-500"
  }`;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000); // Remove after 3 seconds
};