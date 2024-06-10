import messagesModel from "../models/messages.model.js";

export default class MessageManager {
  getMessages = async () => {
    try {
      return await messagesModel.find().lean();
    } catch (error) {
      return error;
    }
  };

  createMessage = async (message) => {
    if (message.user.trim() === "" || message.message.trim() === "") {
      return null;
    }

    try {
      return await messagesModel.create(message);
    } catch (error) {
      return error;
    }
  };

  deleteAllMessages = async () => {
    try {
      console.log("Deleting all messages...");
      const result = await messagesModel.deleteMany({});
      console.log("Messages deleted:", result);
      return result;
    } catch (error) {
      console.error("Error deleting messages:", error);
      return error;
    }
  };
}
