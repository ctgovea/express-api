const profileService = require('./profiles.service')

describe('Profile Service Test', () => {
  describe('Get Profile', () => {
    test('should return a client profile', async () => {
      const client = await profileService.getProfileClient(1)

      expect(client).toEqual(expect.objectContaining({ id: 1 }))
    })

    test('should not return a contractor profile', async () => {
      const client = await profileService.getProfileClient(6)

      expect(client).toBe(null)
    })

    test('should throw when client id is missing', async () => {
      await expect(profileService.getProfileClient()).rejects.toThrow('The client id is required')
    })
  })
})
