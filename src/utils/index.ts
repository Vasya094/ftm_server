import axios from "axios"

export const letTranslatedNamesByPlaceId = async (placeId: string) => {
  const supportedLangs: string[] = ["en", "ru", "ar"]

  const namesObject: { [key: string]: string } = {}

  await Promise.all(
    supportedLangs.map(async (lng) => {
      const startCityInfoLoc = await axios.get(
        `https://maps.googleapis.com/maps/api/place/details/json?fields=name&place_id=${placeId}&key=AIzaSyAKZsE1FtzbP9zpg8YSQWxe8h1i1Ss8qmE`,
        {
          headers: {
            "Accept-Language": lng as string,
          },
        }
      )
      namesObject[lng] = startCityInfoLoc.data.result?.name
    })
  )

  return namesObject
}
