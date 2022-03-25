import User from "../models/user"
import jwt from "jsonwebtoken"
import { Request, Response } from "express"

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body
    // validation
    if (!name) return res.status(400).send("name_is_required")
    if (!password || password.length < 6)
      return res
        .status(400)
        .send("password_is_required_and_should_be_min_6_characters_long")
    let userExist = await User.findOne({ email }).exec()
    if (userExist) return res.status(400).send("email_is_taken")
    // register
    const user = new User(req.body)

    await user.save()
    console.log("USER CREATED", user)
    let token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET as string, {
      expiresIn: "7d",
    })
    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        // stripe_account_id: user.stripe_account_id,
        // stripe_seller: user.stripe_seller,
        // stripeSession: user.stripeSession,
      },
    })
  } catch (err) {
    console.log("CREATE USER FAILED", err)
    return res.status(400).send("error._try_again.")
  }
}

export const login = async (req: Request, res: Response) => {
  try {
    // console.log(req.body);
    const { email, password } = req.body
    // check if user with that email exist
    let user = await User.findOne({ email }).exec()
    // console.log("USER EXIST", user);
    if (!user) return res.status(400).send("User with that email not found")
    // compare password
    const comparePassword = await user.comparePassword(password)
    if (comparePassword) {
      // GENERATE A TOKEN THEN SEND AS RESPONSE TO CLIENT
      let token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET as string, {
        expiresIn: "7d",
      })
      res.json({
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          // stripe_account_id: user.stripe_account_id,
          // stripe_seller: user.stripe_seller,
          // stripeSession: user.stripeSession,
        },
      })
    } else {
      console.log("COMPARE PASSWORD IN LOGIN ERR")
      res.status(400).send("wrong_data")
    }
  } catch (err) {
    console.log("LOGIN ERROR", err)
    res.status(400).send("signin_failed")
  }
}
