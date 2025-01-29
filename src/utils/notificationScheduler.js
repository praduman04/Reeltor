import cron from "node-cron";
import { NotificationModel } from "../model/NotificationModel.js";
import { UserModel } from "../model/UserModel.js";
// Function to check and send pending notifications
const processPendingNotifications = async () => {
  try {
    const currentTime = new Date();
    const currentHoursMinutes = currentTime.toTimeString().slice(0, 5); // "HH:MM"

    // Find all pending notifications
    const pendingNotifications = await NotificationModel.find({ status: "pending" });

    for (const notification of pendingNotifications) {
      const recipient = await UserModel.findById(notification.recipient);

      if (recipient) {
        // Check if the current time matches any availability slot
        const isAvailable = recipient.availabilityTime.some(({ from }) => from === currentHoursMinutes);

        if (isAvailable) {
          // Update notification to "delivered"
          notification.status = "delivered";
          notification.received=currentHoursMinutes
          
          await notification.save();

          console.log(`Notification delivered to ${recipient.email}: ${notification.message}`);
        }
      }
    }
  } catch (error) {
    console.error("Error processing pending notifications:", error);
  }
};

// Schedule the job to run every minute
cron.schedule("* * * * *", async () => {
  console.log("Checking for pending notifications...");
  await processPendingNotifications();
});

export default processPendingNotifications;
