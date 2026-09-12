import request from "supertest"
import app from "../app"

const port = 3006

const server = app.listen(port)

describe('testing route login', () => {
    it('should return a token and a refresh token', async () => {
        const res = await request(server).post('/login').send({
            email: 'rootuser@user.com',
            password: 'admin123'
        })

        expect(res.body.accessToken.length > 1 && res.body.refreshToken.length > 1)
    })
})