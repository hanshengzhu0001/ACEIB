<script setup>
import { userStore } from '@/stores/onboarding'
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const store = userStore();
const { setUserType, user } = storeToRefs(store)
const router = useRouter();
const selected = ref([]);

const submitForm = () => {

    store.setUserType("student")

    //router.push('/onboardingusertype');

}

</script>

<template>
  <main>
    Student Add Note
    <br/>
    pinia{{ store.user["userType"] }}
    <br/>
    <v-form v-model="valid" @submit.prevent="submitForm">
    <v-container fluid class="py-0 px-0" max-width="1080">
          <br/>
          <v-btn @click="submitForm"  type="submit" block class="mt-2">Submit</v-btn>
          <br/>
        </v-container>
    </v-form>

  </main>
</template>
