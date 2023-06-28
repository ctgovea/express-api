const request = require('supertest')
const app = require('../app')
const server = app.listen()

afterAll(() => server.close())

describe('Contracts Routes', () => {
  describe('GET /contracts', () => {
    test('responds with json', async () => {
      const response = await request(server)
        .get('/contracts')
        .set('profile_id', 1)
      expect(response.status).toBe(200)
    })

    test('responds with 401 when profile id is missing', async () => {
      const response = await request(server)
        .get('/contracts')
      expect(response.status).toBe(401)
    })
  })
})
