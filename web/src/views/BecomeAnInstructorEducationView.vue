<script setup>
//import TheWelcome from '../components/TheWelcome.vue'
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router'

const router = useRouter();

const schools = [{"title": 'Instructor', "value": "instructor"}, {title: 'Counselor', value: "counselor"}]
const selectedSchool = ref("");

function onValueChange(v) {
    console.log("Value updated ", v)
    selectedSchool.value = v;
}
  

const submitForm = () => {

    router.push('/becomeaninstructorlinkedinlicenseresume');

}

</script>

<template>
  <main>
    <br/>
    Become a Instructor - Education
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
            label="College/University"
            required
            hide-details
          ></v-text-field>
          
        <br/>
        <v-text-field
            v-model="firstname"
            :rules="nameRules"
            :counter="10"
            label="Degree"
            required
            hide-details
          ></v-text-field>
        <br/>
        <v-text-field
            v-model="firstname"
            :rules="nameRules"
            :counter="10"
            label="Major"
            required
            hide-details
          ></v-text-field>
        <br/>
        <v-text-field
            v-model="Country"
            :rules="emailRules"
            label="Graduation Year"
            hide-details
            required
          ></v-text-field>
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
