const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../index')
const helper = require('./test-helper')
const loginModel = require('../models/logins-model')
const passwordGenerator = require('../utils/pw-generator')
const encryptor = require('../utils/pw-encryption')

const api = supertest(app)

test('Notes are returned in json format', async () => {
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

test('Specific document can be found', async () => {
  const findLogin = {
    website: 'TestWebsite'
  }

  await api
    .get(`/api/login/${findLogin.website}`)
    .send(findLogin)
    .expect(200)
})

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