<template>
    <div :style="getStyle(props.status)"
        class="my-0  font-medium h-8 flex items-center bg-white text-udmercy-blue px-3 py-1 rounded-md text-nm w-28">
        <p class="mx-auto"> {{ props.status || "Invalid" }}</p>
    </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
    status: string
}>()


interface Ticket {
    status: "Submitted" | "In Progress" | "Approved" | "Denied";
}

const getStyle = (status) => {
    const bgColors: Record<Ticket["status"], string> = {
        Submitted: "#006672", // blue
        "In Progress": "white", // orange
        Approved: "#2D7200", // purple
        Denied: "#72002D", // red
    };
    const colors: Record<Ticket["status"], string> = {
        Submitted: "white",
        "In Progress": "#002d72",
        Approved: "white",
        Denied: "white",
    };
    return {
        backgroundColor: bgColors[status] || "#002d72",
        color: colors[status] || "white", // Default background
    };
};


</script>