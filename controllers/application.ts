import Application from "../models/application"
import { Request, Response } from "express"
import axios from "axios"
import moment from "moment"

export const create = async (req: Request, res: Response) => {
  try {
    let fields = req.body

    let application = new Application(fields)
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

  const { startLocation, finishLocation, travelDate, type } = req.query

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
    .sort({createdAt: -1})
    .lean()
  console.log("req.query")
  const allWithLocalCityName = await Promise.all(
    all.map(async (itm) => {
      const startCityInfoLoc = await axios.get(
        `https://maps.googleapis.com/maps/api/place/details/json?fields=name&place_id=${itm.startLocation.place_id}&key=AIzaSyAKZsE1FtzbP9zpg8YSQWxe8h1i1Ss8qmE`,
        {
          headers: {
            "Accept-Language": req.query.currentLng as string,
          },
        }
      )
      const finishCityInfoLoc = await axios.get(
        `https://maps.googleapis.com/maps/api/place/details/json?fields=name&place_id=${itm.finishLocation.place_id}&key=AIzaSyAKZsE1FtzbP9zpg8YSQWxe8h1i1Ss8qmE`,
        {
          headers: {
            "Accept-Language": req.query.currentLng as string,
          },
        }
      )
      return {
        ...itm,
        startCityInfoLoc: startCityInfoLoc.data.result?.name || "",
        finishCityInfoLoc: finishCityInfoLoc.data.result?.name || "",
      }
    })
  )

  res.json(allWithLocalCityName)
}

export const myapplications = async (req: Request, res: Response) => {
  let all = await Application.find({ addedBy: req?.user?._id as string })
    .populate("addedBy", "_id name")
    .exec()

  res.send(all)
}

export const remove = async (req: Request, res: Response) => {
  let appToDelete = await Application.findById(
    req.params.applicationId
  ).exec()
  console.log(appToDelete)
  if (appToDelete) {
    await appToDelete.delete()
  }
  res.json({message: "application_deleted"})
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

// export const userApplicationBookings = async (req: Request, res: Response) => {
//   const all = await Order.find({ orderedBy: req.user._id })
//     .select("session")
//     .populate("application", "-image.data")
//     .populate("addedBy", "_id name")
//     .exec();
//   res.json(all);
// };

// export const isAlreadyBooked = async (req: Request, res: Response) => {
//   const { applicationId } = req.params;
//   // find orders of the currently logged in user
//   const userOrders = await Order.find({ orderedBy: req.user._id })
//     .select("application")
//     .exec();
//   // check if application id is found in userOrders array
//   let ids = [];
//   for (let i = 0; i < userOrders.length; i++) {
//     ids.push(userOrders[i].application.toString());
//   }
//   res.json({
//     ok: ids.includes(applicationId),
//   });
// };

export const searchListings = async (req: Request, res: Response) => {
  const { location, date, bed } = req.body
  // console.log(location, date, bed);
  // console.log(date);
  const fromDate = date.split(",")
  // console.log(fromDate[0]);
  let result = await Application.find({
    from: { $gte: new Date(fromDate[0]) },
    location,
  })
    .select("-image.data")
    .exec()
  // console.log("SEARCH LISTINGS", result);
  res.json(result)
}
