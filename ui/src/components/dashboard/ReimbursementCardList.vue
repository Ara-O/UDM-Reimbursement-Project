<template>
    <div class="reimbursement">

        <h3 class="overflow-hidden text-ellipsis whitespace-nowrap max-w-80"
            :title="request.reimbursementName || 'Invalid Reimbursement'">
            {{ request.reimbursementName || "Invalid Reimbursement" }}
        </h3>
        <h5>
            ${{ request.totalCost ? request.totalCost.toFixed(2) : "0.00" }}
        </h5>
        <h5>
            {{ parseDate(request.reimbursementDate) }}
        </h5>
        <h5>
            {{ request.reimbursementStatus || "Invalid" }}
        </h5>
        <div class="reimbursement-buttons">
            <button title="Modify Request" style="background-color: white; border: 0px">
                <img :src="PencilIcon" alt="Pencil icon" class="w-4" />
            </button>
            <button title="Delete Request" style="background-color: #a5093e">
                <img :src="DeleteIcon" alt="Delete Icon" class="w-4" />
            </button>
        </div>
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