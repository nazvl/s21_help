const CORS_PROXY = 'https://corsproxy.io/?'

export async function getToken(login: string, password: string) {
  const tokenUrl = `${CORS_PROXY}https://dev21-school.ru.pcbltools.ru/auth/realms/EduPowerKeycloak/protocol/openid-connect/token`

  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: 's21-open-api',
      username: login,
      password: password,
      grant_type: 'password',
    }),
  })

  if (!response.ok) {
    throw new Error(`Ошибка: ${response.status}`)
  }

  return response.json()
}
