import mongoose from "mongoose"
import { IUser } from "./user"

const { Schema } = mongoose

interface IApplication extends mongoose.Document {
  _id: string
  title: string
  description: string
  startLocation: {
    formatted_address: string
    place_id: string
    types: string[]
  }
  finishLocation: {
    formatted_address: string
    place_id: string
    types: string[]
  }
  type: 'send' | 'take'
  pricePerKg: number
  travelDate: string
  addedBy: IUser["_id"]
  cargoInfo: {
    willNotTake: string
    iCanGoAndBuy: boolean
  }
  createdAt: string
  updatedAt: string
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
      default: 'send',
    },
    startLocation: {
      formatted_address: {
        type: String,
      },
      place_id: {
        type: String,
        default: false,
      },
      types: [
        {
          type: String,
        },
      ],
    },
    finishLocation: {
      formatted_address: {
        type: String,
      },
      place_id: {
        type: String,
        default: false,
      },
      types: [
        {
          type: String,
        },
      ],
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
  },
  { timestamps: true }
)

export default mongoose.model<IApplication>("Application", ApplicationSchema)
