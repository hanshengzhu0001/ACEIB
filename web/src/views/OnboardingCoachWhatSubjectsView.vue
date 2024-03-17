<script setup>
  //import TheWelcome from '../components/TheWelcome.vue'
  import { ref, watch } from 'vue'

  const userType = ref("hello");
  const items = [{"title": 'Offering Coaching', "value": "offering_coaching"}, {title: 'Looking for Coaching', value: "looking_for_coaching"}]


  //watch(userType, (newValue) => {
    //console.log('new lang', newValue)
    
    //userType.value = newValue;

    //return { userType };
    
  //});
    

  function onValueChange(v) {
    console.log("Value updated ", v)
    userType.value = v;
  }
  
  
  const submitForm = () => {

    router.push('/onboardingusertype');

  }

</script>

<template>
  <main>
    Onboarding Coach What Subjects
    <br/>
    {{userType}}
    <br/>
    <v-form v-model="valid" @submit.prevent="submitForm">
    <v-container>
      <v-row>
        <v-col
          cols="12"
          md="4"
        >
        <br/>
        <v-select
          label="Select"
          :v-model="userType"
          @update:modelValue="onValueChange"
          :items="items"
          item-title="title"
          item-value="value"
        ></v-select>
          <v-btn on:click="submitForm"  type="submit" block class="mt-2">Submit</v-btn>
        </v-col>
      </v-row>
      <br/>
        </v-container>
    </v-form>

  </main>
</template>
