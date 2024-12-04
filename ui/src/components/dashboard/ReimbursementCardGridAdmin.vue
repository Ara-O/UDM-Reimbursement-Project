<template>
    <div
        class="relative h-48 overflow-auto flex flex-col justify-center gap-2.5 pt-0 text-white box-border px-6 py-1 bg-udmercy-blue w-96 max-w-96 min-w-96 rounded-md">
        <h3 class="font-medium text-base my-0 w-fit max-w-64 overflow-hidden whitespace-nowrap text-ellipsis cursor-pointer"
            @click="goToReimbursementPage">{{
                props.request.request.reimbursementName }}</h3>
        <h5 class="my-0 font-normal">Submitted by: {{ props.request.faculty.firstName + " " + props.request.faculty.lastName }}</h5>
        <h5 class="my-0 font-normal">Date: {{ parseDate(props.request.request.reimbursementDate) }}
        </h5>
        <span class="flex items-center justify-between mt-2">
            <div class="flex gap-3">
                <span
                    class="bg-white px-4 h-8 cursor-pointer py-2 justify-center flex items-center content-center rounded-full"
                    title="View PDF">
                    <h4 class=" text-black text-[12px] font-medium">View PDF</h4>
                </span>
                <span
                    class="bg-white px-4 h-8 cursor-pointer py-2 justify-center flex items-center content-center rounded-full"
                    title="View PDF">
                    <h4 class=" text-black text-[12px] font-medium">Edit</h4>
                </span> <span
                    class="bg-white px-4 h-8 cursor-pointer py-2 justify-center flex items-center content-center rounded-full"
                    title="View PDF">
                    <h4 class=" text-black text-[12px] font-medium">Approve</h4>
                </span> <span
                    class="bg-udmercy-red px-4 h-8 cursor-pointer py-2 justify-center flex items-center content-center rounded-full"
                    title="View PDF">
                    <h4 class=" text-white text-[12px] font-medium">Deny</h4>
                </span>
            </div>
        </span>
    </div>
</template>

<script lang="ts" setup>
import PencilIcon from "../../assets/blue-pencil.png"
import DuplicateIcon from "../../assets/duplicate-blue.png"
import DeleteIcon from "../../assets/trash-icon-white.png"
import parseDate from "../../utils/parseDate";
import ReimbursementStatus from './ReimbursementStatus.vue';
import { useRouter } from "vue-router";
import { ReimbursementTicket } from "../../types/types";
import { useConfirm } from "primevue/useconfirm";
import { TYPE, useToast } from "vue-toastification";
import axios from "axios";

const router = useRouter()
const props = defineProps<{
    request: ReimbursementTicket
}>()
const emits = defineEmits(['user-wants-to-delete-request', 'user-duplicated-a-request'])
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

async function duplicateRequest() {
    try {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/duplicate-request`, { id: props.request._id })
        emits("user-duplicated-a-request")
    } catch (error: any) {
        toast(`${error?.response?.data?.message || "There was an unexpected error. Please try again later"}`, {
            type: TYPE.ERROR
        })
    }
}

</script>