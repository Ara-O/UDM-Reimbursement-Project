<template>
    <div class="my-0 font-medium h-8 flex items-center bg-white text-udmercy-blue px-3 py-1 rounded-md text-nm w-28">
        <p class="mx-auto"> {{ status }}</p>
    </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
    status: string
}>()
</script>