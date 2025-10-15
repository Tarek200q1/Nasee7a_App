import { Messages, User } from "../../../DB/Models/index.js";

/** @comment : Write a jsdocs before each api or befor each function to describe what it does */

/**
 * ===================================
 * @API /messages/send/:receiverId
 * ===================================
 * @description : Send a message to a specific user
 * 
 */
export const sendMessageService = async (req, res) => {
  const { content , isPublic } = req.body;
  const { receiverId } = req.params;

  //Check if the user exists
  const user = await User.findById(receiverId);
  if (!user) return res.status(404).json({ message: "User not found" });

<<<<<<< Updated upstream
  //Create the message
=======
   //Create the message
>>>>>>> Stashed changes
  const message = new Messages({
    content,
    receiverId,
    isPublic
  });

  await message.save();

  /** @comment : take care from the spaces  */
//   const statusMessage = message.isPublic?"is message public" : "is message private"
  const statusMessage = message.isPublic ? "is message public" : "is message private"
  return res
    .status(200)
    .json({ message: "Message sent successfully" , statusMessage , message });
};



/**
 * ===================================
 * @API /messages/get-messages-one-user
 * ===================================
 * @description : Get all messages for a specific user
 * 
 */
export const getMessagesService = async (req, res) => {
    const { _id } = req.loggedInUser;
    const message = await Messages.find({ receiverId: _id })
        .populate([
            {
<<<<<<< Updated upstream
                path: "receiverId"  /** @comment : it's better to select here the desired fields to avoid lake of security */
=======
                path: "receiverId",
                select: "firstName lastName email"
>>>>>>> Stashed changes
            }
        ])
    if (!message.length) {
        return res.status(404).json({ message: "No messages found for this user" });

    }
    return res.status(201).json({ message })
}

<<<<<<< Updated upstream
/**
 * ===================================
 * @API /messages/get-all-public-message
 * ===================================
 * @description : Get all public messages
 * 
 */
=======

>>>>>>> Stashed changes
export const getAllPublicMessageService = async (req, res) => {
    const publicMessage = await Messages.find({ isPublic: true }).populate("receiverId", "firstName lastName");
    if (!publicMessage) {
        return res.status(404).json({ message: "Public message not found" })
    }
    return res.status(201).json({ message: "All public messages fetched successfully ", publicMessage })
}
