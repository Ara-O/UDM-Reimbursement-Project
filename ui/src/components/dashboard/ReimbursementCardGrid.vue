<template>
    <div
        class="relative h-44 overflow-auto flex flex-col justify-center gap-2 pt-0 text-white box-border px-6 py-1 bg-udmercy-blue w-96 max-w-96 min-w-96 rounded-md">
        <h3 class="font-medium text-base my-0 w-min cursor-pointer" @click="goToReimbursementPage">{{
            props.request.reimbursementName }}</h3>
        <h5 class="my-0 font-normal">Last Updated: {{ parseDate(props.request.reimbursementDate) }}</h5>
        <h5 class="my-0 font-normal">Cost: ${{ props.request.totalCost ? props.request.totalCost.toFixed(2) : "0.00" }}
        </h5>
        <span class="flex items-center justify-between mt-2">
            <reimbursement-status :status="props.request.reimbursementStatus"></reimbursement-status>
            <div class="flex gap-4">
                <span class="bg-white px-4 h-8 w-12 cursor-pointer py-2 flex items-center content-center rounded-full"
                    @click="goToReimbursementPage">
                    <img :src="PencilIcon" class="w-4" alt="Pencil Icon">
                </span>
                <span @click="deleteRequest"
                    class="bg-udmercy-red h-8 w-12 px-4 cursor-pointer py-2 flex items-center content-center rounded-full">
                    <img :src="DeleteIcon" class="w-3.5" alt="Pencil Icon">
                </span>
            </div>
        </span>
    </div>
</template>

<script lang="ts" setup>
import PencilIcon from "../../assets/blue-pencil.png"
import DeleteIcon from "../../assets/trash-icon-white.png"
import parseDate from "../../utils/parseDate";
import ReimbursementStatus from './ReimbursementStatus.vue';
import { useRouter } from "vue-router";
import { ReimbursementTicket } from "../../types/types";
import { useConfirm } from "primevue/useconfirm";
import { TYPE, useToast } from "vue-toastification";

const router = useRouter()
const props = defineProps<{
    request: ReimbursementTicket
}>()
const emits = defineEmits(['user-wants-to-delete-request'])
const confirm = useConfirm()
const toast = useToast()

function goToReimbursementPage() {
    router.push({
        path: "/add-reimbursement", query: {
            reimbursementId: props.request._id
        }
    })
}

function deleteRequest() {
    emits("user-wants-to-delete-request", props.request._id)
}

</script>