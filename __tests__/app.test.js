const app = require('../app')
const request = require('supertest')
const db = require('../db/connection')
const seed = require('../db/seeds/seed')
const testData = require('../db/data/test-data/index')
const endpointsCheck = require('../endpoints.json')

beforeEach(() => {
    return seed(testData)
})

afterAll(() => {
    return db.end()
})

describe('/api', () => {
    test('GET:200 sends an object describing all available endpoints', () => {
        return request(app).get('/api')
        .expect(200)
        .then(({ body }) => {
            expect(typeof body.endpoints).toBe('object')
            expect(Object.entries(body.endpoints)).toEqual(Object.entries(endpointsCheck))
        })
    })
})

describe('/api/topics', () => {
    test('GET:200 sends an array of topics to the client', () => {
        return request(app).get('/api/topics')
        .expect(200)
        .then(({body}) => {
            expect(Array.isArray(body)).toBe(true)
            expect(body).toHaveLength(3)
            body.forEach((topic) => {
                expect(topic).toHaveProperty('description', expect.any(String))
                expect(topic).toHaveProperty('slug', expect.any(String))
            })
        })
    })
    test('GET:404 when route does not exist', () => {
        return request(app).get('/api/not_a_route')
        .expect(404)
    })
})