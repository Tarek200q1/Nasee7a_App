import { Messages, User } from "../../../DB/Models/index.js";

export const sendMessageService = async (req, res) => {
  const { content , isPublic } = req.body;
  const { receiverId } = req.params;

  const user = await User.findById(receiverId);
  if (!user) return res.status(404).json({ message: "User not found" });

  const message = new Messages({
    content,
    receiverId,
    isPublic
  });
  await message.save();
  const statusMessage = message.isPublic?"is message public": "is message private"
  return res
    .status(200)
    .json({ message: "Message sent successfully" , statusMessage , message });
};


export const getMessagesService = async (req, res) => {
    const { _id } = req.loggedInUser;
    const message = await Messages.find({ receiverId: _id })
        .populate([
            {
                path: "receiverId",
                select: "firstName lastName email"
            }
        ])
    if (!message.length) {
        return res.status(404).json({ message: "No messages found for this user" });

    }
    return res.status(201).json({ message })
}

export const getAllPublicMessageService = async (req, res) => {
    const publicMessage = await Messages.find({ isPublic: true })
        .populate("receiverId", "firstName lastName");
    if (!publicMessage) {
        return res.status(404).json({ message: "Public message not found" })
    }
    return res.status(201).json({ message: "All public messages fetched successfully ", publicMessage })
}
