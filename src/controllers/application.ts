import Application from "../models/application"
import { Request, Response } from "express"

import moment from "moment"
import { letTranslatedNamesByPlaceId } from "../utils"

export const create = async (req: Request, res: Response) => {
  try {
    let fields = req.body

    const newAppToDB = {
      ...fields,
      startLocation: {
        ...fields.startLocation,
        namesInLangs: await letTranslatedNamesByPlaceId(
          fields.startLocation.placeId
        ),
      },
      finishLocation: {
        ...fields.finishLocation,
        namesInLangs: await letTranslatedNamesByPlaceId(
          fields.finishLocation.placeId
        ),
      },
    }

    let application = new Application(newAppToDB)
    application.addedBy = req?.user?._id as string

    application.save((err, result) => {
      if (err) {
        console.log("saving application err => ", err)
        res.status(400).send("error_saving")
      }
      res.json(result)
    })
  } catch (err) {
    console.log(err)
    res.status(400).json({
      err,
    })
  }
}

export const applications = async (req: Request, res: Response) => {
  let findObject: {
    type?: string
    "startLocation.place_id"?: string
    "finishLocation.place_id"?: string
  } = {}

  const { startLocation, finishLocation, type } = req.query

  if (startLocation) {
    findObject["startLocation.place_id"] = startLocation as string
  }
  if (finishLocation) {
    findObject["finishLocation.place_id"] = finishLocation as string
  }
  if (type) {
    findObject["type"] = type as string
  }
  console.log(findObject)
  const nowTime = moment().toDate()
  const queryObject = {
    $or: [
      { ...findObject, type: "send" },
      {
        ...findObject,
        travelDate: {
          $gte: nowTime,
        },
      },
    ],
  }
  let all = await Application.find(queryObject)
    .limit(15)
    .populate("addedBy", "_id name")
    .sort({ createdAt: -1 })
    .lean()

  res.json(all)
}

export const myapplications = async (req: Request, res: Response) => {
  let all = await Application.find({ addedBy: req?.user?._id as string })
    .populate("addedBy", "_id name")
    .exec()

  res.send(all)
}

export const remove = async (req: Request, res: Response) => {
  let appToDelete = await Application.findById(req.params.applicationId).exec()
  console.log(appToDelete)
  if (appToDelete) {
    await appToDelete.delete()
  }
  res.json({ message: "application_deleted" })
}

export const read = async (req: Request, res: Response) => {
  let application = await Application.findById(req.params.applicationId)
    .populate("addedBy", "_id name")
    .exec()
  // console.log("SINGLE application", application);
  res.json(application)
}

export const update = async (req: Request, res: Response) => {
  try {
    let fields = req.body

    let data = { ...fields }

    let updated = await Application.findByIdAndUpdate(
      req.params.applicationId,
      data,
      {
        new: true,
      }
    )

    res.json(updated)
  } catch (err) {
    console.log(err)
    res.status(400).send("application update failed. Try again.")
  }
}
