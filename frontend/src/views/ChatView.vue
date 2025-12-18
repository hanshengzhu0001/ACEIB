<template>
  <v-container fluid class="pa-0 fill-height">
    <v-row no-gutters class="fill-height">
      <!-- Chat Rooms Sidebar -->
      <v-col cols="12" md="4" lg="3" class="chat-sidebar">
        <v-card elevation="2" class="fill-height d-flex flex-column">
          <v-card-title class="d-flex align-center pa-4 pb-2">
            <v-icon left>mdi-chat</v-icon>
            <span class="headline">Messages</span>
            <v-spacer></v-spacer>
            <v-btn icon small>
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </v-card-title>

          <v-card-text class="pa-0 flex-grow-1">
            <v-list dense class="chat-list">
              <v-list-item
                v-for="chat in chatRooms"
                :key="chat.roomId"
                :class="{ 'active-chat': selectedChat?.roomId === chat.roomId }"
                @click="selectChat(chat)"
                class="chat-item"
              >
                <v-list-item-avatar size="48">
                  <img
                    :src="getOtherParticipant(chat).profile.avatar"
                    :alt="getOtherParticipant(chat).firstName"
                  >
                </v-list-item-avatar>

                <v-list-item-content>
                  <v-list-item-title class="d-flex align-center justify-space-between">
                    <span class="font-weight-medium">
                      {{ getOtherParticipant(chat).firstName }} {{ getOtherParticipant(chat).lastName }}
                    </span>
                    <span class="caption text--secondary" v-if="chat.lastMessage">
                      {{ formatTime(chat.lastMessage.timestamp) }}
                    </span>
                  </v-list-item-title>

                  <v-list-item-subtitle class="d-flex align-center justify-space-between">
                    <span class="text-truncate" style="max-width: 200px;">
                      {{ chat.lastMessage?.content || 'No messages yet' }}
                    </span>
                    <v-chip
                      v-if="chat.unreadCount > 0"
                      color="primary"
                      x-small
                      class="ml-2"
                    >
                      {{ chat.unreadCount }}
                    </v-chip>
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>

            <div v-if="chatRooms.length === 0" class="text-center py-8">
              <v-icon size="48" color="grey lighten-1" class="mb-2">mdi-chat-outline</v-icon>
              <p class="text-body-2 text--secondary">No conversations yet</p>
              <v-btn
                v-if="isStudent"
                text
                color="primary"
                to="/matching"
                small
              >
                Find a Mentor
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Chat Interface -->
      <v-col cols="12" md="8" lg="9" class="chat-main">
        <div v-if="selectedChat" class="fill-height d-flex flex-column">
          <!-- Chat Header -->
          <v-card elevation="1" class="chat-header">
            <v-card-title class="d-flex align-center pa-4">
              <v-avatar size="40" class="mr-3">
                <img
                  :src="getOtherParticipant(selectedChat).profile.avatar"
                  :alt="getOtherParticipant(selectedChat).firstName"
                >
              </v-avatar>
              <div>
                <div class="headline">
                  {{ getOtherParticipant(selectedChat).firstName }} {{ getOtherParticipant(selectedChat).lastName }}
                </div>
                <div class="caption text--secondary">
                  {{ getOtherParticipant(selectedChat).role }} • {{ getOnlineStatus(getOtherParticipant(selectedChat)) }}
                </div>
              </div>
              <v-spacer></v-spacer>
              <v-menu offset-y>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn icon v-bind="attrs" v-on="on">
                    <v-icon>mdi-dots-vertical</v-icon>
                  </v-btn>
                </template>
                <v-list dense>
                  <v-list-item @click="viewProfile(getOtherParticipant(selectedChat))">
                    <v-list-item-icon><v-icon>mdi-account</v-icon></v-list-item-icon>
                    <v-list-item-content><v-list-item-title>View Profile</v-list-item-title></v-list-item-content>
                  </v-list-item>
                  <v-list-item @click="scheduleCall">
                    <v-list-item-icon><v-icon>mdi-phone</v-icon></v-list-item-icon>
                    <v-list-item-content><v-list-item-title>Schedule Call</v-list-item-title></v-list-item-content>
                  </v-list-item>
                  <v-divider></v-divider>
                  <v-list-item @click="reportUser">
                    <v-list-item-icon><v-icon color="warning">mdi-alert</v-icon></v-list-item-icon>
                    <v-list-item-content><v-list-item-title>Report Issue</v-list-item-title></v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-card-title>
          </v-card>

          <!-- Messages Area -->
          <div class="messages-container flex-grow-1" ref="messagesContainer">
            <div class="messages-list pa-4">
              <div
                v-for="message in messages"
                :key="message._id"
                :class="[
                  'message-item',
                  message.sender === currentUserId ? 'message-own' : 'message-other'
                ]"
              >
                <div class="message-content">
                  <div class="message-text">{{ message.content }}</div>
                  <div class="message-time">{{ formatMessageTime(message.timestamp) }}</div>
                </div>
              </div>

              <div v-if="messages.length === 0" class="text-center py-8">
                <v-icon size="48" color="grey lighten-1" class="mb-2">mdi-chat-outline</v-icon>
                <p class="text-body-2 text--secondary">Start a conversation!</p>
              </div>
            </div>
          </div>

          <!-- Message Input -->
          <v-card elevation="1" class="message-input">
            <v-card-text class="pa-4">
              <v-form @submit.prevent="sendMessage">
                <v-row no-gutters>
                  <v-col cols="10" class="pr-2">
                    <v-text-field
                      v-model="newMessage"
                      placeholder="Type your message..."
                      outlined
                      dense
                      hide-details
                      :disabled="sending"
                      @keydown.enter.prevent="sendMessage"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="2">
                    <v-btn
                      color="primary"
                      block
                      type="submit"
                      :loading="sending"
                      :disabled="!newMessage.trim()"
                      height="40"
                    >
                      <v-icon>mdi-send</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-form>
            </v-card-text>
          </v-card>
        </div>

        <!-- No chat selected -->
        <div v-else class="fill-height d-flex align-center justify-center">
          <div class="text-center">
            <v-icon size="80" color="grey lighten-1" class="mb-4">mdi-chat-outline</v-icon>
            <h3 class="headline mb-2">Select a conversation</h3>
            <p class="text-body-1 text--secondary">
              Choose a chat from the sidebar to start messaging
            </p>
          </div>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { io, Socket } from 'socket.io-client'
import axios from 'axios'

const route = useRoute()
const authStore = useAuthStore()

const currentUserId = computed(() => authStore.user?.id)
const isStudent = computed(() => authStore.isStudent)

const chatRooms = ref<any[]>([])
const selectedChat = ref<any>(null)
const messages = ref<any[]>([])
const newMessage = ref('')
const sending = ref(false)
const socket = ref<Socket | null>(null)

// Load chat rooms
const loadChatRooms = async () => {
  try {
    const response = await axios.get('/chat/rooms')
    chatRooms.value = response.data.data.chats

    // Auto-select chat if roomId is in route
    if (route.params.roomId) {
      const chat = chatRooms.value.find(c => c.roomId === route.params.roomId)
      if (chat) {
        selectChat(chat)
      }
    }
  } catch (error) {
    console.error('Failed to load chat rooms:', error)
  }
}

// Select a chat
const selectChat = async (chat: any) => {
  selectedChat.value = chat
  await loadMessages(chat.roomId)

  // Join chat room via socket
  if (socket.value) {
    socket.value.emit('join_chat_room', chat.roomId)
  }

  // Update URL
  if (route.params.roomId !== chat.roomId) {
    window.history.replaceState({}, '', `/chat/${chat.roomId}`)
  }
}

// Load messages for a chat room
const loadMessages = async (roomId: string) => {
  try {
    const response = await axios.get(`/chat/rooms/${roomId}/messages`)
    messages.value = response.data.data.messages
    scrollToBottom()
  } catch (error) {
    console.error('Failed to load messages:', error)
  }
}

// Send message
const sendMessage = async () => {
  if (!newMessage.value.trim() || !selectedChat.value || sending.value) return

  sending.value = true
  try {
    const response = await axios.post(`/chat/rooms/${selectedChat.value.roomId}/messages`, {
      content: newMessage.value.trim(),
      messageType: 'text'
    })

    // Message will be added via socket event
    newMessage.value = ''
  } catch (error) {
    console.error('Failed to send message:', error)
  } finally {
    sending.value = false
  }
}

// Get other participant in chat
const getOtherParticipant = (chat: any) => {
  return chat.participants.find((p: any) => p._id !== currentUserId.value)
}

// Get online status (mock)
const getOnlineStatus = (user: any) => {
  // In a real app, this would come from socket presence
  return Math.random() > 0.5 ? 'Online' : 'Last seen recently'
}

// Format time
const formatTime = (timestamp: string) => {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const hours = Math.floor(diff / (1000 * 60 * 60))

  if (hours < 1) return 'now'
  if (hours < 24) return `${hours}h`
  return date.toLocaleDateString()
}

// Format message time
const formatMessageTime = (timestamp: string) => {
  return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

// Scroll to bottom of messages
const scrollToBottom = () => {
  nextTick(() => {
    const container = document.querySelector('.messages-container')
    if (container) {
      container.scrollTop = container.scrollHeight
    }
  })
}

// Actions
const viewProfile = (user: any) => {
  alert(`Viewing profile for ${user.firstName} ${user.lastName}`)
}

const scheduleCall = () => {
  alert('Call scheduling would open a calendar dialog')
}

const reportUser = () => {
  // Navigate to mediation with pre-filled info
  // router.push('/mediation')
  alert('Report functionality would navigate to mediation page')
}

// Initialize socket connection
const initSocket = () => {
  socket.value = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001')

  socket.value.on('connect', () => {
    console.log('Connected to chat server')
  })

  socket.value.on('chat_message', (message: any) => {
    if (selectedChat.value && message.roomId === selectedChat.value.roomId) {
      messages.value.push(message)
      scrollToBottom()
    }
    // Update chat room last message
    loadChatRooms()
  })

  socket.value.on('disconnect', () => {
    console.log('Disconnected from chat server')
  })
}

// Cleanup
onUnmounted(() => {
  if (socket.value) {
    socket.value.disconnect()
  }
})

onMounted(() => {
  loadChatRooms()
  initSocket()
})
</script>

<style scoped>
.chat-sidebar {
  border-right: 1px solid #e0e0e0;
}

.chat-list {
  height: calc(100vh - 120px);
  overflow-y: auto;
}

.chat-item {
  border-bottom: 1px solid #f5f5f5;
  cursor: pointer;
  transition: background-color 0.2s;
}

.chat-item:hover {
  background-color: #f8f8f8;
}

.active-chat {
  background-color: #e3f2fd;
  border-left: 3px solid #1976d2;
}

.chat-main {
  display: flex;
  flex-direction: column;
}

.chat-header {
  flex-shrink: 0;
}

.messages-container {
  overflow-y: auto;
  background-color: #fafafa;
}

.messages-list {
  min-height: calc(100vh - 200px);
}

.message-item {
  margin-bottom: 12px;
  display: flex;
}

.message-own {
  justify-content: flex-end;
}

.message-other {
  justify-content: flex-start;
}

.message-content {
  max-width: 70%;
  background: white;
  border-radius: 18px;
  padding: 12px 16px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.1);
}

.message-own .message-content {
  background: #1976d2;
  color: white;
}

.message-text {
  word-wrap: break-word;
  margin-bottom: 4px;
}

.message-time {
  font-size: 11px;
  opacity: 0.7;
}

.message-input {
  flex-shrink: 0;
}

/* Mobile responsiveness */
@media (max-width: 959px) {
  .chat-sidebar {
    display: none;
  }

  .chat-main {
    width: 100%;
  }
}
</style>
