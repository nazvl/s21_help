export async function sendRequest(request: string, authToken: string) {
  console.log(request, authToken)

  if (!authToken) {
    throw new Error('Токен авторизации отсутствует')
  }

  const proxyUrl = `${request}`

  try {
    const response = await fetch(proxyUrl, {
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

    const text = await response.text()
    return text ? JSON.parse(text) : null
  } catch (error) {
    console.error('API request failed:', error)
    throw error
  }
}

export const apiLink = 'https://platform.21-school.ru'
