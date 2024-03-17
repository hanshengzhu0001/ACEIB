<script setup>
//import TheWelcome from '../components/TheWelcome.vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter();

const submitForm = () => {

    router.push('/onboardingusertype');

}

const imAStudent = () => {

    router.push('/imastudent');

}

const imAParent = () => {

    router.push('/imaparent');

}


</script>

<template>
  <main>
    Signup
    <br/>
    <br/>
    <v-container>
      <v-row>
        <v-col>
          <v-btn @click="imAStudent"  block rounded="xs">Im a Student</v-btn>
          <br/>
          <v-btn @click="imAParent"  block rounded="xs">Im a Parent</v-btn>
        </v-col>
      </v-row>
      <br/>
        </v-container>
    </main>
</template>
