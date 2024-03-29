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

describe('/api/articles', () => {
    test('GET:200 sends an array of articles to client', () => {
        return request(app).get('/api/articles')
        .expect(200)
        .then(({ body:articlesObj }) => {
            const { articles } = articlesObj
            
            expect((articles)).toBeSortedBy('created_at', {descending: true})
            expect((articles)).toHaveLength(13)
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
    test('GET:200 sends an array of articles to client if query is not provided', () => {
        return request(app).get('/api/articles?topic =')
        .expect(200)
        .then(({ body:articlesObj }) => {
            const { articles } = articlesObj
            
            expect((articles)).toBeSortedBy('created_at', {descending: true})
            expect((articles)).toHaveLength(13)
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
    test('GET:200 sends an array of articles to client filtered by topic', () => {
        return request(app).get('/api/articles?topic=cats')
        .expect(200)
        .then(({ body }) => {
            const { articles } = body
           
            expect(articles).toHaveLength(1)
            articles.forEach((article) => {
                expect(article.topic).toContain('cats')
                expect(article).toHaveProperty('author', expect.any(String))
                expect(article).toHaveProperty('title', expect.any(String))
                expect(article).toHaveProperty('article_id', expect.any(Number))
                expect(article).toHaveProperty('created_at', expect.any(String))
                expect(article).toHaveProperty('votes', expect.any(Number))
                expect(article).toHaveProperty('article_img_url', expect.any(String))
                expect(article).toHaveProperty('comment_count', expect.any(String))
                expect(article).not.toHaveProperty('body')
            })
        })
    })
    test('GET: 404 sends an approrpriate status and error message if topic does not exist', () => {
        return request(app).get('/api/articles?topic=30')
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe('Topic does not exist')
        })
    })
    test('GET:200 responds with an empty array when topic is valid does not have associated articles', () => {
        return request(app).get('/api/articles?topic=paper')
        .expect(200)
        .then(({ body }) => {
           expect(body.articles).toEqual([])
        })
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
            
            expect(article).toHaveLength(1)
            expect(typeof articleObj.title).toBe('string')
            expect(typeof articleObj.topic).toBe('string')
            expect(typeof articleObj.author).toBe('string')
            expect(typeof articleObj.body).toBe('string')
            expect(typeof articleObj.created_at).toBe('string')
            expect(typeof articleObj.article_img_url).toBe('string')
        })
    })
    test('GET:200 sends one article object to the client', () => {
        return request(app).get('/api/articles/1')
        .expect(200)
        .then(({ body }) => {
            const { article } = body
            const [ articleObj ] = article

            expect(articleObj.article_id).toBe(1)
            
            expect(article).toHaveLength(1)
            expect(typeof articleObj.title).toBe('string')
            expect(typeof articleObj.topic).toBe('string')
            expect(typeof articleObj.author).toBe('string')
            expect(typeof articleObj.body).toBe('string')
            expect(typeof articleObj.created_at).toBe('string')
            expect(typeof articleObj.article_img_url).toBe('string')
            expect(typeof articleObj.comment_count).toBe('string')
        })
    })
    test('GET:404 sends an appropriate status and error message for a valid but non-existent id', () => {
        return request(app).get('/api/articles/20')
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe('Article does not exist')
        })
    })
    test('GET:400 sends an appropriate status and error message for an invalid id', () => {
        return request(app).get('/api/articles/invalid_id')
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe('Bad request')
        })
    })
    test('PATCH:200 updates db and sends updated article back to the client', () => {
        return request(app).patch('/api/articles/2')
        .send({inc_votes: -10})
        .expect(200)
        .then(({ body }) => {
            const { updatedArticle:article } = body
            const  [ articleObj ] = article

            expect(articleObj.votes).toBe(-10)

            expect(articleObj).toMatchObject({
                article_id: 2,
                title: "Sony Vaio; or, The Laptop",
                topic: "mitch",
                author: "icellusedkars",
                body: `Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.`,
                votes: -10,
                created_at: '2020-10-16T05:03:00.000Z',
               article_img_url: "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
            })
            
        })
    })
    test('PATCH:400 responds with an appropriate status and error message for bad requests (no votes)', () => {
        return request(app).patch('/api/articles/1')
        .send({})
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe('Bad request')
        })
    })
    test('PATCH:400 responds with an appropriate status and error message for bad requests (invalid input)', () => {
        return request(app).patch('/api/articles/1')
        .send({inc_votes: 'twenty'})
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe('Bad request')
        })
    })
    test('PATCH:404 responds with an appropriate status and error message for valid but non existent article id', () => {
        return request(app).patch('/api/articles/555')
        .send({inc_votes: 20})
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe('Article does not exist')
        })
    })
    test('PATCH:400 responds with an appropriate status and error message for invalid article id', () => {
        return request(app).patch('/api/articles/five')
        .send({inc_votes: 50})
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe('Bad request')
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
    test('GET:200 sends an empty array when article_id does not have any comments', () => {
        return request(app).get('/api/articles/7/comments')
        .expect(200)
        .then(({ body }) => {
            const { comments } = body
            expect(comments).toEqual([])
        })
        
    })
    test('GET:404 sends an appropriate status and error message for a valid but non-existent id', () => {
        return request(app).get('/api/articles/100/comments')
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe('Article does not exist')
        })
    })
    test('POST:201 inserts a new comment to the db and sends the new comment back to the client', () => {
        const newComment = {
            user_name: 'lurker',
            body: 'Cats are excellent creatures.'
        }
        return request(app).post('/api/articles/1/comments')
        .send(newComment)
        .expect(201)
        .then(({ body }) => {
            const { comment } = body
            const [ commentObj ] = comment

            expect(commentObj.article_id).toBe(1)
            expect(commentObj).toMatchObject({
                comment_id: 19,
                body: 'Cats are excellent creatures.',
                author: 'lurker'
            })
        })
    })
    test('POST:201 ignores additional properties, inserts a new comment to the db and sends the new comment back to the client)', () => {
        return request(app).post('/api/articles/4/comments')
        .send({
            user_name: 'icellusedkars',
            body: 'ragdolls, absyinnian and domestic shorthair',
            order: 'Carnivora',
            suborder: 'feliformia'
        })
        .expect(201)
        .then(({ body }) => {
            const { comment } = body
             const [ commentObj ] = comment

            expect(commentObj.article_id).toBe(4)
            expect(commentObj).not.toContain('Carnivora')
            expect(commentObj).not.toContain('feliformia')

            expect(commentObj).toMatchObject({
                comment_id: 19,
                body: 'ragdolls, absyinnian and domestic shorthair',
                author: 'icellusedkars'
            })
        })
    })
    test('POST:400 responds with an appropriate status and error message for bad requests (no username)', () => {
        return request(app).post('/api/articles/1/comments')
        .send({
            body: 'Cougars and caracals.'
        })
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe('Bad request')
        })
    })
    test('POST:400 responds with an appropriate status and error message for bad requests (no body)', () => {
        return request(app).post('/api/articles/1/comments')
        .send({
            user_name: 'lurker'
        })
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe('Bad request')
        })
    })
    test('POST:404 responds with an appropriate status and error message for non existent user', () => {
        return request(app).post('/api/articles/3/comments')
        .send({
            user_name: 'rando',
            body: 'creeper'
        })
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe('User not found')
        })
    })
    test('POST: 404 responds with an appropriate status and error message for valid but non existent id', () => {
        return request(app).post('/api/articles/88/comments')
        .send({
            user_name: 'butter_bridge',
            body: 'margarine'
        })
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe('Article does not exist')
        })
    })
    test('POST: 400 responds with an appropriate status and error message for invalid id', () => {
        return request(app).post('/api/articles/invalid/comments')
        .send({
            user_name: 'butter_bridge',
            body: 'margarine'
        })
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe('Bad request')
        })
    })
})

describe('/api/comments/:comment_id', () => {
    test('DELETE:204 deletes requested comment and does not send response', () => {
        return request(app).delete('/api/comments/5').expect(204)
    })
    test('DELETE:404 responds with an appropriate status and error message when given a non-existent id', () => {
        return request(app)
          .delete('/api/comments/99')
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe('Comment does not exist');
          });
      });
      test('DELETE:400 responds with an appropriate status and error message when given an invalid id', () => {
        return request(app)
          .delete('/api/comments/invalid')
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe('Bad request')
          })
      })
})

describe('/api/users', () => {
    test('GET:400 sends an array of users to the client', () => {
        return request(app).get('/api/users')
        .expect(200)
        .then(({ body }) => {
            const { users } = body

            expect(users).toHaveLength(4)
            users.forEach((user) => {
                expect(user).toHaveProperty('username', expect.any(String))
                expect(user).toHaveProperty('name', expect.any(String))
                expect(user).toHaveProperty('avatar_url', expect.any(String))
            })
        })
    })
})
