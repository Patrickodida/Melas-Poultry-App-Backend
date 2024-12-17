const request = require('supertest');
const app = require('../server');
const { v4: uuidv4 } = require('uuid');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

let testTransactionId;

// Clean up database before each test if needed
// Delete all entries in the payment table
beforeEach(async () => {
    await prisma.payment.deleteMany({});
});

// Utility function for creating a mock payment
const createMockPayment = async (overrides = {}) => {
    const defaultData = {
        orderId: 1,
        userId: 1,
        amount: 1000,
        status: 'Completed',
        paymentMethod: 'Cash',
        transactionId: uuidv4(),
    };
    return await prisma.payment.create({ data: { ...defaultData, ...overrides } });
};

describe('Payment API Endpoints', () => {
    describe('POST /payment/register', () => {
        it('should create a payment with valid data', async () => {
            const mockPayment = await createMockPayment();
            testTransactionId = uuidv4();
            const response = await request(app)
                .post('/api/v1/payment/register')
                .send({
                    orderId: mockPayment.orderId,
                    userId: mockPayment.userId,
                    amount: 240500,
                    status: 'Completed',
                    paymentMethod: 'Cash',
                    transactionId: testTransactionId,
                });

            expect(response.statusCode).toBe(200);
            expect(response.body.message).toBe('Successfully created a payment!');
        });

        it('should return 400 for invalid data', async () => {
            const response = await request(app)
                .post('/api/v1/payment/register')
                .send({
                    orderId: 1,
                    userId: 'INVALID',
                    amount: -500,
                });

            expect(response.statusCode).toBe(400);
            expect(response.body.message).toBeDefined();
        });
    });

    describe('GET /api/v1/payment/:paymentId', () => {
        it('should retrieve a payment by paymentId', async () => {
            const mockPayment = await createMockPayment();
            const response = await request(app).get(`/api/v1/payment/${mockPayment.paymentId}`);

            expect(response.statusCode).toBe(200);
            expect(response.body.payment).toHaveProperty('paymentId', mockPayment.paymentId);
        });

        it('should return 404 for a non-existent payment', async () => {
            const response = await request(app).get(`/api/v1/payment/999`);
            expect(response.statusCode).toBe(404);
            expect(response.body.message).toBe('Payment not found!');
        });
    });

    describe('GET /api/v1/payment', () => {
        it('should retrieve all payments', async () => {
            const response = await request(app).get('/api/v1/payment');
            expect(response.statusCode).toBe(200);
            expect(response.body.message).toBe('Successfully retrieved all payments!');
        });

        it('should retrieve payments with a valid limit', async () => {
            await createMockPayment();
            await createMockPayment();
            const response = await request(app).get('/api/v1/payment?results=2');

            expect(response.statusCode).toBe(200);
            expect(response.body.payment).toHaveLength(2);
        });
    });

    describe('PUT /api/v1/payment/:paymentId', () => {
        it('should successfully update a payment with valid data', async () => {
            const mockPayment = await createMockPayment();
            const response = await request(app).put(`/api/v1/payment/${mockPayment.paymentId}`).send({
                orderId: mockPayment.orderId,
                userId: mockPayment.userId,
                amount: 200000,
                status: 'Pending',
                paymentMethod: 'CreditCard',
                transactionId: 'CC200',
            });

            expect(response.statusCode).toBe(200);
        });

        it('should fail to update a payment with invalid data', async () => {
            const mockPayment = await createMockPayment();
            const response = await request(app).put(`/api/v1/payment/${mockPayment.paymentId}`).send({
                amount: -2000,
            });

            expect(response.statusCode).toBe(400);
            expect(response.body.message).toBeDefined();
        });
    });

    describe('DELETE /api/v1/payment/:paymentId', () => {
        it('should successfully delete a payment with a valid paymentId', async () => {
            const mockPayment = await createMockPayment();
            const response = await request(app).delete(`/api/v1/payment/${mockPayment.paymentId}`);

            expect(response.statusCode).toBe(200);
            expect(response.body.message).toBe('Successfully deleted payment!');
        });

        it('should fail to delete a payment with an invalid ID format', async () => {
            const response = await request(app).delete('/api/v1/payment/invalid-Id');

            expect(response.statusCode).toBe(500);
            expect(response.body.message).toBe('Error deleting payment!');
        });
    });
});

// Clean up after all tests
afterAll(async () => {
    await prisma.$disconnect();
});

