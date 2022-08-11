import CustomErrorHandler from "../services/CustomErrorHandler";
import JwtService from "../services/JwtService";


const auth = async (req, res, next) => {
  let authHeader = req.headers.authorization;

  if (!authHeader) {
    return next(CustomErrorHandler.unAuthorized());
  }

  const token = authHeader.split(' ')[1];
  // console.log(token);

  try {
    const { _id, role } = await JwtService.verify(token);
    req.user = {};
    req.user._id = _id;
    req.user.role = role;
    next();

  } catch (err) {
    return next(CustomErrorHandler.unAuthorized());
  }
}

export default auth;