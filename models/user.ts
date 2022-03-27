import mongoose, { Schema, Document } from "mongoose"
import bcrypt from "bcryptjs"

export interface IUser extends Document {
  _id: string
  name: string
  userName: string
  password: string
  role: string
  access_token: string
  createdAt: string
  updatedAt: string
  comparePassword(candidatePassword: string): Promise<boolean>
}

const User: Schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "user",
    },
    access_token: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
)

User.pre("save", async function (next) {
  let user = this as IUser

  if (!user.isModified("password")) return next()

  // Random additional data
  const salt = await bcrypt.genSalt()

  const hash = await bcrypt.hashSync(user.password, salt)

  // Replace the password with the hash
  user.password = hash

  return next()
})

// Used for logging in
User.methods.comparePassword = async function (candidatePassword: string) {
  const user = this as IUser

  return bcrypt.compare(candidatePassword, user.password).catch((e) => false)
}

export default mongoose.model<IUser>("User", User, "users")
