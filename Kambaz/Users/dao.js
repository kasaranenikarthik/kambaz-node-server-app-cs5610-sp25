import model from "./model.js";
import { v4 as uuidv4 } from "uuid";

export const createUser = async (user) => {
  // Check if the username already exists
  const existingUser = await model.findOne({ username: user.username });
  if (existingUser) {
    res.send("Username already exists");
  }

  // If not, create a new user with a unique ID
 const newUser = { ...user, _id: uuidv4() };
 return await model.create(newUser);
};

export const findAllUsrs = () => model.find();
export const findUserById = (userId) => model.findById(userId); 
export const findUserByUsername = (username) =>  model.findOne({ username: username }); 
export const findUserByCredentials = (username, password) =>  model.findOne({ username, password }); 
export const updateUser = (userId, user) =>  model.updateOne({ _id: userId }, { $set: user }); 
export const deleteUser = (userId) => model.deleteOne({ _id: userId });
export const findUsersByRole = async (role) => {
  let users = await model.find({ role: role })
  return users;
};

export const findUsersByPartialName = (partialName) => { 
  const regex = new RegExp(partialName, "i"); // 'i' makes it case-insensitive 
  return model.find({ 
    $or: [{ firstName: { $regex: regex } }, { lastName: { $regex: regex } }], 
  }); 
};