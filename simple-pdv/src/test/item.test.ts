import request from "supertest";
import app from "../app";
import { describe } from "node:test";

const port = 3005;
const server = app.listen(port);

interface Item {
    quantity: number;
    itemId: string;
    productId: string;
    orderId: string;
}

describe('testing route item', () => {
    let newItem: Item;
    let accessToken: string;

    beforeAll(async () => {
        // Login com o usuário root para obter o token de acesso
        const loginRes = await request(server).post('/login').send({
            email: 'rootuser@user.com',
            password: 'admin123'
        }).expect(200);
        accessToken = loginRes.body.accessToken;

        // Criar uma ordem para associar o item
        const orderRes = await request(server).post('/order').set('Authorization', `Bearer ${accessToken}`).send({
            userId: 'someUserId',
            total: 100.0
        }).expect(200);
        
        newItem = {
            itemId: '',
            orderId: orderRes.body.orderId,
            productId: '8f504097-9374-48b8-8b3c-5ae84f9866ab',
            quantity: 123
        };
    });

    it('should get all items', async () => {
        const res = await request(server).get('/item').set('Authorization', `Bearer ${accessToken}`).expect(200);
        expect(res.body).toBeInstanceOf(Array);
    });

    it('should create an item', async () => {
        const res = await request(server).post('/item').set('Authorization', `Bearer ${accessToken}`).send(newItem).expect(200);
        newItem.itemId = res.body.itemId;
        expect(newItem.itemId).toBeDefined();
    });

    it('should update an item', async () => {
        newItem.quantity = 50;
        const res = await request(server).put(`/item/${newItem.itemId}`).set('Authorization', `Bearer ${accessToken}`).send(newItem).expect(200);
        expect(res.body.quantity).toBe(50);
    });

    it('should delete an item', async () => {
        await request(server).delete(`/item/${newItem.itemId}`).set('Authorization', `Bearer ${accessToken}`).expect(200);
    });
});
