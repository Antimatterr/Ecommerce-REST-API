import Joi from "joi";
import CustomErrorHandler from "../../services/CustomErrorHandler";
import { RefreshToken, User } from "../../models";
import bcrypt from 'bcrypt';
import JwtService from "../../services/JwtService";
import { REFRESH_SECRET } from "../../config";

const registerController = {
  async register(req, res, next) {

    const registerSchema = Joi.object({
      name: Joi.string().min(4).max(40).required(),
      email: Joi.string().email().required(),
      password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
      repeat_password: Joi.ref('password')
    });

    const { error } = registerSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    //check if user is in database

    try {
      const exist = await User.exists({ email: req.body.email })
      if (exist) {
        return next(CustomErrorHandler.alreadyExist('This email already exists'));
      }
    } catch (err) {
      return next(err)
    }

    //prepare the model
    const { name, email, password } = req.body;

    //hash password
    const hashedPassword = await bcrypt.hash(password, 10);


    const user = new User({
      name,
      email,
      password: hashedPassword
    })


    let access_token;
    let refresh_token;

    try {
      const result = await user.save();
      console.log(result)
      //token
      access_token = JwtService.sign({ _id: result._id, role: result.role })
      refresh_token = JwtService.sign({ _id: result._id, role: result.role }, '1y', REFRESH_SECRET);


      await RefreshToken.create({ token: refresh_token });

    } catch (err) {
      return next(err);
    }






    res.json({ access_token: access_token, refresh_token: refresh_token });
  }
}

export default registerController;