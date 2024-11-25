<template>
    <div @click="goToContactUsPage"
        class="absolute right-5 hidden sm:flex bg-udmercy-blue cursor-pointer bottom-5 shadow-md border border-solid border-gray-100 rounded-full px-5 gap-3 items-center">
        <img :src="FeedbackIcon" alt="Feedback Icon" class="w-5">
        <h3 class="font-normal text-sm text-white hover:underline">Feedback</h3>
    </div>
</template>

<script lang="ts" setup>
import { useRouter } from "vue-router";
import FeedbackIcon from "../../assets/feedback-icon-white.png"

const router = useRouter()

function goToContactUsPage() {
    router.push("/contact")
}
</script>