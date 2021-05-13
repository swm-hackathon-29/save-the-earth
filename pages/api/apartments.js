const axios = require('axios').default;
const redis = require('../../src/clients').redis
const fetchCities = require('./cities').fetchCities
const fetchApartmentsByCity = require('./apartments/[city]').fetchApartmentsByCity
const normed = require('ml-array-normed')
const KNN = require('ml-knn')
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL
const API_KEY_ENC = process.env.NEXT_PUBLIC_API_KEY_ENC
const API_KEY_DEC = process.env.NEXT_PUBLIC_API_KEY_DEC

async function fetchAllApartments() {
  const apartments = {}
  for (const apartmentsInCity of (await Promise.all(Object.keys(await fetchCities()).map(async (cityCode) => (await fetchApartmentsByCity(cityCode)))))) {
    for (const apartment of Object.values(apartmentsInCity))
      apartments[apartment.aptCode] = apartment
  }
  return apartments
}

function latLongToXyz(coords) {
  return [
    Math.cos(coords[0]) * Math.cos(coords[1]),
    Math.cos(coords[0]) * Math.sin(coords[1]),
    Math.sin(coords[1])
  ]
}

// https://datascience.stackexchange.com/questions/13567/ways-to-deal-with-longitude-latitude-feature
function getNeighborApartments(latitude, longtitude, neighbors, apartments) {
  let apartmentLocations = []
  const apartmentCodes = []
  for (const apartment of Object.values(apartments)) {
    if (apartment.latitude && apartment.longtitude && apartment.latitude >= 0 && apartment.longtitude >= 0) {
      apartmentLocations.push(latLongToXyz([apartment.latitude, apartment.longtitude]))
      apartmentCodes.push(apartment.aptCode)
    }
  }

  const neighborAptCodes = []
  for (let k = 1; k < neighbors + 1; ++k) {
    const knn = new KNN(apartmentLocations, apartmentCodes, { k })
    neighborAptCodes.push(...knn.predict([latLongToXyz([latitude, longtitude])]))
  }
  const neighborApartments = {}
  for (const aptCode of neighborAptCodes)
    neighborApartments[aptCode] = apartments[aptCode]
  console.log(neighborApartments)
  return neighborApartments
}

export default async (req, res) => {
  const apartments = await fetchAllApartments()
  const latitude = req.query.latitude
  const longtitude = req.query.longtitude
  const neighbors = Number(req.query.neighbors || 1)
  if (latitude && longtitude)
    return res.status(200).json(getNeighborApartments(Number(latitude), Number(longtitude), neighbors, apartments))
  return res.status(200).json(apartments)
}

module.exports.fetchAllApartments = fetchAllApartments
