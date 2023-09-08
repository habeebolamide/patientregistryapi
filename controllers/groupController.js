const Disease = require("../models/disease");
const Group = require("../models/group");
const ChatMessage = require("../models/message");
const Patient = require("../models/patient");
const Pusher = require("pusher");
const argon2 = require('argon2');
const { createHmac } = require('crypto');
const { createLogger, transports, format } = require('winston');
const Webhook = require("../models/webhook");
const { combine, timestamp, printf } = format;
const axios = require('axios');
const pusher = new Pusher({
  appId: "1641917",
  key: "23770585f05335a622d6",
  secret: "36acc5ff88b81a8c18a7",
  cluster: "mt1",
  useTLS: true,
});

exports.webHook = async (req,res) => {// Define a custom log format
    let webhook = new Webhook({
      webhook:req.body.message.message,
    })
    let identifier = `'phone'+''+${req.body.contact.phone}`
    console.log(identifier);
    const apiUrl = `https://api.respond.io/v2/contact/${identifier}/message`; 
    const payload = {
      "channelId": 0,
      "message": {
        "type": "text",
        "text": "Message text",
        "messageTag": "ACCOUNT_UPDATE"
      }
    };

  axios.post(apiUrl, payload)
  .then((response) => {
    // Handle the response here
    console.log('Response data:', response.data);
  })
  .catch((error) => {
    // Handle any errors here
    console.error('Error:', error.message);
  });
    webhook.save().then((res) => {
      console.log('Saved Webhook');
    })
    // if (signature !== expectedSignature) {
    //     return res.status(400).json({
    //         message: 'Invalid signature'
    //     });
    // }

    res.json({
        message: 'ok'
    })
}
exports.createGroup = async (req, res) => {
  // let disease = await Disease.findOne({ _id: req.body.diseaseId });
  // if (!disease) {
  //   return res.status(404).json({
  //     message: "Disease Does Not Exist",
  //   });
  // }
  try {
    let hash; 

    if (req.body.isLocked == 'true') {
      hash = await argon2.hash(req.body.password);
      // return console.log(hash);
    }

    let groupData = {
      name: req.body.name,
      disease: req.body.diseaseId,
      isLocked:req.body.isLocked
    };

    if (hash) {
      groupData.password = hash
    }
    
    const group = new Group(groupData);

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
      error: error,
    });
  }
};

exports.sendMessage = async (req, res) => {
  const { groupId, user, message,avatar } = req.body;
  const newMessage = new ChatMessage({ groupId, user, message,avatar }); // Save the group with the message
  await newMessage.save();
  pusher.trigger(groupId, "new-message", { user, message });
  res.json({ success: true });
};

exports.getMessages = async (req, res) => {
  try {
    const groupId = req.params.groupId;
    const messages = await ChatMessage.find({ groupId });
    res.json(messages);
  } catch (error) {
    console.log(12345);
    console.log(error);
  }

};

exports.joinGroup = async (req, res) => {
  try {
    const groupId = req.params.groupId; 
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
     if (group.isLocked == "true") {
       if (await argon2.verify(group.password, req.body.password)) {
         console.log("confirm password");
       } else {
         return res.status(400).json({
           status:false,
           message: "Invalid Credentials",
         });
       }
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
  } catch (error) {
    console.log(12345);
    console.log(error);
  }

};

exports.leaveGroup = async (req, res) => {
  const groupId = req.params.groupId;
  const patientId = res.locals.user._id;

  try {
    // Find the patient
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({
        status: false,
        message: "Patient Not Found",
      });
    }

    // Find the group
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({
        status: false,
        message: "Group Not Found",
      });
    }

    // Check if the patient is a member of the group
    if (!group.members.includes(patientId)) {
      return res.status(400).json({
        status: false,
        message: "You are not a member of this group.",
      });
    }

    // Remove the patient from the group members
    group.members = group.members.filter((member) => member.toString() !== patientId);
    await group.save();

    return res.json({
      message: "You have successfully left this group.",
      status: true,
    });
  } catch (error) {
    console.error("Error leaving group:", error);
    return res.status(500).json({
      status: false,
      message: "Failed to leave the group. Please try again later.",
    });
  }
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
