const User = require("../models/User");

exports.register = async (req, res, next) => {
  //dummy for q.1 - 11
  //   res.status(200).json({ success: true });

  //q.2 - 19
  //create a user
  try {
    const { name, email, password, role } = req.body;
    const user = await User.create({
      name,
      email,
      password,
      role,
    });

    // const token = user.getSignedJwtToken();
    // res.status(200).json({ success: true, token });
    sendTokenResponse(user, 200, res);
  } catch (err) {
    res.status(400).json({ success: false });
    console.log(err.stack);
  }
};

//login
exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      msg: "Please provide an email and password",
    });
  }
  //check for user
  const user = await User.findOne({ email: email }).select("+password");
  if (!user) {
    return res.status(400).json({
      success: false,
      msg: "Invalid credentials",
    });
  }
  //check if password matches
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return res.status(400).json({
      success: false,
      msg: "Invalid credentials",
    });
  }
  //generate token
  // const token = user.getSignedJwtToken();
  // res.status(200).json({ success: true, token });
  sendTokenResponse(user, 200, res);
};
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();
  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }
  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    token,
  });
};

exports.getMe = async (req, res, next) => {
  console.log(req.user);
  const user = await User.find();
  res.status(200).json({ success: true, data: user });
};
