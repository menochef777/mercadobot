import { describe } from "node:test";
import app from "../app";
import request from "supertest";

const port = 3001;
const server = app.listen(port);

interface Category {
    name: string;
    categoryId?: string;
    parentId?: string;
}

describe('test route category', () => {
    let newCategory: Category;
    let accessToken: string;

    beforeAll(async () => {
        // Login com o usuário root para obter o token de acesso
        const loginRes = await request(server).post('/login').send({
            email: 'rootuser@user.com',
            password: 'admin123'
        }).expect(200);
        accessToken = loginRes.body.accessToken;
    });

    it('should create a category', async () => {
        const category = { name: 'CategoryOfTest' };
        const res = await request(server)
            .post('/category')
            .set('Authorization', `Bearer ${accessToken}`)
            .send(category)
            .expect(200);
        newCategory = res.body;
        expect(res.body.name === 'CategoryOfTest');
    });

    it('should create a category with parent', async () => {
        const category: Category = { name: 'CategoryOfTestChild', parentId: newCategory.categoryId };
        const res = await request(server)
            .post('/category')
            .set('Authorization', `Bearer ${accessToken}`)
            .send(category)
            .expect(200);
        expect(res.body.name === 'CategoryOfTestChild');

        await request(server)
            .delete(`/category/${res.body.categoryId}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(200);
    });

    it('should get a category by name', async () => {
        const res = await request(server)
            .get(`/category/name/${newCategory.name}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(200);
        expect(res.body.name === newCategory.name);
    });

    it('should get a category by Id', async () => {
        const res = await request(server)
            .get(`/category/${newCategory.categoryId}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(200);
        expect(res.body.name === newCategory.name);
    });

    it('should not create a duplicate category', async () => {
        const category = { name: 'CategoryOfTest' };
        const res = await request(server)
            .post('/category')
            .set('Authorization', `Bearer ${accessToken}`)
            .send(category)
            .expect(400);
        expect(res.body === 'The category already exists');
    });

    it('should return all categories', async () => {
        const res = await request(server)
            .get('/category')
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(200);
        expect(res.body.length >= 1);
    });

    it('should delete a category', async () => {
        const res = await request(server)
            .delete(`/category/${newCategory.categoryId}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(200);
        expect(res.body.name === 'CategoryOfTest');
    });
});
