export async function getToken(login: string, password: string) {
  const response = await fetch('https://auth.sberclass.ru/auth/realms/EduPowerKeycloak/protocol/openid-connect/token', {
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
