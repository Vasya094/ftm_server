import expressJwt from "express-jwt"
import express from "express"
import Application from "../models/application"

// req.user
export const requireSignin = expressJwt({
  // secret, expiryDate
  secret: process.env.JWT_SECRET as string,
  algorithms: ["HS256"],
})

interface ReqWithUser {
  user?: {
    _id: string
  }
}

declare global {
    namespace Express {
      interface User {
        _id: string
      }
    }
  }

export const applicationOwner = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  let application = await Application.findById(req.params.applicationId).exec()
  let owner = application?.addedBy.toString() === req?.user?._id.toString()
  if (!owner) {
    return res.status(403).send("Unauthorized")
  }
  next()
}
