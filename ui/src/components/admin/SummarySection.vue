<template>
    <section class="flex gap-6">
        <div
            class="rounded-md border relative border-gray-200 border-solid w-80 py-4 justify-between items-center px-5">
            <h3 class="text-sm font-medium text-gray-600 my-0">Number of Pending Requests</h3>
            <h3 class="my-0 mt-2">{{ props.pendingRequests.length }}</h3>
            <img :src="HashtagIcon" alt="Count Icon" class=" opacity-50 w-4 absolute bottom-5 right-5">
        </div>

        <div
            class="rounded-md border relative border-gray-200 border-solid w-80 py-4 justify-between items-center px-5">
            <h3 class="text-sm font-medium text-gray-600 my-0">Total Submitted Requests</h3>
            <h3 class="my-0 mt-2">{{ props.pendingRequests.length }}</h3>
            <img :src="HashtagIcon" alt="Count Icon" class=" opacity-50 w-4 absolute bottom-5 right-5">
        </div>
    </section>
</template>

<script lang="ts" setup>
import HashtagIcon from "../../assets/hashtag.png"
const props = defineProps(["pendingRequests"])
</script>