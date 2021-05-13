const axios = require('axios').default;
const redis = require('../../src/clients').redis
const fetchCities = require('./cities').fetchCities
const fetchApartmentsByCity = require('./apartments/[city]').fetchApartmentsByCity
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL
const API_KEY_ENC = process.env.NEXT_PUBLIC_API_KEY_ENC
const API_KEY_DEC = process.env.NEXT_PUBLIC_API_KEY_DEC

async function fetchAllApartments() {
  return Promise.all(Object.keys(await fetchCities()).map(async (cityCode) => (await fetchApartmentsByCity(cityCode))))
}

export default async (req, res) => {
  return res.status(200).json(await fetchAllApartments())
}

module.exports.fetchAllApartments = fetchAllApartments
