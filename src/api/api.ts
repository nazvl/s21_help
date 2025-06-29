export async function sendRequest(request: string, authToken: string) {
  console.log(request, authToken)

  if (!authToken) {
    throw new Error('Токен авторизации отсутствует')
  }

  try {
    const response = await fetch(request, {
      method: 'GET',
      headers: {
        Accept: '*/*',
        Authorization: `Bearer ${authToken}`,
      },
    })

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Токен авторизации недействителен')
      }
      throw new Error(`Ошибка: ${response.status} - ${response.statusText}`)
    }

    return response.json()
  } catch (error) {
    console.error('API request failed:', error)
    throw error
  }
}
