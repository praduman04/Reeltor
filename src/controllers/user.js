import { NotificationModel } from "../model/NotificationModel.js";
import { UserModel } from "../model/UserModel.js";
import bcrypt from "bcrypt";

export const updateUser = async (req, res) => {
  try {
    const updatedFields = req.body;
    const { id } = req.user;
    if (updatedFields.password) {
      const hashedPassword = await bcrypt.hash(updatedFields.password, 10);
      updatedFields.password = hashedPassword;
    }
    const data = await UserModel.findByIdAndUpdate(
      id,
      { $set: updatedFields },
      { new: true }
    );
    if (!data) {
      return res.status(404).json({
        success: true,
        message: "USER NOT FOUND",
      });
    }
    return res.status(200).json({
      success: true,
      message: "USER UPDATED SUCCESSFULLY.",
      user: data,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating the user.",
    });
  }
};
export const sendNotification = async (req, res) => {
  try {
    const { recipientIds, message, type } = req.body;
    const senderId = req.user.id;
    const sender = await UserModel.findById(senderId);

    if (type === "critical" && sender.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Only admins can send critical notifications" });
    }

    const notificationType =
      sender.role === "admin" && type === "critical"
        ? "critical"
        : "non-critical";
    const recipients = await UserModel.find({ _id: { $in: recipientIds } });

    if (recipients.length === 0) {
      return res.status(404).json({ message: "No valid recipients found" });
    }

    const currentTime = new Date();
    const currentHoursMinutes = currentTime.toTimeString().slice(0, 5); // Extract HH:MM format

    const notifications = recipients.map((recipient) => {
      let status = "pending";

      if (notificationType === "critical") {
        status = "delivered";
        
      } else {
        const isAvailable = recipient.availabilityTime.some(
          ({ from, to }) => {
            
            return currentHoursMinutes >= from && currentHoursMinutes <= to;
          }
        );

        if (isAvailable) {
          status = "delivered";
        }
      }

      return new NotificationModel({
        message,
        sender: senderId,
        recipient: recipient._id,
        status,
        type: notificationType,
        sent:currentHoursMinutes,
        received:status==="delivered" ? currentHoursMinutes : null
      });
    });

    await NotificationModel.insertMany(notifications);
    res
      .status(201)
      .json({ message: "Notifications sent successfully", notifications });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};
