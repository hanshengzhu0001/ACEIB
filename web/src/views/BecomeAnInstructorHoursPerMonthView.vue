<script setup>
//import TheWelcome from '../components/TheWelcome.vue'
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();

const selected = ref([]);

const submitForm = () => {

    router.push('/onboardingusertype');

}

</script>

<template>
  <main>
    Become an Instrcutor Hours Per Month
    <br/>
    Students may choose to book a single session or up to four sessions per month. Each
    session lasts for 30 minutes. The sessions are free for the students, and you will receive a
    compensation of $30 per session.
    <br/>
    <v-form v-model="valid" @submit.prevent="submitForm">
    <v-container>
      <v-row>
        <v-col
          cols="12"
          md="4"
        >
          <v-checkbox
            v-for="item in 12"
            v-model="selected"
            :label="`${item == 1 ? item + ' Hour' : item + ' Hours'}`"
            :value="item"
          ></v-checkbox>
          <v-checkbox
            v-model="selected"
            label="1 Hour"
            value="John"
          ></v-checkbox>
          <br/>
          <v-checkbox
            v-model="selected"
            label="2 Hour"
            value="John"
          ></v-checkbox>
          <br/>
          <v-checkbox
            v-model="selected"
            label="3 Hour"
            value="John"
          ></v-checkbox>
          <v-checkbox
            v-model="selected"
            label="4 Hour"
            value="John"
          ></v-checkbox>
          <v-checkbox
            v-model="selected"
            label="5 Hour"
            value="John"
          ></v-checkbox>
          <v-checkbox
            v-model="selected"
            label="6 Hour"
            value="John"
          ></v-checkbox>
          <v-btn @click="submitForm"  type="submit" block class="mt-2">Submit</v-btn>
        </v-col>
      </v-row>
      <br/>
        </v-container>
    </v-form>

  </main>
</template>
