<template>
    <img :src="HamburgerIcon" @click="toggleSidebar" class="w-11 cursor-pointer absolute top-7 right-7 opacity-70" />
    <Drawer v-model:visible="sidebar_is_visible" header="Manage Info" position="right">
        <div class="flex flex-col gap-10 h-72 text-left mt-5">
            <router-link to="/account"
                class="py-4 rounded-md bg-udmercy-blue text-white text-sm hover:underline no-underline text-center hover:text-white hover:bg-[#002865] transition-all duration-200">Manage
                Account
                Information</router-link>
            <router-link to="/manage-foapa"
                class="py-4 rounded-md bg-udmercy-blue text-white text-sm hover:underline no-underline text-center hover:text-white hover:bg-[#002865] transition-all duration-200">Manage
                FOAPA Details</router-link>
            <router-link to="/change-password"
                class="py-4 rounded-md bg-udmercy-blue text-white text-sm hover:underline no-underline text-center hover:text-white hover:bg-[#002865] transition-all duration-200">Change
                password</router-link>
            <router-link to="/contact"
                class="py-4 rounded-md bg-udmercy-blue text-white text-sm hover:underline no-underline text-center hover:text-white hover:bg-[#002865] transition-all duration-200">Contact
                Us</router-link>double check your FOAPA coverages and make sure they match.
            <button class="sign-out-button rounded-full py-3" @click="signOut">Sign Out</button>
        </div>
    </Drawer>
</template>

<script lang="ts" setup>
import Drawer from 'primevue/drawer';
import HamburgerIcon from "../../assets/profile-logo.png"
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useToast, TYPE } from 'vue-toastification';

const router = useRouter()
const toast = useToast()

const sidebar_is_visible = ref<boolean>(false)

function toggleSidebar() {
    sidebar_is_visible.value = true
}

function signOut() {
    localStorage.setItem("token", "");
    router.push("/");
    toast("Successfully signed out!", {
        type: TYPE.SUCCESS,
    });
}

</script>
