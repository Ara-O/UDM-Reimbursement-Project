<template>
    <div @click="goToContactUsPage"
        class="absolute right-5 cursor-pointer bottom-5 shadow-md border border-solid border-gray-100 rounded-full px-5 gap-3 flex items-center">
        <img :src="FeedbackIcon" alt="Feedback Icon" class="w-6">
        <h3 class="font-normal text-sm text-gray-500 hover:underline">Feedback</h3>
    </div>
</template>

<script lang="ts" setup>
import { useRouter } from "vue-router";
import FeedbackIcon from "../../assets/feedback-icon.png"

const router = useRouter()

function goToContactUsPage() {
    router.push("/contact")
}
</script>