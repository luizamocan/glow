const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema(
  {
    userId: Number,
    userEmail: String,
    groupId: String,
    actionType: {
      type: String,
      required: true,
      index: true,
    },
    actionInformation: mongoose.Schema.Types.Mixed,
    method: String,
    endpoint: String,
    statusCode: Number,
    ipAddress: String,
  },
  {
    collection: "activity_logs",
    timestamps: true,
  }
);

module.exports =
  mongoose.models.ActivityLog || mongoose.model("ActivityLog", activityLogSchema);
