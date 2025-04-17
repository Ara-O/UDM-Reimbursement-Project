<template>
  <div
    class="relative h-44 overflow-auto flex flex-col justify-center gap-2 pt-0 text-white box-border px-6 py-1 bg-udmercy-blue w-96 max-w-96 min-w-96 rounded-md"
  >
    <h3
      class="font-medium text-base my-0 cursor-pointer w-fit max-w-56 overflow-hidden whitespace-nowrap text-ellipsis"
      @click="goToReimbursementPage"
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
          v-if="
            props.request.reimbursementStatus === 'Submitted' ||
            props.request.reimbursementStatus === 'Approved' ||
            props.request.reimbursementStatus === 'Approved*'
          "
          class="bg-white px-4 h-8 w-12 justify-center cursor-pointer py-2 flex items-center content-center rounded-full"
          @click="viewPdf"
          title="View"
        >
          <img :src="EyeIcon" class="w-4" alt="Eye Icon" />
        </span>
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
            props.request.reimbursementStatus != 'Approved' &&
            props.request.reimbursementStatus != 'Approved*'
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

    <span
      @click="showHistory"
      title="View History of Request"
      v-if="props.request.request_history != null"
      class="bg-white h-8 w-12 hover:text-lg transition-all border-solid absolute right-5 top-5 text-center cursor-pointer justify-center py-2 flex items-center content-center rounded-full"
    >
      <img :src="TrackIcon" alt="Track Request" class="w-4" />
    </span>
    <span
      @click="archiveRequest"
      v-if="
        props.request.reimbursementStatus === 'Approved' ||
        props.request.reimbursementStatus === 'Approved*'
      "
      title="Archive Request"
      class="bg-white h-8 w-12 hover:text-lg transition-all border-solid absolute right-20 top-5 text-center cursor-pointer justify-center py-2 flex items-center content-center rounded-full"
    >
      <img :src="ArchiveIcon" alt="Archive Request" class="w-4" />
    </span>

    <Dialog
      v-model:visible="history_messages_dialog_is_visible"
      modal
      header="History of Request"
      :style="{ width: '40rem', marginLeft: '10px', marginRight: '10px' }"
    >
      <Timeline
        :value="history_messages"
        class="my-5"
        :pt="{
          eventContent: 'text-sm leading-7 mt-[-5px] mb-10',
        }"
      >
        <template #opposite="slotProps">
          <small class="text-surface-500 dark:text-surface-400">{{
            slotProps.item.date_of_message
          }}</small>
        </template>
        <template #content="slotProps">
          {{ slotProps.item.request_message }}
        </template>
      </Timeline>
      <button
        type="button"
        class="bg-udmercy-blue float-right mt-4 text-white border-none rounded-md px-3 py-2 cursor-pointer"
        @click="history_messages_dialog_is_visible = false"
      >
        Okay
      </button>
    </Dialog>
  </div>
</template>

<script lang="ts" setup>
import EyeIcon from "../../assets/eye-view-blue.png";
import PencilIcon from "../../assets/blue-pencil.png";
import DuplicateIcon from "../../assets/duplicate-blue.png";
import DeleteIcon from "../../assets/trash-icon-white.png";
import ReimbursementStatus from "./ReimbursementStatus.vue";
import ArchiveIcon from "../../assets/archive-icon.png";
import Timeline from "primevue/timeline";
import { useRouter } from "vue-router";
import { ReimbursementTicket } from "../../types/types";
import { useConfirm } from "primevue/useconfirm";
import Dialog from "primevue/dialog";
import TrackIcon from "../../assets/black-history.png";
import { TYPE, useToast } from "vue-toastification";
import axios from "axios";
import { ref } from "vue";
import parseDate from "../../utils/parseDate";

type History = {
  _id?: string;
  date_of_message: string;
  request_message: string;
};

const router = useRouter();
const props = defineProps<{
  request: ReimbursementTicket;
}>();

const emits = defineEmits([
  "user-wants-to-delete-request",
  "user-duplicated-a-request",
  "user-wants-to-archive-request",
]);

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

function archiveRequest() {
  emits("user-wants-to-archive-request", props.request._id);
}

/**
 * Duplicates a reimbursement request.
 *
 * Emits "user-duplicated-a-request" on success and displays an error message on failure.
 *
 * @async
 * @function
 */
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

function downloadPDF(pdfData: string) {
  const linkSource = pdfData;
  let iframe =
    "<iframe width='100%' height='100%' src='" + linkSource + "'></iframe>";
  let x = window.open();
  if (x != null) {
    x.document.open();
    x.document.write(iframe);
    x.document.close();

    // Remove padding from the iframe content
    x.document.querySelector("style") ||
      x.document.head.appendChild(x.document.createElement("style"));
    // @ts-ignore
    x.document.querySelector("style").textContent += `
  body, iframe {
    margin: 0;
    padding: 0;
    overflow: hidden
  }
`;
  }
}

async function viewPdf() {
  try {
    toast.clear();
    toast("Loading... Please wait...", {
      type: TYPE.INFO,
    });

    let res = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/generate-pdf`,
      {
        reimbursementTicket: props.request,
      }
    );

    downloadPDF(res.data);

    toast.clear();
  } catch (err: any) {
    console.log(err);
    toast.clear();
    toast(
      err?.response?.data?.message ||
        "There was an error previewing this PDF. Please try again later",
      {
        type: TYPE.ERROR,
      }
    );
  }
}

/**
 * Shows the request history for the currently selected reimbursement request
 * in a dialog for the user to view.
 *
 * @throws {Error} If there is an unexpected error fetching the request history
 *                 or displaying the dialog.
 */
async function showHistory() {
  try {
    history_messages.value = props.request.request_history;

    history_messages_dialog_is_visible.value = true;
  } catch (err) {
    toast.clear();
    console.log(err);
    toast(
      "An unexpected error occured when fetching this request's message. Please try again later",
      {
        type: TYPE.ERROR,
      }
    );
  }
}
</script>

<style>
.p-timeline-event-opposite {
  text-align: start !important;
  width: 125px !important;
  flex: none !important;
}

.p-timeline-event-marker::before {
  background: var(--udmercy-blue) !important;
}
</style>
