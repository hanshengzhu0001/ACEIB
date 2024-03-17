<script setup>
//import TheWelcome from '../components/TheWelcome.vue'
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();

const selected = ref([]);

const middleYearsProgram = () => {

    router.push('/studentgradelevelmiddleyears');

}

const diplomaProgram = () => {

    router.push('/studentgradeleveldiplomaprogram');

}

</script>

<template>
  <main>
    Become an Instructor Completed
    <br/>
     <br/>
      <v-container>
      <v-row>
        <v-col>
          <v-btn @click="middleYearsProgram"  block rounded="xs">Middle Years Program</v-btn>
          <br/>
          <v-btn @click="diplomaProgram"  block rounded="xs">Diploma Program</v-btn>
        </v-col>
      </v-row>
      <br/>
      </v-container>
  </main>
</template>
