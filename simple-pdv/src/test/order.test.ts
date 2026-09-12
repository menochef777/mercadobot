import { describe } from "node:test";
import app from "../app";
import request from "supertest";

interface Order {
    orderId: string;
    date: number;
    status: string;
    paymentMethod: string;
}

const port = 3004;
const server = app.listen(port);

describe('testing route order', () => {
    let order: Order = {
        date: Date.now(),
        paymentMethod: '',
        status: '',
        orderId: ''
    };
    let accessToken: string;

    beforeAll(async () => {
        // Login com o usuário root para obter o token de acesso
        const loginRes = await request(server).post('/login').send({
            email: 'rootuser@user.com',
            password: 'admin123'
        }).expect(200);
        accessToken = loginRes.body.accessToken;
    });

    it('should create an order', async () => {
        const res = await request(server)
            .post('/order')
            .set('Authorization', `Bearer ${accessToken}`)
            .send(order)
            .expect(200);
        order.orderId = res.body.orderId;
        expect(order.orderId).toBeDefined();
    });

    it('should get an order', async () => {
        const res = await request(server)
            .get(`/order/${order.orderId}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(200);
        expect(res.body.orderId).toBe(order.orderId);
    });

    it('should update an order', async () => {
        order.status = 'concluded';
        const res = await request(server)
            .put(`/order/${order.orderId}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send(order)
            .expect(200);
        expect(res.body.status === 'concluded');
    });

    it('should delete an order', async () => {
        await request(server)
            .delete(`/order/${order.orderId}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(200);
    });
});
