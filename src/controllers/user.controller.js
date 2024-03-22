import jwt from "jsonwebtoken";
const registerUser = (req, res) => {
  // get data:text and files
  const { username, email, password, fullname } = req.body;

  // validate the data
  // check if the user already exists
  // upload images on cloudinary;
  // create the user entry in db;
  // send response (excluding password)
};

export { registerUser };
