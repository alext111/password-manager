/**
 * Integration Test Suite – Login API & Database
 * ------------------------------------------------------------------
 * This test suite verifies the behavior of the Login API endpoints
 * and their interaction with the MongoDB database.
 *
 * The tests cover:
 * - Retrieving existing login records
 * - Creating new login entries
 * - Fetching a specific login by website
 * - Updating a stored password
 * - Deleting a login entry
 *
 * Testing Stack:
 * - Jest (test runner)
 * - Supertest (HTTP assertions)
 * - Mongoose (database interaction)
 */


const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../index')
const helper = require('./test-helper')
const credentialsModel = require('../models/credentials-model')
const passwordGenerator = require('../utils/pw-generator')
const encryptor = require('../utils/pw-encryption')
const api = supertest(app)
const { MongoMemoryServer } = require('mongodb-memory-server')
const user = require('../models/user-model')

require('dotenv').config({ path: '../.env'})

let token
let userId
let mongoServer

/**
 * Test Setup & Teardown
 * --------------------------------------------------
 * beforeAll:
 * - Create database connection
 * 
 * beforeEach:
 * - Clears database
 * - Seeds initial test documents
 *
 * afterAll:
 * - Closes mongoose connection
 */
beforeAll(async () => {
  // Start in-memory MongoDB instance
  mongoServer = await MongoMemoryServer.create()
  const mongoUri = mongoServer.getUri()

  // Connect mongoose to in-memory DB
  await mongoose.connect(mongoUri)
})

beforeEach(async () => {
  // Clear and seed DB
  await credentialsModel.deleteMany({})
  await user.deleteMany({})

  // Create user
  const newUser = {
    username: 'testuser',
    password: 'testpassword'
  }

  await api.post('/api/auth/register').send(newUser)

  // Login to get token
  const loginRes = await api.post('/api/auth/login').send(newUser)

  token = loginRes.body.token
  userId = loginRes.body.id

  // Seed credentials WITH userId
  const credentialsInfo1 = new credentialsModel({
    ...helper.initialLoginInfo[0],
    userId
  })

  const credentialsInfo2 = new credentialsModel({
    ...helper.initialLoginInfo[1],
    userId
  })

  await credentialsInfo1.save()
  await credentialsInfo2.save()
})

afterAll(async () => {
  await mongoose.connection.dropDatabase()
  await mongoose.connection.close()
  await mongoServer.stop()
})

/**
 * Test Group: Authenticate User
 * --------------------------------------------------
 * Verifies user authentication functionality
 */
describe('Authentication', () => {
	test('Request fails without token', async () => {
		await api
			.get('/api/credentials')
			.expect(401)
	})

	test('User cannot access another user credentials', async () => {
		// create second user
		const user2 = { username: 'user2', password: 'password123' }
		await api.post('/api/auth/register').send(user2)
		const login2 = await api.post('/api/auth/login').send(user2)

		const token2 = login2.body.token

		const response = await api
			.get('/api/credentials')
			.set('Authorization', `Bearer ${token2}`)

		expect(response.body.data).toHaveLength(0)
	})
})


/**
 * Test Group: Initial Database State
 * --------------------------------------------------
 * Verifies seeded test data is correctly returned
 */
describe('Database contains preexisting documents', () => {

	test('Documents are returned in json format', async () => {
		await api
			.get('/api/credentials')
			.set('Authorization', `Bearer ${token}`)
			.expect(200)
			.expect('Content-Type', /application\/json/)
	})
  
	test('There are two documents', async () => {
		const response = await api.get('/api/credentials').set('Authorization', `Bearer ${token}`)
  
		expect(response.body.data).toHaveLength(2)
	})
  
	test('The documents contain correct info', async () => {
		const response = await api.get('/api/credentials').set('Authorization', `Bearer ${token}`)
		const passwords = response.body.data.map(response => response.pw)
  
		expect(passwords).toContain(helper.initialLoginInfo[0].pw)
		expect(passwords).toContain(helper.initialLoginInfo[1].pw)
	})
})

/**
 * Test Group: Registering New User
 * --------------------------------------------------
 * Ensures new user can be registered with proper error handling.
 */
describe('User Registration', () => {

  test('Fails with missing username', async () => {
    await api
      .post('/api/auth/register')
      .send({ password: 'password123' })
      .expect(400)
  })

  test('Fails with missing password', async () => {
    await api
      .post('/api/auth/register')
      .send({ username: 'user1' })
      .expect(400)
  })

  test('Fails with short password', async () => {
    await api
      .post('/api/auth/register')
      .send({ username: 'user1', password: '123' })
      .expect(400)
  })

  test('Fails with duplicate username', async () => {
    const newUser = { username: 'duplicateUser', password: 'password123' }

    await api.post('/api/auth/register').send(newUser)

    await api
      .post('/api/auth/register')
      .send(newUser)
      .expect(409)
  })
})

/**
 * Test Group: User Login
 * --------------------------------------------------
 * Ensures existing user can login with correct auth token creation and error handling.
 */
describe('User Login', () => {

  test('Fails with non-existent user', async () => {
    await api
      .post('/api/auth/login')
      .send({ username: 'nouser', password: 'password123' })
      .expect(401)
  })

  test('Fails with incorrect password', async () => {
    const user = { username: 'loginuser', password: 'password123' }

    await api.post('/api/auth/register').send(user)

    await api
      .post('/api/auth/login')
      .send({ username: 'loginuser', password: 'wrongpassword' })
      .expect(401)
  })

  test('Login returns a token', async () => {
    const user = { username: 'tokenuser', password: 'password123' }

    await api.post('/api/auth/register').send(user)

    const res = await api
      .post('/api/auth/login')
      .send(user)
      .expect(200)

    expect(res.body.token).toBeDefined()
    expect(typeof res.body.token).toBe('string')
  })
})

/**
 * Test Group: Authentication Edge Cases
 * --------------------------------------------------
 * Verifies handling of incorrect authentication tokens.
 */
describe('Authentication edge cases', () => {

  test('Fails with malformed token', async () => {
    await api
      .get('/api/credentials')
      .set('Authorization', 'Bearer invalidtoken')
      .expect(401)
  })

  test('Fails with missing Bearer prefix', async () => {
    await api
      .get('/api/credentials')
      .set('Authorization', token)
      .expect(401)
  })
})

/**
 * Test Group: Creating New Login Entry
 * --------------------------------------------------
 * Ensures new login records can be added and validated.
 */
describe('Posting new document', () => {

	test('New document can be added', async () => {
		const newCredentials = {
			website: 'NewWebsite'
		}
  
		await api
			.post('/api/credentials')
			.set('Authorization', `Bearer ${token}`)
			.send(newCredentials)
			.expect(201)
			.expect('Content-Type', /application\/json/)
  
		const response = await api.get('/api/credentials').set('Authorization', `Bearer ${token}`)
		const websites = response.body.data.map(response => response.website)
  
		expect(websites).toContain('NewWebsite')
	})
  
	test('Document with empty website will not be added', async () => {
		const newCredentials = {
			website: ''
		}
  
		await api
			.post('/api/credentials')
			.set('Authorization', `Bearer ${token}`)
			.send(newCredentials)
			.expect(400)
	})
})

/**
 * Test Group: Retrieving Specific Credentials
 * --------------------------------------------------
 * Verifies lookup by website parameter
 */
describe('Getting specific document', () => {
	
	test('Specific document can be found', async () => {
		const findCredentials = {
			website: 'TestWebsite1'
		}
  
		await api
			.get(`/api/credentials/${findCredentials.website}`)
			.set('Authorization', `Bearer ${token}`)
			.send(findCredentials)
			.expect(200)
	})

	test('Fails when website does not exist', async () => {
		await api
			.get('/api/credentials/nonexistent')
			.set('Authorization', `Bearer ${token}`)
			.expect(404)
	})

	/*
	//validation moved to frontend
	test('Specific document will not be found with empty website', async () => {
		const findCredentials = {
			website: ''
		}
  
		await api
			.get(`/api/credentials/${findCredentials.website}`)
			.send(findCredentials)
			.expect(400)
	})
	*/
})

/**
 * Test Group: Updating Password
 * --------------------------------------------------
 * Ensures stored password data can be modified and validates
 * correct error handling
 */
describe('Changing specific document', () => {  

	test('Specific password can be changed' , async () => {
		const updateCredentials = {
			website: 'TestWebsite1',
			pw: 'newPassword'
		}
  
		await api
			.put(`/api/credentials/${updateCredentials.website}`)
			.set('Authorization', `Bearer ${token}`)
			.send(updateCredentials)
			.expect(200)
  
		const response = await api
			.get(`/api/credentials/${updateCredentials.website}`)
			.set('Authorization', `Bearer ${token}`)
			.send({website: 'TestWebsite1'})
			.expect(200)

		const encrypted = response.body.data.pw
		const iv = response.body.data.iv
		const salt = response.body.data.salt
		const decrypted = encryptor.decrypt({pw: encrypted, iv: iv, salt: salt})
		
		expect(encrypted).not.toBe(updateCredentials.pw) // not plaintext
		expect(decrypted).toBe(updateCredentials.pw)
	})

	test('Specific password will not be changed with empty website', async () => {
		const updateCredentials = {
			website: '',
			pw: 'TestPassword'
		}
  
		await api
			.put(`/api/credentials/${updateCredentials.website}`)
			.set('Authorization', `Bearer ${token}`)
			.send(updateCredentials)
			.expect(404)
	})

	test('Specific password will not be changed with empty password', async () => {
		const updateCredentials = {
			website: 'TestWebsite1',
			pw: ''
		}
  
		await api
			.put(`/api/credentials/${updateCredentials.website}`)
			.set('Authorization', `Bearer ${token}`)
			.send(updateCredentials)
			.expect(400)
	})

	test('Fails when website does not exist', async () => {
		await api
			.put('/api/credentials/nonexistent')
			.set('Authorization', `Bearer ${token}`)
			.send({ website: 'nonexistent', pw: 'newpass' })
			.expect(404)
	})
})

/**
 * Test Group: Deleting Credentials Entry
 * --------------------------------------------------
 * Confirms records can be removed and validates
 * correct error handling
 */
describe('Deleting specific document', () => {

	test('Document can be deleted', async () => {
		const deleteCredentials = {
			website: 'TestWebsite1'
		}
  
		await api
			.delete(`/api/credentials/${deleteCredentials.website}`)
			.set('Authorization', `Bearer ${token}`)
			.send(deleteCredentials)
			.expect(200)
    
		const response = await api.get('/api/credentials').set('Authorization', `Bearer ${token}`)
		const websites = response.body.data.map(response => response.website)
  
		expect(websites).toHaveLength(1)
	})

	test('Document will not be deleted with empty website ', async () => {
		const deleteCredentials = {
			website: ''
		}
  
		await api
			.delete(`/api/credentials/${deleteCredentials.website}`)
			.set('Authorization', `Bearer ${token}`)
			.send(deleteCredentials)
			.expect(404)
	})

	test('Fails when deleting non-existent website', async () => {
		await api
			.delete('/api/credentials/nonexistent')
			.set('Authorization', `Bearer ${token}`)
			.expect(404)
	})
})

/**
 * Test Group: Decrypting Password
 * --------------------------------------------------
 * Confirms passwords can be decrypted correctly and validates
 * correct error handling
 */
describe('Decrypting password', () => {

  test('Password is decrypted correctly for valid website', async () => {
    const website = helper.initialLoginInfo[0].website

    const response = await api
      .get(`/api/decrypt/${website}`)
	  .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body.data).toBeDefined()
    expect(typeof response.body.data).toBe('string')
  })

  test('Decrypt fails for non-existent website', async () => {
    await api
      .get('/api/decrypt/nonexistent.com')
	  .set('Authorization', `Bearer ${token}`)
      .expect(404)
  })

  test('Decrypt fails for empty website', async () => {
    await api
      .get('/api/decrypt/')
	  .set('Authorization', `Bearer ${token}`)
      .expect(404)
  })
})