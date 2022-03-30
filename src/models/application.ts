import mongoose from "mongoose"
import mongooseDelete from "mongoose-delete"
import { IUser } from "./user"

const { Schema } = mongoose

interface LocationType {
  placeId: string
  namesInLangs: { en: string; ru: string; ar: string }[]
}
interface IApplication extends mongoose.Document {
  _id: string
  title: string
  description: string
  startLocation: LocationType
  finishLocation: LocationType
  type: "send" | "take"
  pricePerKg: number
  travelDate: string
  addedBy: IUser["_id"]
  cargoInfo: {
    willNotTake: string
    iCanGoAndBuy: boolean
  }
  createdAt: string
  updatedAt: string
  communicationWays: string
}

const ApplicationSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
      maxlength: 10000,
    },
    type: {
      type: String,
      required: true,
      default: "send",
    },
    startLocation: {
      placeId: {
        type: String,
        default: false,
      },
      namesInLangs: { en: String, ru: String, ar: String },
    },
    finishLocation: {
      placeId: {
        type: String,
        default: false,
      },
      namesInLangs: { en: String, ru: String, ar: String },
    },
    pricePerKg: {
      type: Number,
    },
    cargoInfo: {
      willNotTake: { type: String },
      iCanGoAndBuy: { type: Boolean },
    },
    addedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    travelDate: {
      type: Date,
    },
    communicationWays: {
      type: String,
    },
  },
  { timestamps: true }
)

ApplicationSchema.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: "all",
})

export default mongoose.model<IApplication>("Application", ApplicationSchema)
