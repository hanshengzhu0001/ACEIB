<script setup>
//import TheWelcome from '../components/TheWelcome.vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter();

const schools = [{"title": 'American Englsh', "value": "american_english"}, {title: 'Counselor', value: "counselor"}]
const selectedSchool = ref("");


const submitForm = () => {

    router.push('/onboardingusertype');

}

</script>

<template>
  <main>
    Become an Instrcutor Language and Start Date
    <br/>
    <br/>
    <v-form v-model="valid" @submit.prevent="submitForm">
    <v-container>
      <v-row>
        <v-col
          cols="12"
          md="4"
        >
        <v-select
          v-model="select"
          :items="items"
          item-title="title"
          item-value="value"
          label="Select"
          persistent-hint
          return-object
          single-line
        ></v-select>
        <br/>
        <v-date-picker></v-date-picker>
        <br/>
        <v-text-field
          v-model="Country"
          :rules="emailRules"
          label="College"
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
          <v-text-field
            v-model="Country"
            :rules="emailRules"
            label="University/College"
            hide-details
            required
          ></v-text-field>
          <br/>
          <v-text-field
            v-model="Country"
            :rules="emailRules"
            label="Degree"
            hide-details
            required
          ></v-text-field>
          <br/>
          <v-text-field
            v-model="Country"
            :rules="emailRules"
            label="Linkedin"
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
