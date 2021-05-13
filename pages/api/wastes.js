const axios = require('axios').default;
const redis = require('../../src/clients').redis

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL
const API_KEY_ENC = process.env.NEXT_PUBLIC_API_KEY_ENC
const API_KEY_DEC = process.env.NEXT_PUBLIC_API_KEY_DEC

async function fetchWastes(disYear, disMonth) {
  const redisKey = 'wastes'
  const redisField = `${disYear}:${disMonth}`
  let wastes = JSON.parse(await redis.hgetAsync(
    redisKey, redisField
  ))
  if (wastes !== null)
    return wastes

  wastes = []
  for (let page = 1; ; ++page) {
    try {
      const {data: {data: wastesRes}} = await axios.get(`${API_BASE_URL}/getTotalDateList`, {
        params: {
          'ServiceKey': API_KEY_DEC,
          'type': 'json',
          disYear,
          disMonth,
          page
        }
      })
      if (wastesRes.list === null || wastesRes.list.length == 0)
        break
      wastes.push(...wastesRes.list)
    } catch (err) {
      console.log(err.response?.data)
      break
    }
  }
  await redis.hmsetAsync(redisKey, redisField, JSON.stringify(wastes), 'EX', 60 * 60 * 24)
  return wastes
}

async function fetchWasteOfMonth(disYear, disMonth) {
  const wastes = await fetchWastes(disYear, disMonth)

  return wastes.slice(1).reduce((a, b, idx, wastes) => ({
    ...a,
    disQuantity: a.disQuantity + b.disQuantity,
    disQuantityRate: a.disQuantityRate * (wastes.length - 1) / wastes.length + b.disQuantityRate / wastes.length,
    disCount: a.disCount + b.disCount,
    disCountRate: a.disCountRate * (wastes.length - 1) / wastes.length + b.disCountRate / wastes.length
  }), wastes[0])
  || []
}

export default async (req, res) => {
  const date = new Date()
  const year = String(req.query.year || date.getFullYear()).padStart(4, '0')
  const month = String(req.query.month || date.getMonth() + 1).padStart(2, '0')
  const total = Boolean(req.query.total || false)
  
  return res.status(200).json(
    total ? (await fetchWasteOfMonth(year, month))
    : (await fetchWastes(year, month))
  )
}
