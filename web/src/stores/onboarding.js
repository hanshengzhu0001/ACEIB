import { defineStore } from "pinia";
import { ref, reactive } from 'vue'

export const userStore = defineStore('user', () => {

        const user = reactive({userType: "instrcutor"})
        
        function setUserType(type){

            user["userType"] = type;

        }

        return { user, setUserType }

        /*{

        state: () => {

            return { count: 0}

        },
        actions: {

            increment() {

                this.count++;

            }

        }*/
})