const Disease = require("../models/disease");
const Group = require("../models/group");
const ChatMessage = require("../models/message");
const Patient = require("../models/patient");
const Pusher = require("pusher");
const pusher = new Pusher({
  appId: "1641917",
  key: "23770585f05335a622d6",
  secret: "36acc5ff88b81a8c18a7",
  cluster: "mt1",
  useTLS: true,
});

exports.createGroup = async (req, res) => {
  let disease = await Disease.findOne({ _id: req.body.diseaseId });
  if (!disease) {
    return res.status(404).json({
      message: "Disease Does Not Exist",
    });
  }
  try {
    let group = new Group({
      name: req.body.name,
      disease: req.body.diseaseId,
    });
    group
      .save()
      .then((result) => {
        group.members.push(res.locals.user._id);
        group.save().then((res) => {});
        res.json({
          message: "Group Created Successfully",
          result,
        });
        // res.send(result)
      })
      .catch((err) => {
        return res.json({
          message: err,
        });
      });
  } catch (error) {
    return res.json({
      error: err,
    });
  }
};

exports.sendMessage = async (req, res) => {
  const { groupId, user, message } = req.body;
  const newMessage = new ChatMessage({ groupId, user, message }); // Save the group with the message
  await newMessage.save();
  pusher.trigger(groupId, "new-message", { user, message });
  res.json({ success: true });
};

exports.getMessages = async (req, res) => {
  const groupId = req.params.groupId;
  const messages = await ChatMessage.find({ groupId });
  res.json(messages);
};

exports.joinGroup = async (req, res) => {
  const groupId = req.params.groupId; // Assuming you have the groupId in the request params
   const patient = await Patient.findOne({ _id: res.locals.user._id });
    if (!patient) {
      return res.status(404).json({
        message: "Patient Not Found",
      });
    }

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({
        status:false,
        message: "Group Not Found",
      });
    }

    // Check if the patient is already a member of the group
    if (group.members.includes(res.locals.user._id)) {
      return res.status(400).json({
        status:false,
        message: "You are already a member of this group.",
      });
    }

    // Add the patient to the group members
    group.members.push(res.locals.user._id);
    await group.save();

    return res.json({
      message: "You have successfully joined this group.",
    });
};

exports.getGroups = async (req, res) => {
  try {
    const perPage = Number(req.query.perPage) || 10; // Change this to the number of groups per page you want to return
    const page = Number(req.query.page) || 1;

    const groups = await Group.find()
      .populate("members", "_id username email phone")
      .populate("disease")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .exec();

    if (!groups) {
      throw new NotFound("No group available");
    }

    const groupCount = await Group.countDocuments();
    return res.status(200).json({
      success: true,
      data: {
        groups,
        page,
        perPage,
        groupCount,
      },
      message: "Groups retrieved",
    });
  } catch (error) {
    return res.status(error.status || 404).send({
      status: false,
      message: error.message,
    });
  }
};

exports.MyGroup = async (req, res) => {
  try {
    const perPage = Number(req.query.perPage) || 10; // Change this to the number of groups per page you want to return
    const page = Number(req.query.page) || 1;

    const groups = await Group.find({ members: res.locals.user._id })
      .populate("disease", "name description")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .exec();

    if (!groups) {
      throw new NotFound("No group available");
    }

    const groupCount = await Group.countDocuments();
    return res.status(200).json({
      success: true,
      data: {
        groups,
        page,
        perPage,
        groupCount,
      },
      message: "Groups retrieved",
    });
  } catch (error) {
    return res.status(error.status || 404).send({
      status: false,
      message: error.message,
    });
  }
};
