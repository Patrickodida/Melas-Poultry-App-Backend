const request = require('supertest')
const app = require('../server')
const { v4: uuidv4 } = require('uuid'); // Import UUID for unique IDs

const { PrismaClient } = require('@prisma/client')

const Prisma = new PrismaClient()

let testTransactionId;
beforeEach(async () => {
    // Clear only the payment with the specific transactionId
    if(testTransactionId){
        await Prisma.payment.deleteMany({
            where: {transactionId: testTransactionId}
        });
    }
    // Reset the variable after clearing
    testTransactionId = null
});

describe('POST /payment/register', ()=>{
    it('should create a payment with valid data', async ()=>{
        const uniqueTransactionId = uuidv4();
        const response = await request(app)
        .post('/api/v1/payment/register')
        .send({
            orderId: 3,
            userId: 3,
            amount: 240500,
            status: 'Completed',
            paymentMethod: 'Cash',
            transactionId: uniqueTransactionId
        })
        console.log('Response Body:', response.body);
        expect(response.statusCode).toBe(200)
        expect(response.body.message).toBe('Successfully created a payment!')
    })

    it('should return 400 for invalid data', async ()=>{
        const response = await request(app)
        .post('/api/v1/payment/register')
        .send({
            orderId: 1,
            userId: 'INVALID',
            amount: -500,
        })
        expect(response.statusCode).toBe(400)
        expect(response.body.message).toBeDefined()
    })
})

describe('GET /api/v1/payment/paymentId', ()=>{
    test('Successfully retrieve a payment by paymentId', async ()=>{
        const uniqueTransactionId = uuidv4();
        // Mock payment
        const payment = await Prisma.payment.create({
            data: {
                orderId: 1,
                userId: 1,
                amount: 1000,
                status: 'Completed',
                paymentMethod: 'Cash',
                transactionId: uniqueTransactionId,
            }
        })
        const response = await request(app).get(`/api/v1/payment/${payment.paymentId}`)
        expect(response.statusCode).toBe(200)
        expect(response.body.payment).toHaveProperty('paymentId', payment.paymentId)
    });

    test('Fail to retrieve a non-existent payment', async ()=>{
        const response = await request(app).get(`/api/v1/payment/999`)
        expect(response.statusCode).toBe(404)
        expect(response.body.message).toBe('Payment not found!')
    })

    test('Successfully retrieve all payments', async ()=>{
        const response = await request(app).get('/api/v1/payment');
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Successfully retrieved all payments!')
    })

    test('Retrieve payments with a valid limit!', async ()=>{
        const response = await request(app).get('/api/v1/payment?results=2');
        expect(response.statusCode).toBe(200);
        expect(response.body.payment).toHaveLength(2);
    })

    test('Successfully update a payment with a valid paymentId', async ()=>{
        const response = await request(app).put('/api/v1/payment/21')
        .send({
            orderId: 1,
            userId: 1,
            amount: 200000,
            status: 'Pending',
            paymentMethod: 'CreditCard',
            transactionId: 'CC200' 
        })
        expect(response.statusCode).toBe(200)
    })

    test('Failed to update a payment with invalid data!', async ()=>{
        const response = await request(app).put('/api/v1/payment/22')
        .send({
            amount:-2000
        })
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBeDefined();
    })

    test('Successfully delete a payment with a valid paymentId', async ()=>{
        const response = await request(app).delete('/api/v1/payment/25')
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Successfully deleted payment!')
    })

    test('Failed to delete a payment with invalid payment format!', async ()=>{
        const response = await request(app).delete('/api/v1/payment/invalid-Id')
        expect(response.statusCode).toBe(500);
        expect(response.body.message).toBe('Error deleting payment!');
    })
})
