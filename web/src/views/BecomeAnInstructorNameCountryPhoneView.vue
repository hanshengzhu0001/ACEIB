<script setup>
//import TheWelcome from '../components/TheWelcome.vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter();

const submitForm = () => {

    router.push('/becomeaninstructoreducation');

}

</script>

<template>
  <main>
    Become a Counselor - Name, Country, Phone
    <br/>
    <br/>
    <v-form v-model="valid" @submit.prevent="submitForm">
    <v-container>
      <v-row>
        <v-col
          cols="12"
          md="4"
          align="center"
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
            v-model="Country"
            :rules="emailRules"
            label="Country"
            hide-details
            required
          ></v-text-field>
          <br/>
          <v-text-field
            v-model="Phone"
            :rules="emailRules"
            label="Phone"
            hide-details
            required
          ></v-text-field>
          <br/>
          <br/>
          <v-btn @click="submitForm"  center type="submit" size="small" rounded="small">Submit</v-btn>
          </v-col>
        </v-row>
      <br/>
        </v-container>
    </v-form>

  </main>
</template>