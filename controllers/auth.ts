import User from "../models/user"
import jwt from "jsonwebtoken"
import { Request, Response } from "express"

export const register = async (req: Request, res: Response) => {
  try {
    const { name, userName, password } = req.body
    // validation
    if (!name) return res.status(400).send("name_is_required")
    if (!password || password.length < 6)
      return res
        .status(400)
        .send("password_is_required_and_should_be_min_6_characters_long")
    let userExist = await User.findOne({ userName }).exec()
    console.log(userExist)
    if (userExist) return res.status(400).json({message:"userName_is_taken"})
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
        userName: user.userName,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    })
  } catch (err) {
    console.log("CREATE USER FAILED", err)
    return res.status(400).send("error._try_again.")
  }
}

export const login = async (req: Request, res: Response) => {
  try {
    const { userName, password } = req.body
    let user = await User.findOne({ userName }).exec()
    if (!user) return res.status(400).send("User with that userName not found")
    const comparePassword = await user.comparePassword(password)
    if (comparePassword) {
      let token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET as string, {
        expiresIn: "7d",
      })
      res.json({
        token,
        user: {
          _id: user._id,
          name: user.name,
          userName: user.userName,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
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
