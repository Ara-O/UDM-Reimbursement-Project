<template>
  <div
    class="relative h-44 overflow-auto flex flex-col justify-center gap-2 pt-0 text-white box-border px-6 py-1 bg-udmercy-blue w-96 max-w-96 min-w-96 rounded-md"
  >
    <h3
      class="font-medium text-base my-0 w-fit max-w-64 overflow-hidden whitespace-nowrap text-ellipsis"
    >
      {{ props.request.reimbursementName }}
    </h3>
    <h5 class="my-0 font-normal">
      Last Updated: {{ parseDate(props.request.reimbursementDate) }}
    </h5>
    <h5 class="my-0 font-normal">
      Cost: ${{
        props.request.totalCost ? props.request.totalCost.toFixed(2) : "0.00"
      }}
    </h5>
    <span class="flex items-center justify-between mt-2">
      <reimbursement-status
        :status="props.request.reimbursementStatus"
      ></reimbursement-status>
      <div class="flex gap-4">
        <span
          class="bg-white px-4 h-8 w-12 justify-center cursor-pointer py-2 flex items-center content-center rounded-full"
          @click="duplicateRequest"
          title="Duplicate Request"
        >
          <img :src="DuplicateIcon" class="w-5" alt="Pencil Icon" />
        </span>
        <span
          class="bg-white px-4 h-8 w-12 cursor-pointer py-2 justify-center flex items-center content-center rounded-full"
          @click="goToReimbursementPage"
          title="Edit Request"
          v-if="
            props.request.reimbursementStatus != 'Submitted' &&
            props.request.reimbursementStatus != 'Approved'
          "
        >
          <img :src="PencilIcon" class="w-4" alt="Pencil Icon" />
        </span>
        <span
          @click="deleteRequest"
          title="Delete Request"
          class="bg-udmercy-red h-8 w-12 px-4 cursor-pointer justify-center py-2 flex items-center content-center rounded-full"
        >
          <img :src="DeleteIcon" class="w-3.5" alt="Pencil Icon" />
        </span>
      </div>
    </span>
    <!-- <span
      @click="showDenialMessage"
      title="View Reason for Denial"
      v-if="props.request.reimbursementStatus == 'Denied'"
      class="bg-white border-udmercy-red border-2 hover:text-lg transition-all border-solid absolute right-5 top-7 h-8 w-12 px-4 cursor-pointer justify-center py-2 flex items-center content-center rounded-full"
    >
      ❓
    </span> -->
    <span
      @click="showHistory"
      title="View History of Request"
      v-if="props.request.request_history != null"
      class="bg-white border-udmercy-red border-2 hover:text-lg transition-all border-solid absolute right-5 top-7 h-8 w-12 px-4 cursor-pointer justify-center py-2 flex items-center content-center rounded-full"
      >
      ❓
    </span>
    <Dialog
      v-model:visible="history_messages_dialog_is_visible"
      modal
      header="History of Request"
      :style="{ width: '25rem' }"
    >
      <p v-for="request in props.request.request_history" class="text-sm font-normal my-2">
        {{
          request.date_of_message + " - " + request.request_message
        }}
      </p>
      <button
        type="button"
        class="bg-udmercy-blue mt-4 text-white border-none rounded-md px-3 py-2 cursor-pointer"
        @click="history_messages_dialog_is_visible = false"
      >
        Okay
      </button>
    </Dialog>
  </div>
</template>

<script lang="ts" setup>
import PencilIcon from "../../assets/blue-pencil.png";
import DuplicateIcon from "../../assets/duplicate-blue.png";
import DeleteIcon from "../../assets/trash-icon-white.png";
import parseDate from "../../utils/parseDateFormatted";
import ReimbursementStatus from "./ReimbursementStatus.vue";
import { useRouter } from "vue-router";
import { ReimbursementTicket } from "../../types/types";
import { useConfirm } from "primevue/useconfirm";
import Dialog from "primevue/dialog";
import { TYPE, useToast } from "vue-toastification";
import axios from "axios";
import { ref } from "vue";

const router = useRouter();
const props = defineProps<{
  request: ReimbursementTicket;
}>();
const emits = defineEmits([
  "user-wants-to-delete-request",
  "user-duplicated-a-request",
]);
const confirm = useConfirm();
const toast = useToast();
const history_messages = ref<History[]>([]);
const history_messages_dialog_is_visible = ref<boolean>(false);

function goToReimbursementPage() {
  router.push({
    path: "/add-reimbursement",
    query: {
      reimbursementId: props.request._id,
    },
  });
}

function deleteRequest() {
  emits("user-wants-to-delete-request", props.request._id);
}

async function duplicateRequest() {
  try {
    await axios.post(`${import.meta.env.VITE_API_URL}/api/duplicate-request`, {
      id: props.request._id,
    });
    emits("user-duplicated-a-request");
  } catch (error: any) {
    toast(
      `${
        error?.response?.data?.message ||
        "There was an unexpected error. Please try again later"
      }`,
      {
        type: TYPE.ERROR,
      }
    );
  }
}

async function showHistory() {
  try{
    let res = props.request.request_history

    history_messages[0] = res[0].date_of_message;
    history_messages[1] = res[0].request_message;

    history_messages_dialog_is_visible.value = true;
  } catch (err){
    toast.clear();
    console.log(err)
    toast(
      "An unexpected error occured when fetching this request's message. Please try again later",
      {
        type: TYPE.ERROR,
      }
    );
  }
}

// async function showDenialMessage() {
//   try {
//     let res = await axios.get(
//       `${import.meta.env.VITE_API_URL}/api/fetch-request-admin-message`,
//       {
//         params: {
//           id: props.request._id,
//         },
//       }
//     );

//     reason_for_denial.value = res.data.message;

//     reason_for_denial_dialog_is_visible.value = true;
//   } catch (err) {
//     toast.clear();
//     toast(
//       "An unexpected error occured when fetching this request's message. Please try again later",
//       {
//         type: TYPE.ERROR,
//       }
//     );
//   }
// }
</script>
