<template>
    <div class="p-datatable-wrapper">
        <DataTable :value="props.requests" showGridlines class="border border-collapse border-solid border-black">
            <Column field="reimbursementName" header="Name" style="width: 45%; overflow: auto" sortable></Column>
            <Column field="reimbursementStatus" header="Status" sortable style="width: 20%"></Column>
            <Column field="reimbursementDate" header="Date" sortable style="width: 20%">
                <template #body="slotProps">{{
                    parseDate(slotProps.data.reimbursementDate)
                }}</template>
            </Column>
            <Column field="cost" header="Cost" sortable style="width: 20%">
                <template #body="slotProps">${{ slotProps.data.totalCost.toFixed(2) }}</template>
            </Column>
            <Column field="actions" header="Actions" style="width: 20%">
                <template #body="slotProps">
                    <div class="flex gap-5 justify-center">
                        <span class="underline cursor-pointer h-[16px]" title="Edit request"
                            @click="goToReimbursementPage(slotProps.data._id)">
                            <img :src="PencilIcon" alt="Pencil icon" class="w-4" /></span>
                        <span @click="duplicateRequest(slotProps.data._id)" class="cursor-pointer"
                            title="Duplicate request">
                            <img :src="DuplicateIcon" alt="Duplicate icon" class="w-5" />
                        </span>
                        <span class="underline cursor-pointer h-[16px]" @click="deleteRequest(slotProps.data._id)"
                            title="Delete request">
                            <img :src="DeleteIcon" alt="Delete Icon" class="w-4" /></span>
                    </div>
                </template>
            </Column>
        </DataTable>
    </div>
</template>


<script lang="ts" setup>
import PencilIcon from "../../assets/blue-pencil.png"
import DeleteIcon from "../../assets/red-delete-icon.png"
import DuplicateIcon from "../../assets/duplicate-blue.png"
import parseDate from "../../utils/parseDateFormatted";
import ReimbursementStatus from './ReimbursementStatus.vue';
import { useRouter } from "vue-router";
import { ReimbursementTicket } from "../../types/types";
import { useConfirm } from "primevue/useconfirm";
import { TYPE, useToast } from "vue-toastification";
import Column from "primevue/column";
import DataTable from "primevue/datatable";
import axios from "axios";

const router = useRouter()
const props = defineProps<{
    requests: ReimbursementTicket[]
}>()
const emits = defineEmits(['user-wants-to-delete-request', 'user-duplicated-a-request'])
const confirm = useConfirm()
const toast = useToast()

function goToReimbursementPage(id) {
    router.push({
        path: "/add-reimbursement", query: {
            reimbursementId: id
        }
    })
}

function deleteRequest(id) {
    emits("user-wants-to-delete-request", id)
}

async function duplicateRequest(id) {
    try {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/duplicate-request`, { id: id })
        emits("user-duplicated-a-request")
    } catch (error: any) {
        toast(`${error?.response?.data?.message || "There was an unexpected error. Please try again later"}`, {
            type: TYPE.ERROR
        })
    }
}

</script>

<style>
.p-datatable-column-sorted .p-datatable-sort-icon {
    color: white !important
}

.p-datatable-sort-icon {
    color: lightgray !important;
}

.p-datatable-sortable-column:not(.p-datatable-column-sorted):hover .p-datatable-sort-icon {
    color: white !important
}

.p-datatable-table {
    border: none !important;
    padding: 0px
}

.p-datatable.p-component.p-datatable-gridlines.border.border-collapse.border-solid.border-black {
    border: none !important;
    padding: 0px
}
</style>