<script setup>
//import TheWelcome from '../components/TheWelcome.vue'
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const select = ['Vuetify', 'Programming'];
const items = ref(['English', 'Spanish', 'german', 'Dutch', 'Psychology', 'Mathematics', 'Chemistry', 'Biology', 'Physics', 'Mathematics', 'Theory of Knowledge']);

const router = useRouter();

const selected = ref([]);

const submitForm = () => {

    router.push('/onboardingusertype');

}

</script>

<template>
  <main>
    Subjects Instruction
    <br/>
     <br/>
    <v-form v-model="valid" @submit.prevent="submitForm">
    <v-container fluid class="py-0 px-0" max-width="1080">
     
          <br/>
          <br/>
          <v-row>
            <v-combobox
              v-model="select"
              :items="items"
              label="Select a favorite activity or create a new one"
              multiple
            ></v-combobox>
            <v-col
              cols="1"
              md="1"
              lg="1"
            >
            </v-col>
            <v-col align="center" justify="center">
              Language
            </v-col>
            <v-col>
              Individuals and Society
            </v-col>
            <v-col>
              Science
            </v-col>
            <v-col>
              Mathematics
            </v-col>
            <v-col>
              DP Core
            </v-col>
          </v-row>
          <v-row align="center" justify="center">
            <v-col align="center" justify="center">
              <v-checkbox class="d-inline-flex">
              </v-checkbox>
            </v-col>
            <v-col>
              <v-checkbox class="d-inline-flex">
              </v-checkbox>
            </v-col>
            <v-col>
              <v-checkbox class="d-inline-flex">
              </v-checkbox>
            </v-col>
            <v-col>
              here
            </v-col>
          </v-row>
          <v-row>
            <v-col
              cols="1"
              md="1"
              lg="1"
            >
              tuesday
            </v-col>
            <v-col>
              here
            </v-col>
            <v-col>
              here
            </v-col>
          </v-row>
          <v-row>
            <v-col
              cols="1"
              md="1"
              lg="1"
            >
            </v-col>
            <v-col>
              6am-8am
            </v-col>
            <v-col>
              8am-10am
            </v-col>  
          </v-row>
          
          
          
          <br/>
          <v-checkbox
            v-for="item in 12"
            v-model="selected"
            :label="`${item == 1 ? item + ' Hour' : item + ' Hours'}`"
            :value="item"
          ></v-checkbox>
          <br/>
          <v-btn @click="submitForm"  type="submit" block class="mt-2">Submit</v-btn>
      
      <br/>
        </v-container>
    </v-form>

  </main>
</template>
