const axios = require('axios').default;
const redis = require('../../../src/clients').redis
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL
const API_KEY_ENC = process.env.NEXT_PUBLIC_API_KEY_ENC
const API_KEY_DEC = process.env.NEXT_PUBLIC_API_KEY_DEC
const fetchCities = require('../cities').fetchCities

async function fetchCityWastes(disYear, disMonth, cityCode) {
  const redisKey = 'city_wastes'
  const redisField = `${disYear}:${disMonth}:${cityCode}`
  let wastes = JSON.parse(await redis.hgetAsync(redisKey, redisField))

  if (wastes !== null)
    return {[cityCode]: wastes}

  wastes = []
  for (let page = 1; ; ++page) {
    try {
      const {data: {data: wastesRes}} = await axios.get(`${API_BASE_URL}/getCityDateList`, {
        params: {
          'ServiceKey': API_KEY_DEC,
          'type': 'json',
          disYear,
          disMonth,
          cityCode,
          page,
        }
      })
      if (wastesRes.list === null || wastesRes.list.length == 0)
        break;
      wastes.push(...wastesRes.list)
    } catch (err) {
      console.log(err.response?.data)
      break
    }
  }
  wastes.sort((a, b) => b.disDate - a.disDate)
  await redis.hmsetAsync(redisKey, redisField, JSON.stringify(wastes))

  return {[cityCode]: wastes}
}

async function fetchAllCitiesWastes(disYear, disMonth) {
  return Promise.all(
    Object.keys(await fetchCities())
    .flatMap(async (cityCode) => (await fetchCityWastes(disYear, disMonth, cityCode)))
  )
}

async function fetchCityWasteOfMonth(disYear, disMonth, cityCode) {
  const wastes = (await fetchCityWastes(disYear, disMonth, cityCode))[cityCode]

  return {
    [cityCode]: wastes.slice(1).reduce((a, b, idx, wastes) => ({
      ...a,
      disQuantity: a.disQuantity + b.disQuantity,
      disQuantityRate: a.disQuantityRate * (wastes.length - 1) / wastes.length + b.disQuantityRate / wastes.length,
      disCount: a.disCount + b.disCount,
      disCountRate: a.disCountRate * (wastes.length - 1) / wastes.length + b.disCountRate / wastes.length
    }), wastes[0])
    || []
  }
}

export default async (req, res) => {
  const date = new Date()
  const year = String(req.query.year || date.getFullYear()).padStart(4, '0')
  const month = String(req.query.month || date.getMonth() + 1).padStart(2, '0')
  const total = Boolean(req.query.total || false)
  const city = req.query.city
  if (city === 'all')
    return res.status(200).json(
      await fetchAllCitiesWastes(year, month)
    )
  else
    return res.status(200).json(
      total ? (await fetchCityWasteOfMonth(year, month, city))
      : (await fetchCityWastes(year, month, city))
    )
}
