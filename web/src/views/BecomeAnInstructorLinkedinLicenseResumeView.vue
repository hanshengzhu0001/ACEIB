<script setup>
//import TheWelcome from '../components/TheWelcome.vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter();

const submitForm = () => {

    router.push('/becomeaninstructorexperience');

}

</script>

<template>
  <main>
    Become an Instructor - Linkedin - License - Resume
    <br/>
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
            label="Linkedin"
            required
            hide-details
          ></v-text-field>
          <br/>
          <v-file-input
            v-model="file"
            :rules="nameRules"
            :counter="10"
            label="License"
            hide-details
            required
          ></v-file-input>
          <br/>
          <br/>
          <v-btn @click="submitForm"  type="submit" block class="mt-2">Submit</v-btn>
        </v-col>
      </v-row>
      <br/>
        </v-container>
    </v-form>

  </main>
</template>
