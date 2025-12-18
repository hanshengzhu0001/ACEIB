<template>
  <div>
    <!-- Hero Section -->
    <v-parallax
      src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80"
      height="600"
      class="hero-section"
    >
      <v-overlay opacity="0.4">
        <v-container class="fill-height">
          <v-row align="center" justify="center">
            <v-col cols="12" md="8" lg="6" class="text-center">
              <h1 class="display-3 font-weight-bold white--text mb-4">
                Connect. Learn. Grow.
              </h1>
              <p class="headline white--text mb-6">
                Experience personalized education through our intelligent mentor-student matching platform.
                Find your perfect learning partner and achieve your academic goals.
              </p>
              <div class="d-flex flex-column flex-sm-row justify-center gap-4">
                <v-btn
                  v-if="!isAuthenticated"
                  color="primary"
                  size="large"
                  to="/register"
                  class="px-8"
                >
                  <v-icon left>mdi-account-plus</v-icon>
                  Get Started
                </v-btn>
                <v-btn
                  v-else
                  color="secondary"
                  size="large"
                  to="/dashboard"
                  class="px-8"
                >
                  <v-icon left>mdi-view-dashboard</v-icon>
                  Go to Dashboard
                </v-btn>
                <v-btn
                  v-if="!isAuthenticated"
                  outlined
                  color="white"
                  size="large"
                  to="/login"
                  class="px-8"
                >
                  <v-icon left>mdi-login</v-icon>
                  Sign In
                </v-btn>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </v-overlay>
    </v-parallax>

    <!-- Features Section -->
    <v-container class="py-16">
      <v-row justify="center" class="mb-12">
        <v-col cols="12" class="text-center">
          <h2 class="display-1 font-weight-bold mb-4">Why Choose ACEIB?</h2>
          <p class="subtitle-1 text--secondary">
            Our platform combines cutting-edge technology with personalized education
          </p>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" md="4" class="text-center mb-8">
          <v-avatar size="80" color="primary" class="mb-4">
            <v-icon size="40" color="white">mdi-brain</v-icon>
          </v-avatar>
          <h3 class="headline mb-3">Intelligent Matching</h3>
          <p class="text-body-1 text--secondary">
            Our advanced algorithm analyzes learning styles, subjects, and goals
            to connect you with the perfect mentor or student.
          </p>
        </v-col>

        <v-col cols="12" md="4" class="text-center mb-8">
          <v-avatar size="80" color="primary" class="mb-4">
            <v-icon size="40" color="white">mdi-chat</v-icon>
          </v-avatar>
          <h3 class="headline mb-3">Real-Time Communication</h3>
          <p class="text-body-1 text--secondary">
            Stay connected with instant messaging, video calls, and collaborative
            tools to enhance your learning experience.
          </p>
        </v-col>

        <v-col cols="12" md="4" class="text-center mb-8">
          <v-avatar size="80" color="primary" class="mb-4">
            <v-icon size="40" color="white">mdi-trending-up</v-icon>
          </v-avatar>
          <h3 class="headline mb-3">Progress Tracking</h3>
          <p class="text-body-1 text--secondary">
            Monitor your learning journey with detailed analytics, goal tracking,
            and achievement badges to stay motivated.
          </p>
        </v-col>
      </v-row>
    </v-container>

    <!-- Statistics Section -->
    <v-container class="py-16 grey lighten-5">
      <v-row justify="center">
        <v-col cols="12" class="text-center mb-8">
          <h2 class="display-1 font-weight-bold mb-4">Join Our Community</h2>
        </v-col>
      </v-row>

      <v-row justify="center">
        <v-col cols="12" md="3" class="text-center mb-6">
          <div class="display-2 font-weight-bold primary--text mb-2">500+</div>
          <div class="headline">Active Users</div>
        </v-col>
        <v-col cols="12" md="3" class="text-center mb-6">
          <div class="display-2 font-weight-bold primary--text mb-2">1000+</div>
          <div class="headline">Mentorship Hours</div>
        </v-col>
        <v-col cols="12" md="3" class="text-center mb-6">
          <div class="display-2 font-weight-bold primary--text mb-2">95%</div>
          <div class="headline">Satisfaction Rate</div>
        </v-col>
        <v-col cols="12" md="3" class="text-center mb-6">
          <div class="display-2 font-weight-bold primary--text mb-2">50+</div>
          <div class="headline">Subject Areas</div>
        </v-col>
      </v-row>
    </v-container>

    <!-- Testimonials Section -->
    <v-container class="py-16">
      <v-row justify="center" class="mb-12">
        <v-col cols="12" class="text-center">
          <h2 class="display-1 font-weight-bold mb-4">What Our Users Say</h2>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" md="4" class="mb-8">
          <v-card elevation="4" class="pa-6 h-100">
            <v-card-text>
              <v-rating
                :value="5"
                color="amber"
                dense
                half-increments
                readonly
                class="mb-4"
              ></v-rating>
              <p class="text-body-1 mb-4">
                "ACEIB helped me find an amazing math tutor who understood my learning style perfectly.
                My grades improved significantly and I actually enjoy math now!"
              </p>
              <div class="d-flex align-center">
                <v-avatar class="mr-3">
                  <img src="https://randomuser.me/api/portraits/women/1.jpg" alt="User">
                </v-avatar>
                <div>
                  <div class="font-weight-bold">Sarah M.</div>
                  <div class="text-caption text--secondary">High School Student</div>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="4" class="mb-8">
          <v-card elevation="4" class="pa-6 h-100">
            <v-card-text>
              <v-rating
                :value="5"
                color="amber"
                dense
                half-increments
                readonly
                class="mb-4"
              ></v-rating>
              <p class="text-body-1 mb-4">
                "Being a mentor on ACEIB has been incredibly rewarding. The platform makes it easy
                to connect with motivated students and track their progress."
              </p>
              <div class="d-flex align-center">
                <v-avatar class="mr-3">
                  <img src="https://randomuser.me/api/portraits/men/2.jpg" alt="User">
                </v-avatar>
                <div>
                  <div class="font-weight-bold">Dr. Michael C.</div>
                  <div class="text-caption text--secondary">Computer Science Professor</div>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="4" class="mb-8">
          <v-card elevation="4" class="pa-6 h-100">
            <v-card-text>
              <v-rating
                :value="5"
                color="amber"
                dense
                half-increments
                readonly
                class="mb-4"
              ></v-rating>
              <p class="text-body-1 mb-4">
                "The matching algorithm is spot-on! It paired me with a mentor whose teaching style
                perfectly complements my learning preferences."
              </p>
              <div class="d-flex align-center">
                <v-avatar class="mr-3">
                  <img src="https://randomuser.me/api/portraits/women/3.jpg" alt="User">
                </v-avatar>
                <div>
                  <div class="font-weight-bold">Emma L.</div>
                  <div class="text-caption text--secondary">College Student</div>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- CTA Section -->
    <v-parallax
      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
      height="400"
    >
      <v-overlay opacity="0.6">
        <v-container class="fill-height">
          <v-row align="center" justify="center">
            <v-col cols="12" md="8" class="text-center">
              <h2 class="display-1 font-weight-bold white--text mb-4">
                Ready to Start Your Journey?
              </h2>
              <p class="headline white--text mb-6">
                Join thousands of students and mentors who are already transforming education
              </p>
              <v-btn
                v-if="!isAuthenticated"
                color="primary"
                size="x-large"
                to="/register"
                class="px-10"
              >
                <v-icon left>mdi-rocket</v-icon>
                Get Started Today
              </v-btn>
              <v-btn
                v-else
                color="secondary"
                size="x-large"
                to="/matching"
                class="px-10"
              >
                <v-icon left>mdi-account-search</v-icon>
                Find Your Match
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-overlay>
    </v-parallax>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const isAuthenticated = computed(() => authStore.isAuthenticated)
</script>

<style scoped>
.hero-section {
  position: relative;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 100%);
  z-index: 1;
}

.hero-section .v-overlay {
  z-index: 2;
}

.gap-4 {
  gap: 1rem;
}

@media (min-width: 600px) {
  .gap-4 {
    gap: 1rem;
  }
}
</style>
