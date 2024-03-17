<script setup>
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  <v-container
      fill-height
      fluid
      
        >
  
   <v-app app>
      <v-app-bar app full-height="false" class="app-bar-container" color="blue">
        <template>
          <v-app-bar-nav-icon></v-app-bar-nav-icon>
        </template>
        <v-app-bar-title>AceIB</v-app-bar-title>
        <RouterLink to="/becomeacounselornamecountryphone">Counseling Center</RouterLink>
        <RouterLink to="/becomeaninstructornamecountryphone">Become a Instructor</RouterLink>
        <RouterLink to="/signup">Signup</RouterLink>
      </v-app-bar>
  
  
    <v-row 
      align="start"
     >
      <v-col
        cols="3"
      >
      <br/>
      <br/>
      <br/>

        <nav>
          <RouterLink to="/">Home</RouterLink>
          <br/>
          <RouterLink to="/about">About</RouterLink>
          <br/>
          <RouterLink to="/signup">Signup</RouterLink>
          <br/>
          <RouterLink to="/onboardingusertype">OnboardingUserType</RouterLink>
        </nav>
      </v-col>
      <v-col
        cols="8"
      >
        <br/>
        <br/>
        <br/>
        <br/>
       <RouterView />
      </v-col>
    </v-row>
     </v-app>
  </v-container>

</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
