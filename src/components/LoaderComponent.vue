<template>
  <div class="dot-loader">
    <div class="dot"></div>
    <div class="dot"></div>
    <div class="dot"></div>
  </div>
</template>

<style scoped>
.dot-loader {
  display: flex;
  justify-content: center;
  gap: 8px;
  padding: 20px;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #42b983;
  animation: bounce 1.4s infinite ease-in-out both;
}

.dot:nth-child(1) {
  animation-delay: -0.32s;
}

.dot:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes bounce {
  0%, 80%, 100% {
    transform: scale(0);
  } 40% {
      transform: scale(1.0);
    }
}
</style>
