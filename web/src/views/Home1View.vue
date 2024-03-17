<script setup>
//import TheWelcome from '../components/TheWelcome.vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter();

const submitForm = () => {

    router.push('/onboardingusertype');

}

</script>

<template>
  <main>
    Home Screen.
    <br/>
    Calendar
    <br/>
    Edit profile
    <br/>
    <v-form v-model="valid" @submit.prevent="submitForm">
    <v-container>
      <v-row>
        <v-col
          cols="12"
          md="4"
        >
          <v-text-field
            v-model="firstname"
            :rules="nameRules"
            :counter="10"
            label="First name"
            required
            hide-details
          ></v-text-field>
          <br/>
          <v-text-field
            v-model="lastname"
            :rules="nameRules"
            :counter="10"
            label="Last name"
            hide-details
            required
          ></v-text-field>
          <br/>
          <v-text-field
            v-model="email"
            :rules="emailRules"
            label="E-mail"
            hide-details
            required
          ></v-text-field>
          <br/>
          <v-btn on:click="submitForm"  type="submit" block class="mt-2">Submit</v-btn>
        </v-col>
      </v-row>
      <br/>
        </v-container>
    </v-form>

  </main>
</template>
