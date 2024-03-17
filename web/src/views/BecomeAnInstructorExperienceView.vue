<script setup>
//import TheWelcome from '../components/TheWelcome.vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter();

const submitForm = () => {

    router.push('/becomeaninstructorlanguagesandstartdate');

}

</script>

<template>
  <main>
    Become an Instructor - Experience
    <br/>
    <br/>
    <v-form v-model="valid" @submit.prevent="submitForm">
    <v-container>
      <v-row>
        <v-col
          cols="12"
          md="4"
        >
          <v-textarea
            v-model="firstname"
            :rules="nameRules"
            :counter="10"
            label="Experience"
            required
            hide-details
            no-resize
          ></v-textarea>
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
