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
const loginModel = require('../models/logins-model')
const passwordGenerator = require('../utils/pw-generator')
const encryptor = require('../utils/pw-encryption')
const api = supertest(app)

/**
 * Test Group: Initial Database State
 * --------------------------------------------------
 * Verifies seeded test data is correctly returned
 */
describe('Database contains preexisting documents', () => {

	test('Documents are returned in json format', async () => {
		await api
			.get('/api/logins')
			.expect(200)
			.expect('Content-Type', /application\/json/)
	})
  
	test('There are two documents', async () => {
		const response = await api.get('/api/logins')
  
		expect(response.body.data).toHaveLength(2)
	})
  
	test('The documents contain correct info', async () => {
		const response = await api.get('/api/logins')
		const passwords = response.body.data.map(response => response.pw)
  
		expect(passwords).toContain(helper.initialLoginInfo[0].pw)
		expect(passwords).toContain(helper.initialLoginInfo[1].pw)
	})
})

/**
 * Test Group: Creating New Login Entry
 * --------------------------------------------------
 * Ensures new login records can be added and validated.
 */
describe('Posting new document', () => {

	test('New document can be added', async () => {
		const newLogin = {
			website: 'TestWebsite'
		}
  
		await api
			.post('/api/login')
			.send(newLogin)
			.expect(201)
			.expect('Content-Type', /application\/json/)
  
		const response = await api.get('/api/logins')
		const websites = response.body.data.map(response => response.website)
  
		expect(websites).toContain('TestWebsite')
	})
  
	test('Document with empty website will not be added', async () => {
		const newLogin = {
			website: ''
		}
  
		await api
			.post('/api/login')
			.send(newLogin)
			.expect(400)
	})
})

/**
 * Test Group: Retrieving Specific Login
 * --------------------------------------------------
 * Verifies lookup by website parameter
 */
describe('Getting specific document', () => {
	
	test('Specific document can be found', async () => {
		const findLogin = {
			website: 'TestWebsite'
		}
  
		await api
			.get(`/api/login/${findLogin.website}`)
			.send(findLogin)
			.expect(200)
	})

	test('Specific document will not be found with empty website', async () => {
		const findLogin = {
			website: ''
		}
  
		await api
			.get(`/api/login/${findLogin.website}`)
			.send(findLogin)
			.expect(404)
	})
})

/**
 * Test Group: Updating Password
 * --------------------------------------------------
 * Ensures stored password data can be modified and validates
 * correct error handling
 */
describe('Changing specific document', () => {  

	test('Specific password can be changed' , async () => {
		const updateLogin = {
			website: 'TestWebsite',
			pw: 'newPassword'
		}
  
		await api
			.put(`/api/login/${updateLogin.website}`)
			.send(updateLogin)
			.expect(200)
  
		newLogin = await api
			.get(`/api/login/${updateLogin.website}`)
			.send({website: 'TestWebsite'})
			.expect(200)
  
		expect(newLogin.pw = updateLogin.pw)
	})

	test('Specific password will not be changed with empty website', async () => {
		const updateLogin = {
			website: '',
			pw: ''
		}
  
		await api
			.put(`/api/login/${updateLogin.website}`)
			.send(updateLogin)
			.expect(404)
	})
})

/**
 * Test Group: Deleting Login Entry
 * --------------------------------------------------
 * Confirms records can be removed and validates
 * correct error handling
 */
describe('Deleting specific document', () => {

	test('Document can be deleted', async () => {
		const deleteLogin = {
			website: 'TestWebsite'
		}
  
		await api
			.delete(`/api/login/${deleteLogin.website}`)
			.send(deleteLogin)
			.expect(200)
    
		const response = await api.get('/api/logins')
		const websites = response.body.data.map(response => response.website)
  
		expect(websites).toHaveLength(2)
	})

	test('Document will not be deleted with empty website ', async () => {
		const deleteLogin = {
			website: ''
		}
  
		await api
			.delete(`/api/login/${deleteLogin.website}`)
			.send(deleteLogin)
			.expect(404)
	})
})

/**
 * Test Setup & Teardown
 * --------------------------------------------------
 * beforeAll:
 * - Clears database
 * - Seeds initial test documents
 *
 * afterAll:
 * - Closes mongoose connection
 */
beforeAll(async () => {
	await loginModel.deleteMany({})
	
	let loginObject1 = new loginModel(helper.initialLoginInfo[0])
	await loginObject1.save()

	let loginObject2 = new loginModel(helper.initialLoginInfo[1])
	await loginObject2.save()
})

afterAll(() => {
	mongoose.connection.close()
})