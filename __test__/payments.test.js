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
        const uniqueTransactionId = uuidv4(); // Generate a unique transactionId
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