<script setup>
//import TheWelcome from '../components/TheWelcome.vue'
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();

const selected = ref([]);

const submitForm = () => {

    router.push('/studentselectjAreaOfFocus');

}

</script>

<template>
  <main>
    Student Middle Years Program
    <br/>
     <br/>
    <v-container>
      <v-row>
        <v-col>
          <v-btn @click="middleYearsProgram"  block rounded="xs">Year 1</v-btn>
          <br/>
          <v-btn @click="diplomaProgram"  block rounded="xs">Year 2</v-btn>
          <br/>
          <v-btn @click="middleYearsProgram"  block rounded="xs">Year 3</v-btn>
          <br/>
          <v-btn @click="diplomaProgram"  block rounded="xs">Year 4</v-btn>
          <br/>
          <v-btn @click="diplomaProgram"  block rounded="xs">Year 5</v-btn>
        </v-col>
      </v-row>
      <br/>
      </v-container>
  </main>
</template>
