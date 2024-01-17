const app = require('../app')
const request = require('supertest')
const db = require('../db/connection')
const seed = require('../db/seeds/seed')
const testData = require('../db/data/test-data/index')
const endpointsCheck = require('../endpoints.json')
require('jest-sorted')

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

describe('/api/articles/:article_id', () => {
    test('GET:200 sends one article object to the client', () => {
        return request(app).get('/api/articles/1')
        .expect(200)
        .then(({ body }) => {
            const { article } = body
            const [ articleObj ] = article

            expect(articleObj.article_id).toBe(1)
            
            expect(Object.keys(articleObj)).toEqual(['article_id', 'title', 'topic', 'author', 'body', 'created_at', 'votes', 'article_img_url'])
            expect(typeof articleObj.title).toBe('string')
            expect(typeof articleObj.topic).toBe('string')
            expect(typeof articleObj.author).toBe('string')
            expect(typeof articleObj.body).toBe('string')
            expect(typeof articleObj.created_at).toBe('string')
            expect(typeof articleObj.article_img_url).toBe('string')
        })
    })
    test('GET:404 sends an appropriate status and error message for a valid but non-existent id', () => {
        return request(app).get('/api/articles/20')
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe('article does not exist')
        })
    })
    test('GET:400 sends an appropriate status and error message for an invalid id', () => {
        return request(app).get('/api/articles/invalid_id')
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe('Bad request')
        })
    })
})

describe('/api/articles', () => {
    test('GET:200 sends an array of articles to client', () => {
        return request(app).get('/api/articles')
        .expect(200)
        .then(({ body:articles }) => {
            
            expect(([ articles ])).toBeSortedBy('date', {descending: true})

            articles.forEach((article) => {
                expect(article).toHaveProperty('author', expect.any(String))
                expect(article).toHaveProperty('title', expect.any(String))
                expect(article).toHaveProperty('article_id', expect.any(Number))
                expect(article).toHaveProperty('topic', expect.any(String))
                expect(article).toHaveProperty('created_at', expect.any(String))
                expect(article).toHaveProperty('votes', expect.any(Number))
                expect(article).toHaveProperty('article_img_url', expect.any(String))
                expect(article).toHaveProperty('comment_count', expect.any(String))
                expect(article).not.toHaveProperty('body')
            })
        })
    })
})

describe('/api/articles/:article_id/comments', () => {
    test('GET:200 sends an array of comments for the given article id', () => {
        return request(app).get('/api/articles/1/comments')
        .expect(200)
        .then(({ body }) => {
            const { comments } = body

            expect(comments).toBeSortedBy('created_at', {descending: true, coerce: true})
            expect(comments.length).toBe(11)
            
            comments.forEach((comment) => {
                expect(comment).toHaveProperty('comment_id', expect.any(Number))
                expect(comment).toHaveProperty('votes', expect.any(Number))
                expect(comment).toHaveProperty('created_at', expect.any(String))
                expect(comment).toHaveProperty('author', expect.any(String))
                expect(comment).toHaveProperty('body', expect.any(String))
                expect(comment).toHaveProperty('article_id', expect.any(Number))
            })
        })
    })
    test('GET:200 sends an appropriate message when article_id does not have any comments', () => {
        return request(app).get('/api/articles/7/comments')
        .expect(200)
        .then(({ body }) => {
            const { comments } = body
            expect(comments.msg).toBe('no comments found')
        })
        
    })
    test('GET:404 sends an appropriate status and error message for a valid but non-existent id', () => {
        return request(app).get('/api/articles/100/comments')
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe('article does not exist')
        })
    })
    test('GET:400 sends an appropriate status and error message for an invalid id', () => {
        return request(app).get('/api/articles/invalid_id/comments')
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe('Bad request')
        })
    })
})