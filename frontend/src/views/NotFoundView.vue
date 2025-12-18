<template>
  <v-container fluid class="fill-height">
    <v-row align="center" justify="center">
      <v-col cols="12" md="6" lg="4" class="text-center">
        <div class="mb-8">
          <v-icon size="120" color="grey lighten-1">mdi-file-question-outline</v-icon>
        </div>

        <h1 class="display-2 font-weight-bold mb-4">404</h1>
        <h2 class="headline mb-6">Page Not Found</h2>

        <p class="text-body-1 text--secondary mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <v-btn
          color="primary"
          size="large"
          to="/dashboard"
          class="mr-4"
        >
          <v-icon left>mdi-home</v-icon>
          Go to Dashboard
        </v-btn>

        <v-btn
          outlined
          size="large"
          @click="$router.go(-1)"
        >
          <v-icon left>mdi-arrow-left</v-icon>
          Go Back
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
// No script needed for this simple component
</script>
