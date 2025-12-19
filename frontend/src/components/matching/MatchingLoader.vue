<template>
  <v-overlay
    :value="visible"
    :opacity="0.9"
    z-index="9999"
    class="matching-overlay"
  >
    <v-card
      class="matching-loader-card"
      elevation="24"
      dark
    >
      <!-- Header -->
      <v-card-title class="text-center pb-2">
        <div class="d-flex align-center justify-center">
          <v-icon size="32" class="mr-3 primary--text spinning-icon">mdi-brain</v-icon>
          <span class="text-h5 font-weight-bold">Finding Your Perfect Match</span>
        </div>
      </v-card-title>

      <!-- Main Animation Area -->
      <v-card-text class="text-center pb-4">
        <!-- Algorithmic Network Animation -->
        <div class="network-container">
          <div class="central-node">
            <v-icon size="48" class="central-icon pulse">mdi-account-search</v-icon>
          </div>

          <!-- Connecting nodes -->
          <div
            v-for="node in nodes"
            :key="node.id"
            class="connecting-node"
            :style="getNodeStyle(node)"
          >
            <v-icon :size="node.size" :color="node.color" class="node-icon">
              {{ node.icon }}
            </v-icon>
          </div>

          <!-- Animated connections -->
          <svg class="connections-svg" viewBox="0 0 400 300">
            <defs>
              <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="var(--v-primary-base)" stop-opacity="0.3"/>
                <stop offset="50%" stop-color="var(--v-accent-base)" stop-opacity="0.8"/>
                <stop offset="100%" stop-color="var(--v-secondary-base)" stop-opacity="0.3"/>
              </linearGradient>
            </defs>
            <path
              v-for="connection in connections"
              :key="connection.id"
              :d="connection.path"
              stroke="url(#connectionGradient)"
              stroke-width="2"
              fill="none"
              class="connection-line"
            />
          </svg>
        </div>

        <!-- Progress Section -->
        <div class="progress-section mt-6">
          <v-progress-linear
            :value="progress"
            height="8"
            rounded
            class="mb-3"
            color="primary"
            background-color="grey darken-3"
          >
            <template v-slot:default="{ value }">
              <span class="progress-text">{{ Math.ceil(value) }}%</span>
            </template>
          </v-progress-linear>

          <div class="step-indicator">
            <v-chip
              v-for="(step, index) in matchingSteps"
              :key="index"
              :color="getStepColor(step, index)"
              :outlined="!step.active"
              small
              class="mr-2 mb-2 step-chip"
            >
              <v-icon left size="16" v-if="step.completed">mdi-check</v-icon>
              <v-icon left size="16" v-else-if="step.active">mdi-loading mdi-spin</v-icon>
              {{ step.text }}
            </v-chip>
          </div>
        </div>

        <!-- Dynamic Messages -->
        <div class="message-section mt-4">
          <v-fade-transition mode="out-in">
            <div :key="currentMessageIndex" class="message-text">
              <v-icon left size="20" class="message-icon">{{ currentMessage.icon }}</v-icon>
              <span class="text-body-1">{{ currentMessage.text }}</span>
            </div>
          </v-fade-transition>
        </div>

        <!-- Stats Display -->
        <div class="stats-section mt-4">
          <v-row dense class="text-center">
            <v-col cols="4">
              <div class="stat-number">{{ mentorCount }}</div>
              <div class="stat-label">Mentors Analyzed</div>
            </v-col>
            <v-col cols="4">
              <div class="stat-number">{{ compatibilityScore }}%</div>
              <div class="stat-label">Best Match Score</div>
            </v-col>
            <v-col cols="4">
              <div class="stat-number">{{ processingTime }}s</div>
              <div class="stat-label">Processing Time</div>
            </v-col>
          </v-row>
        </div>
      </v-card-text>

      <!-- Footer -->
      <v-card-actions class="justify-center pt-0">
        <v-btn
          v-if="showCancelButton"
          outlined
          @click="$emit('cancel')"
          class="cancel-btn"
        >
          <v-icon left>mdi-close</v-icon>
          Cancel Matching
        </v-btn>
      </v-card-actions>

      <!-- Floating Particles -->
      <div class="particles-container">
        <div
          v-for="particle in particles"
          :key="particle.id"
          class="particle"
          :style="getParticleStyle(particle)"
        ></div>
      </div>
    </v-card>
  </v-overlay>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

interface Props {
  visible: boolean
  showCancelButton?: boolean
  duration?: number // in milliseconds
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  showCancelButton: true,
  duration: 5000
})

const emit = defineEmits<{
  cancel: []
  complete: []
}>()

// Reactive data
const progress = ref(0)
const currentStepIndex = ref(0)
const currentMessageIndex = ref(0)
const mentorCount = ref(0)
const compatibilityScore = ref(0)
const processingTime = ref(0)

const nodes = ref([
  { id: 1, x: 100, y: 80, size: 24, color: 'primary', icon: 'mdi-school', delay: 0 },
  { id: 2, x: 300, y: 80, size: 24, color: 'secondary', icon: 'mdi-brain', delay: 200 },
  { id: 3, x: 80, y: 220, size: 20, color: 'accent', icon: 'mdi-calculator', delay: 400 },
  { id: 4, x: 320, y: 220, size: 20, color: 'success', icon: 'mdi-flask', delay: 600 },
  { id: 5, x: 200, y: 150, size: 22, color: 'warning', icon: 'mdi-palette', delay: 800 }
])

const particles = ref(Array.from({ length: 20 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 4 + 2,
  speed: Math.random() * 2 + 1,
  opacity: Math.random() * 0.5 + 0.2
})))

const matchingSteps = [
  { text: 'Analyzing Profile', active: false, completed: false },
  { text: 'Matching Subjects', active: false, completed: false },
  { text: 'Checking Availability', active: false, completed: false },
  { text: 'Calculating Compatibility', active: false, completed: false },
  { text: 'Finding Best Matches', active: false, completed: false }
]

const messages = [
  { text: 'Scanning through mentor database...', icon: 'mdi-database-search' },
  { text: 'Analyzing subject expertise and teaching styles...', icon: 'mdi-brain' },
  { text: 'Cross-referencing availability schedules...', icon: 'mdi-calendar-check' },
  { text: 'Calculating weighted compatibility scores...', icon: 'mdi-calculator-variant' },
  { text: 'Optimizing mentor-student pairings...', icon: 'mdi-account-network' },
  { text: 'Finalizing recommendations...', icon: 'mdi-check-circle-outline' }
]

// Computed properties
const connections = computed(() => {
  const centerX = 200
  const centerY = 150
  return nodes.value.map(node => ({
    id: node.id,
    path: `M ${centerX} ${centerY} Q ${(centerX + node.x) / 2} ${(centerY + node.y) / 2} ${node.x} ${node.y}`
  }))
})

const currentMessage = computed(() => messages[currentMessageIndex.value])

// Methods
const getNodeStyle = (node: any) => ({
  left: `${node.x - node.size/2}px`,
  top: `${node.y - node.size/2}px`,
  animationDelay: `${node.delay}ms`
})

const getParticleStyle = (particle: any) => ({
  left: `${particle.x}%`,
  top: `${particle.y}%`,
  width: `${particle.size}px`,
  height: `${particle.size}px`,
  opacity: particle.opacity,
  animationDuration: `${particle.speed * 10}s`
})

const getStepColor = (step: any, index: number) => {
  if (step.completed) return 'success'
  if (step.active) return 'primary'
  return 'grey'
}

const startAnimation = () => {
  let interval: NodeJS.Timeout
  let messageInterval: NodeJS.Timeout
  let particleInterval: NodeJS.Timeout

  // Progress animation
  let progressValue = 0
  interval = setInterval(() => {
    progressValue += Math.random() * 3 + 1
    if (progressValue >= 100) {
      progressValue = 100
      clearInterval(interval)
      setTimeout(() => emit('complete'), 500)
    }
    progress.value = progressValue
  }, 100)

  // Step progression
  let stepIndex = 0
  const stepInterval = setInterval(() => {
    if (stepIndex < matchingSteps.length) {
      matchingSteps[stepIndex].active = false
      matchingSteps[stepIndex].completed = true

      stepIndex++
      if (stepIndex < matchingSteps.length) {
        matchingSteps[stepIndex].active = true
      }
    } else {
      clearInterval(stepInterval)
    }
  }, props.duration / matchingSteps.length)

  // Message cycling
  let messageIndex = 0
  messageInterval = setInterval(() => {
    messageIndex = (messageIndex + 1) % messages.length
    currentMessageIndex.value = messageIndex
  }, 1500)

  // Dynamic stats
  const statsInterval = setInterval(() => {
    mentorCount.value = Math.floor(progress.value * 18 / 100)
    compatibilityScore.value = Math.min(95, Math.floor(progress.value * 0.95))
    processingTime.value = (progress.value / 100 * props.duration / 1000).toFixed(1)
  }, 200)

  // Particle animation
  particleInterval = setInterval(() => {
    particles.value.forEach(particle => {
      particle.x += Math.random() * 2 - 1
      particle.y += Math.random() * 2 - 1

      // Wrap around screen
      if (particle.x < 0) particle.x = 100
      if (particle.x > 100) particle.x = 0
      if (particle.y < 0) particle.y = 100
      if (particle.y > 100) particle.y = 0
    })
  }, 100)

  // Initialize first step
  matchingSteps[0].active = true

  // Cleanup function
  const cleanup = () => {
    clearInterval(interval)
    clearInterval(stepInterval)
    clearInterval(messageInterval)
    clearInterval(statsInterval)
    clearInterval(particleInterval)
  }

  return cleanup
}

// Lifecycle
let cleanup: (() => void) | null = null

onMounted(() => {
  if (props.visible) {
    cleanup = startAnimation()
  }
})

onUnmounted(() => {
  if (cleanup) cleanup()
})

// Watch for visibility changes
import { watch } from 'vue'
watch(() => props.visible, (newVisible) => {
  if (newVisible && !cleanup) {
    cleanup = startAnimation()
  } else if (!newVisible && cleanup) {
    cleanup()
    cleanup = null
    // Reset state
    progress.value = 0
    currentStepIndex.value = 0
    currentMessageIndex.value = 0
    mentorCount.value = 0
    compatibilityScore.value = 0
    processingTime.value = 0
    matchingSteps.forEach(step => {
      step.active = false
      step.completed = false
    })
  }
})
</script>

<style scoped>
.matching-overlay {
  backdrop-filter: blur(8px);
  background: linear-gradient(135deg,
    rgba(33, 150, 243, 0.1) 0%,
    rgba(156, 39, 176, 0.1) 50%,
    rgba(76, 175, 80, 0.1) 100%
  );
}

.matching-loader-card {
  max-width: 600px;
  background: linear-gradient(135deg,
    rgba(33, 33, 33, 0.95) 0%,
    rgba(55, 55, 55, 0.95) 100%
  );
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  position: relative;
  overflow: hidden;
}

.network-container {
  position: relative;
  height: 300px;
  margin: 20px 0;
}

.central-node {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
}

.connecting-node {
  position: absolute;
  animation: nodePulse 2s ease-in-out infinite;
  z-index: 5;
}

.connections-svg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.connection-line {
  animation: connectionFlow 3s ease-in-out infinite;
}

.progress-section {
  max-width: 400px;
  margin: 0 auto;
}

.progress-text {
  font-weight: bold;
  font-size: 12px;
}

.step-indicator {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.step-chip {
  animation: chipFadeIn 0.5s ease-out;
}

.message-section {
  min-height: 40px;
}

.message-text {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--v-primary-base);
}

.message-icon {
  animation: iconBounce 1s ease-in-out infinite;
}

.stats-section .stat-number {
  font-size: 24px;
  font-weight: bold;
  color: var(--v-accent-base);
}

.stats-section .stat-label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  margin-top: 4px;
}

.cancel-btn {
  border-color: rgba(255, 255, 255, 0.3);
}

.particles-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.particle {
  position: absolute;
  background: radial-gradient(circle, var(--v-primary-base) 0%, transparent 70%);
  border-radius: 50%;
  animation: particleFloat 10s linear infinite;
}

/* Animations */
@keyframes nodePulse {
  0%, 100% {
    transform: scale(1);
    opacity: 0.7;
  }
  50% {
    transform: scale(1.2);
    opacity: 1;
  }
}

@keyframes connectionFlow {
  0% {
    stroke-dasharray: 0, 100;
    opacity: 0;
  }
  50% {
    stroke-dasharray: 50, 50;
    opacity: 1;
  }
  100% {
    stroke-dasharray: 100, 0;
    opacity: 0;
  }
}

@keyframes chipFadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes iconBounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-5px);
  }
  60% {
    transform: translateY(-3px);
  }
}

@keyframes particleFloat {
  from {
    transform: translateY(100vh) rotate(0deg);
  }
  to {
    transform: translateY(-100px) rotate(360deg);
  }
}

.spinning-icon {
  animation: spin 2s linear infinite;
}

.pulse {
  animation: pulse 2s ease-in-out infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.1);
    opacity: 1;
  }
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .matching-loader-card {
    max-width: 95vw;
    margin: 16px;
  }

  .network-container {
    height: 250px;
  }

  .step-indicator {
    justify-content: center;
  }

  .step-chip {
    margin: 2px;
  }
}
</style>
