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
    Become an Instructor Hours Per Day
    <br/>
    {{selected}}
     <br/>
    <v-form v-model="valid" @submit.prevent="submitForm">
    <v-container fluid class="py-0 px-0" max-width="1080">
     
          <br/>
          <br/>
          <v-row>
            <v-col
              cols="1"
              md="1"
              lg="1"
            >
            </v-col>
            <v-col align="center" justify="center">
              6am-8am
            </v-col>
            <v-col>
              8am-10am
            </v-col>
            <v-col>
              10am-12pm
            </v-col>
            <v-col>
              12pm-2pm
            </v-col>
            <v-col>
              2pm-4pm
            </v-col>
            <v-col>
              4pm-6pm
            </v-col>
            <v-col>
              8pm-10pm
            </v-col>
            <v-col>
              12am-2am
            </v-col>
          </v-row>
          <v-row align="center" justify="center">
            <v-col
              cols="1"
              md="1"
              lg="1"
            >
              monday
            </v-col>
            <v-col align="center" justify="center">
              <v-checkbox class="d-inline-flex" v-model="selected" value="monday-6am-8am">
              </v-checkbox>
            </v-col>
            <v-col>
              <v-checkbox class="d-inline-flex" v-model="selected" value="monday-8am-10am">
              </v-checkbox>
            </v-col>
            <v-col>
              <v-checkbox class="d-inline-flex" v-model="selected" value="monday-10am-12pm">
              </v-checkbox>
            </v-col>
            <v-col>
              <v-checkbox class="d-inline-flex" v-model="selected" value="monday-12am-2pm">
              </v-checkbox>
            </v-col>
             <v-col>
              <v-checkbox class="d-inline-flex" v-model="selected" value="monday-2pm-4m">
              </v-checkbox>
            </v-col>
             <v-col>
              <v-checkbox class="d-inline-flex" v-model="selected" value="monday-4am-6pm">
              </v-checkbox>
            </v-col>
             <v-col>
              <v-checkbox class="d-inline-flex" v-model="selected" value="monday-6am-8pm">
              </v-checkbox>
            </v-col>
             <v-col>
              <v-checkbox class="d-inline-flex" v-model="selected" value="monday-8pm-10pm">
              </v-checkbox>
            </v-col>
             <v-col>
              <v-checkbox class="d-inline-flex" v-model="selected" value="monday-10pm-12pm">
              </v-checkbox>
            </v-col>
             <v-col>
              <v-checkbox class="d-inline-flex" v-model="selected" value="monday-12pm-2am">
              </v-checkbox>
            </v-col>
          </v-row>
          <v-row align="center" justify="center">
            <v-col
              cols="1"
              md="1"
              lg="1"
            >
              tuesday
            </v-col>
            <v-col align="center" justify="center">
              <v-checkbox class="d-inline-flex" v-model="selected" value="tuesday-6am-8am">
              </v-checkbox>
            </v-col>
            <v-col>
              <v-checkbox class="d-inline-flex" v-model="selected" value="tuesday-8am-10am">
              </v-checkbox>
            </v-col>
            <v-col>
              <v-checkbox class="d-inline-flex" v-model="selected" value="tuesday-10am-12pm">
              </v-checkbox>
            </v-col>
            <v-col>
              <v-checkbox class="d-inline-flex" v-model="selected" value="tuesday-12am-2pm">
              </v-checkbox>
            </v-col>
             <v-col>
              <v-checkbox class="d-inline-flex" v-model="selected" value="tuesday-2pm-4m">
              </v-checkbox>
            </v-col>
             <v-col>
              <v-checkbox class="d-inline-flex" v-model="selected" value="tuesday-4am-6pm">
              </v-checkbox>
            </v-col>
             <v-col>
              <v-checkbox class="d-inline-flex" v-model="selected" value="tuesday-6am-8pm">
              </v-checkbox>
            </v-col>
             <v-col>
              <v-checkbox class="d-inline-flex" v-model="selected" value="tuesday-8pm-10pm">
              </v-checkbox>
            </v-col>
             <v-col>
              <v-checkbox class="d-inline-flex" v-model="selected" value="tuesday-10pm-12pm">
              </v-checkbox>
            </v-col>
             <v-col>
              <v-checkbox class="d-inline-flex" v-model="selected" value="tuesday-12pm-2am">
              </v-checkbox>
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
