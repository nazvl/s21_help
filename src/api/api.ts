
export async function sendRequest(request: string, authToken: string) {
  console.log(request, authToken)
  const response = await fetch(request, {
    method: 'GET',
    headers: {
      'Accept': '*/*',
      'Authorization': `Bearer ${authToken}`, // правильный синтаксис
    },
  })
  if (!response.ok) {
    throw new Error(`Ошибка: ${response.status}`)
  }

  return response.json()
}
