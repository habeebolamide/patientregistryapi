const Group = require("../models/group");
const Message = require("../models/message");
const Patient = require("../models/patient");

exports.getStats = async (req, res) => {
  try {
    const user = await Patient.findOne({ _id: res.locals.user._id });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const messageCount = await Message.countDocuments({ user: user.username });
    const groupCount = await Group.countDocuments({ members:{$in:[ user._id]} });

    const stats = {
      total_message: messageCount,
      total_group:groupCount
    };

    res.json({
      stats,
      message: "Statistics retrieved successfully"
    });
  } catch (error) {
    console.error("Error fetching statistics:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
