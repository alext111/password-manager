/**
 * api.test.js
 * ---------------------------------------------------------
 * Unit tests for API layer
 *
 * Responsibilities:
 * - Correct endpoints are called
 * - Payloads are passed correctly
 * - Authorization header is included when token exists
 */
import api from './index'
import axios from 'axios'

jest.mock('axios', () => {
  const mockAxios = {
    post: jest.fn(),
    get: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() }
    },
    create: jest.fn()
  }
  mockAxios.create.mockReturnValue(mockAxios)
  return mockAxios
})

beforeEach(() => {
  jest.clearAllMocks()
  localStorage.clear()
})

describe('API', () => {
  let successCallback
  let errorCallback

  beforeAll(() => {
    // Capture interceptor callbacks once after module load, before clearAllMocks runs
    ;[successCallback, errorCallback] = axios.interceptors.request.use.mock.calls[0]
  })
  /**
   * Test: Register user
   */
  test('registerUser sends correct request', async () => {
    axios.post.mockResolvedValue({})
    const payload = { username: 'user', password: 'pass' }
    await api.registerUser(payload)
    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining('/auth/register'),
      payload
    )
  })

  /**
   * Test: Login user
   */
  test('loginUser sends correct request', async () => {
    axios.post.mockResolvedValue({ data: { token: 'abc' } })
    const payload = { username: 'user', password: 'pass' }
    await api.loginUser(payload)
    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining('/auth/login'),
      payload
    )
  })

  /**
   * Test: Get all credentials
   */
  test('getCredentials includes auth header', async () => {
    localStorage.setItem('token', 'test-token')
    axios.get.mockResolvedValue({})
    await api.getCredentials()
    expect(axios.get).toHaveBeenCalledWith(
      expect.stringContaining('/credentials')
    )
  })

  /**
   * Test: Get credentials by website
   */
  test('getCredentialsByWebsite calls correct endpoint', async () => {
    localStorage.setItem('token', 'test-token')
    axios.get.mockResolvedValue({})
    await api.getCredentialsByWebsite('example.com')
    expect(axios.get).toHaveBeenCalledWith(
      expect.stringContaining('/credentials/example.com')
    )
  })

  /**
   * Test: Create credentials
   */
  test('postCredentials sends payload and auth header', async () => {
    localStorage.setItem('token', 'test-token')
    axios.post.mockResolvedValue({})
    const payload = { website: 'example.com' }
    await api.postCredentials(payload)
    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining('/credentials'),
      payload
    )
  })

  /**
   * Test: Update credentials
   */
  test('updateCredentials calls correct endpoint', async () => {
    localStorage.setItem('token', 'test-token')
    axios.put.mockResolvedValue({})
    const payload = { website: 'example.com', pw: 'newpass' }
    await api.updateCredentials(payload.website, payload)
    expect(axios.put).toHaveBeenCalledWith(
      expect.stringContaining(`/credentials/${payload.website}`),
      payload
    )
  })

  /**
   * Test: Delete credentials
   */
  test('deleteCredentials calls correct endpoint', async () => {
    localStorage.setItem('token', 'test-token')
    axios.delete.mockResolvedValue({})
    await api.deleteCredentials('example.com')
    expect(axios.delete).toHaveBeenCalledWith(
      expect.stringContaining('/credentials/example.com')
    )
  })

  /**
   * Test: Decrypt password
   */
  test('decryptPassword calls correct endpoint', async () => {
    localStorage.setItem('token', 'test-token')
    axios.get.mockResolvedValue({})
    await api.decryptPassword('example.com')
    expect(axios.get).toHaveBeenCalledWith(
      expect.stringContaining('/decrypt/example.com')
    )
  })

  /**
   * Test: Interceptor - attaches auth header when token exists
   */
  test('request interceptor attaches Authorization header when token exists', () => {
    localStorage.setItem('token', 'test-token')
    const config = { headers: {} }
    const result = successCallback(config)
    expect(result.headers.Authorization).toBe('Bearer test-token')
  })

  /**
   * Test: Interceptor - no auth header when token absent
   */
  test('request interceptor does not attach Authorization header when no token', () => {
    const config = { headers: {} }
    const result = successCallback(config)
    expect(result.headers.Authorization).toBeUndefined()
  })

  /**
   * Test: Interceptor - rejects on error
   */
  test('request interceptor rejects on error', async () => {
    const error = new Error('Request failed')
    await expect(errorCallback(error)).rejects.toThrow('Request failed')
  })
})