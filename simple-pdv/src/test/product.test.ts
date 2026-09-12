import { describe } from "node:test";
import app from "../app";
import request from "supertest";

const port = 3002;
const server = app.listen(port);

interface Product {
    name: string;
    productId?: string;
    barcode: string;
    costPrice: number;
    description: string;
    discount?: number;
    price: number;
    sku: string;
    stockQuantity: number;
    weight?: number;
}

describe('test route product', () => {
    let newProduct: Product;
    let accessToken: string;

    beforeAll(async () => {
        // Login com o usuário root para obter o token de acesso
        const loginRes = await request(server).post('/login').send({
            email: 'rootuser@user.com',
            password: 'admin123'
        }).expect(200);
        accessToken = loginRes.body.accessToken;
    });

    const product: Product = {
        name: 'cavalo de troia',
        barcode: 'AJKSDFLKALKASDFHJ',
        costPrice: 300,
        description: 'a product',
        price: 500,
        sku: 'AJKSDFLKALKASDFHJAJKSDFLKALKASDFHJ',
        stockQuantity: 3
    };

    it('should create a product', async () => {
        const res = await request(server)
            .post('/product')
            .set('Authorization', `Bearer ${accessToken}`)
            .send(product)
            .expect(200);
        newProduct = res.body;
        expect(res.body.name === 'cavalo de troia');
    });

    it("should find a product", async () => {
        const productRes = await request(server)
            .get(`/product/${newProduct.productId}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(200);
        expect(productRes.body.name).toBe('cavalo de troia');
    });

    it('should not create a duplicated product', async () => {
        const res = await request(server)
            .post('/product')
            .set('Authorization', `Bearer ${accessToken}`)
            .send(product)
            .expect(400);
        expect(res.body === 'The product already exists');
    });

    it('should return all products', async () => {
        const res = await request(server)
            .get('/product')
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(200);
        expect(res.body.length >= 1);
    });

    it("shouldn't find a product", async () => {
        const res = await request(server)
            .get(`/product/${newProduct.productId}error`)
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(404);
        expect(res.body.length === 0);
    });

    it('should delete a product', async () => {
        const res = await request(server)
            .delete(`/product/${newProduct.productId}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(200);
        expect(res.body.productId === newProduct.productId);
    });
});
