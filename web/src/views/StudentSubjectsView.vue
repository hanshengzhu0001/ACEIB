<script setup>
//import TheWelcome from '../components/TheWelcome.vue'
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();

const subjects = ref({languages: {english: ""}, englisha: false, englishb: false, english_iwanttogetbetterinthissubjectingeneral: false, english_iwanttopreviewthissubject: false, english_ineedassistanceinmyassignments: false, english_testpreparation: false});

const selected = ref([]);
const englisha = ref(false);
const englishb = ref(false);
const english_iwanttogetbetterinthissubjectingeneral = ref(false);
const english_iwanttopreviewthissubject = ref(false); 
const english_ineedassistanceinmyassignments = ref(false);
const english_testpreparation = ref(false);
const ihaveotherstudypurposes = ref(false);
const spanisha = ref(false);
const spanishb = ref(false);
const spanish_iwanttogetbetterinthissubjectingeneral = ref(false);
const germana = ref(false);
const germanb = ref(false);
const german_iwanttogetbetterinthissubjectingeneral = ref(false);

const individualsandsociety_psychology = ref(false);
const individualsandsociety_economics = ref(false);
const science = ref([]);
const mathematics = ref([]);
const dpcore = ref([]);

const alertTest = () => {

    //alert();

}

const submitForm = () => {

    router.push('/onboardingusertype');

}

</script>

<template>
  <main>
    Become an Instructor Completed
    <br/>
    here{{ subjects["languages"]["english"] }}
    <br/>
    <v-form v-model="valid" @submit.prevent="submitForm">
    <v-container fluid class="py-0 px-0" max-width="1080">
     
          <br/>
          Languages
          <br/>
          <v-radio-group v-model="subjects.languages.english">
            <v-radio class="d-inline-flex"
              value="englisha"
              label="LanguageEnglishA"
              @click="alertTest"
            />
            <br/>
            <v-radio class="d-inline-flex"
              value="englishb"
              label="LanguageEnglishB"/>
          </v-radio-group>
          <br/>
          <div v-if="subjects.languages.english == 'englisha' || subjects.languages.english == 'englishb'">
              <br/>
              I want to get better in this subject in general', 
              <br/>
              I want to preview this subject', 
              <br/>
              I need assistance in my assignments', 
              <br/>
              Test Preparation'
              <br/>
              I have other study purposes
          </div>
          <br/>
          <br/>
          <v-checkbox class="d-inline-flex"
            v-model="spanish_a"
            :value="spanish_a"
            :label="`Language Spanish A`"
          >
          </v-checkbox>
          <br/>
          <v-checkbox class="d-inline-flex"
            v-model="languages"
            :value="spanish_b"
            :label="`Language Spanish B`"
          >
          </v-checkbox>
          <br/>
           I want to get better in this subject in general'
           <br/>
           <v-checkbox class="d-inline-flex"
            v-model="languages"
            :value="spanish_b"
            :label="`I want to get better in this subject in general`"
            />
          <br/>
          'I want to preview this subject', 
          <br/>
          'I need assistance in my assignments', 
          <br/>
          'Test Preparation'
          <br/>
          I have other study purposes
          <br/>
          <v-checkbox class="d-inline-flex"
            v-model="languages"
            :value="german_a"
            :label="LanguageGermanA"
          >
          </v-checkbox>
          <br/>
          <v-checkbox class="d-inline-flex"
            v-model="languages"
            :value="german_b"
            :label="LanguageGermanB"
          >
          </v-checkbox>
          <br/>
           I want to get better in this subject in general', 
          <br/>
          'I want to preview this subject', 
          <br/>
          'I need assistance in my assignments', 
          <br/>
          'Test Preparation'
          <br/>
          I have other study purposes
          <br/>
          <br/>
          Indivuals and Society
          <br/>
          <v-checkbox
            v-model="individualsandsociety_psychology"
            :label="Psychology"
          ></v-checkbox>
          <br/>
          <div v-if="individualsandsociety_psychology == true">
            I want to get better in this subject in general', 
            <br/>
            I want to preview this subject', 
            <br/>
            I need assistance in my assignments', 
            <br/>
            Test Preparation'
            <br/>
            I have other study purposes
          </div>
          <br/>
          <br/>
          <v-checkbox
            v-model="individualsandsociety_economics"
            :label="Economics"
          ></v-checkbox>
          <div v-if="individualsandsociety_economics == true">
              I want to get better in this subject in general', 
              <br/>
              I want to preview this subject', 
              <br/>
              I need assistance in my assignments', 
              <br/>
              Test Preparation'
              <br/>
              I have other study purposes
              <br/>
              <br/>
              Science
              <br/>
          </div>
          <v-checkbox
            v-model="selected"
            :label="Chemistry"
          ></v-checkbox>
          <br/>
          <v-checkbox
            v-model="selected"
            :label="Biology"
          ></v-checkbox>
          <br/>
          <v-checkbox
            v-model="selected"
            :label="Physics"
          ></v-checkbox>
          <br/>
          <v-checkbox
            v-model="selected"
            :label="ComputerScience"
          ></v-checkbox>
          <br/>
          <v-checkbox
            v-model="selected"
            :label="Sportsexerciseandhealthscience"
          ></v-checkbox>
          <br/>
          <v-checkbox
            v-model="selected"
            :label="EnvironmentalSystemsandSociety"
          ></v-checkbox>
          <br/>
          Mathermatics
          <br/>
          <v-checkbox
            v-model="selected"
            :label="Mathematics"
          ></v-checkbox>
          <br/>
          DP Core
          <br/>
          <v-checkbox
            v-model="selected"
            :label="TheoryofKnowledge"
          ></v-checkbox>
          <br/>
          <v-checkbox
            v-model="selected"
            :label="ExtendedEssay"
          ></v-checkbox>
          <br/>
          <v-checkbox
            v-model="selected"
            :label="CreativityActivityServices"
          ></v-checkbox>
          <br/>
          <v-btn @click="submitForm"  type="submit" block class="mt-2">Submit</v-btn>
          <br/>
        </v-container>
    </v-form>

  </main>
</template>
