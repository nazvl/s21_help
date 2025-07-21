export function requestNotificationPermission(): Promise<boolean> { // функция запроса разрешения на показ увед
  if (!('Notification' in window)) {
    return Promise.resolve(false)
  }

  return Notification.requestPermission().then(permission => permission === 'granted')
}

export function showNotification(title: string, message: string) { // показать увед
  if (Notification.permission === 'granted') {
    new Notification(title, {
      body: message,
      icon: '/logo.png'
    })
  }
}
