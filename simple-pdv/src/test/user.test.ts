import { describe } from "node:test"
import app from "../app"
import request from "supertest"

const port = 3003

const server = app.listen(port)


interface User {
    userId: string
    name: string
    password: string
    userName: string
    email: string
    data: string
    cpf: string
}

describe('test User routers', ()=> {

    beforeAll(async () => {
        const res = await request(server).post('/login').send({
            email: 'rootuser@user.com',
            password: 'admin123'
        })
        accessToken = res.body.accessToken
      })

    let accessToken = ''

    const user: User = {
        cpf: '12345678910',
        data: '171020',
        email: 'email@teste.com',
        name: 'usuario teste',
        password: 'password123',
        userName: 'testing123',
        userId: '123'
    }

    it('should create a user', async () => {
        const res = await request(server)
            .post('/user')
            .set('Authorization', `Bearer ${accessToken}`)
            .send(user)
            .expect(200)
        user.userId = res.body.userId
        expect(res.body.userId).toBeDefined()
    })

    it('should not create a duplicated user', async () => {
        await request(server)
            .post('/user')
            .send(user)
            .expect(401)
    })

    it('should not create a user with error in constraints', async () => {
        const newUser = {
            cpf: '1234',
            data: '171020',
            email: 'email@teste.com',
            name: 'usuario teste',
            password: 'pass',
            userName: 'testing123',
            userId: '123'
        }
        await request(server)
            .post('/user')
            .send(newUser)
            .expect(401)
    })

    it('should receive all users', async () => {
        const res = await request(server)
            .get('/user')
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(200)
        expect(res.body.length).toBeGreaterThanOrEqual(1)
    })

    it('should receive a user by ID', async () => {
        const res = await request(server)
            .get(`/user/${user.userId}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(200)
        expect(res.body.userId).toBe(user.userId)
    })

    it('should not receive a user by ID', async () => {
        await request(server)
            .get(`/user/${user.userId + 'error'}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(404)
    })

    it('should receive a user by userName', async () => {
        const res = await request(server)
            .get(`/user/userName/${user.userName}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(200)
        expect(res.body.userName).toBe(user.userName)
    })

    it('should not receive a user by userName', async () => {
        await request(server)
            .get(`/user/userName/${user.userName + 'error'}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(404)
    })

    it('should receive a user by name', async () => {
        const res = await request(server)
            .get(`/user/name/${user.name}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(200)
        expect(res.body.name).toBe(user.name)
    })

    it('should update a user name', async () => {
        user.name = 'test user updated'
        const res = await request(server)
            .put(`/user/${user.userId}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send(user)
            .expect(200)
        expect(res.body.name).toBe('test user updated')
    })

    it('should not update a user with wrong ID', async () => {
        await request(server)
            .put(`/user/${user.userId + 'erro'}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send(user)
            .expect(401)
    })


    it('should delete a user', async () => {
        const res = await request(server)
            .delete(`/user/${user.userId}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(200)
        expect(res.body = 'User deleted successfully')
    })
})
