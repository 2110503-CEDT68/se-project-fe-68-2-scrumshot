import { fetchWrapper } from "./funcs"
import { APIResponseMessage, APIResponseSingle, APIResponseToken, User } from "./types"

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL;

export async function login(email: string, password: string) {
  const body = { email, password }

  return fetchWrapper<APIResponseToken>(`${backendUrl}/api/v1/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
}

export async function register(name: string, email: string, password: string, tel: string, role?: string) {
  const body = { name, email, password, tel, role: "user" }

  return fetchWrapper<APIResponseToken>(`${backendUrl}/api/v1/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
}

export async function getMe(token: string) {
  return fetchWrapper<APIResponseSingle<User>>(`${backendUrl}/api/v1/auth/me`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  })
}

export async function logout(token: string) {
  return fetchWrapper<APIResponseSingle<{}>>(`${backendUrl}/api/v1/auth/logout`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  })
}