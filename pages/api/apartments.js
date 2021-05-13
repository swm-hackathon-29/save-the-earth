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
function getNeighborApartments(latitude, longitude, neighbors, apartments) {
  let apartmentLocations = []
  const apartmentCodes = []
  for (const apartment of Object.values(apartments)) {
    if (apartment.latitude && apartment.longitude && apartment.latitude >= 0 && apartment.longitude >= 0) {
      apartmentLocations.push(latLongToXyz([apartment.latitude, apartment.longitude]))
      apartmentCodes.push(apartment.aptCode)
    }
  }

  const neighborAptCodes = []
  for (let k = 1; k < neighbors + 1; ++k) {
    if (apartmentCodes.length === 0)
      break
    const knn = new KNN(apartmentLocations, apartmentCodes, { k })
    neighborAptCodes.push(...knn.predict([latLongToXyz([latitude, longitude])]))
  }
  const neighborApartments = {}
  for (const aptCode of neighborAptCodes)
    neighborApartments[aptCode] = apartments[aptCode]
  return neighborApartments
}

export default async (req, res) => {
  const apartments = await fetchAllApartments()
  const latitude = req.query.latitude
  const longitude = req.query.longitude
  const neighbors = Number(req.query.neighbors || 1)
  if (latitude && longitude)
    return res.status(200).json(getNeighborApartments(Number(latitude), Number(longitude), neighbors, apartments))
  return res.status(200).json(apartments)
}

module.exports.fetchAllApartments = fetchAllApartments
