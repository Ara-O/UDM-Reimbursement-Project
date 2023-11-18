import { defineStore } from 'pinia'

export const useUserInfoStore = defineStore('user-data', {
    state: () => ({
        userData: {}
    }),

    actions: {
        updateUserData(payload) {
            this.userData = payload
            console.log(payload)
        }
    }
})