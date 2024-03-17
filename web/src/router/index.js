import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/signup',
      name: 'signup',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/SignupView.vue')
    },
    {
      path: '/onboardingusertype',
      name: 'onboardingusertype',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/OnboardingUserTypeView.vue')
    },
    {
      path: '/onboardingcoachwhatsubjects',
      name: 'onboardingcoachwhatsubjects',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/OnboardingCoachWhatSubjectsView.vue')
    },
    {
      path: '/becomeaninstructornamecountryphone',
      name: 'becomeaninstructornamecountryphone',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/BecomeAnInstructorNameCountryPhoneView.vue')
    },
    {
      path: '/becomeaninstructoreducation',
      name: 'becomeaninstructoreducation',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/BecomeAnInstructorEducationView.vue')
    },
    {
      path: '/becomeaninstructorlinkedinlicenseresume',
      name: 'becomeaninstructorlinkedinlicenseresume',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/BecomeAnInstructorLinkedinLicenseResumeView.vue')
    },
    {
      path: '/becomeaninstructorexperience',
      name: 'becomeaninstructorexperience',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/BecomeAnInstructorExperienceView.vue')
    },
    {
      path: '/becomeaninstructorlanguagesandstartdate',
      name: 'becomeaninstructorlanguagesandstartdate',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/BecomeAnInstructorLanguagesAndStartDateView.vue')
    },
    {
      path: '/becomeaninstructorhourspermonth',
      name: 'becomeaninstructorhourspermonth',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/BecomeAnInstructorHoursPerMonthView.vue')
    },
    {
      path: '/becomeaninstructordailytimeframe',
      name: 'becomeaninstructordailytimeframe',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/BecomeAnInstructorDailyTimeFrameView.vue')
    },
    {
      path: '/studentwhichprogramareyouin',
      name: 'studentwhichprogramareyouin',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/StudentWhichProgramAreYouInView.vue')
    },
    /*{
      path: '/studentwhichgradeareyouin',
      name: 'studentwhichgradeareyouin',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/StudentWhichGradeAreYouInView.vue')
    },*/
    {
      path: '/studentgradelevelmiddleyears',
      name: 'studentgradelevelmiddleyears',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/StudentGradeLevelMiddleYearsView.vue')
    },
    {
      path: '/studentgradeleveldiplomaprgram',
      name: 'studentgradeleveldiplomaprgram',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/StudentGradeLevelDiplomaProgramView.vue')
    },
    {
      path: '/studentsubjectsinstruction',
      name: 'studentsubjectsinstruction',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/StudentSubjectsInstructionView.vue')
    },
    {
      path: '/studentsubjectsareasoffocus',
      name: 'studentsubjectsareasoffocus',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/StudentSubjectAreaOfFocusView.vue')
    },
    {
      path: '/studentsubjects',
      name: 'studentsubjects',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/StudentSubjectsView.vue')
    },
    {
      path: '/studentnote',
      name: 'studentnote',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/StudentNoteView.vue')
    },
    {
      path: '/studenttimezone',
      name: 'studenttimezone',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/StudentTimeZoneView.vue')
    },
    {
      path: '/becomeaninstructorcompleted',
      name: 'becomeaninstructorcomplted',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/BecomeAnInstructorCompletedView.vue')
    },
    {
      path: '/imastudent',
      name: 'imastudent',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/ImAStudentView.vue')
    },
    {
      path: '/imaparent',
      name: 'imaparent',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/ImAParentView.vue')
    },
    {
      path: '/counselorhome',
      name: 'counselorhome',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/CounselorHomeView.vue')
    },
  ]
})

export default router
