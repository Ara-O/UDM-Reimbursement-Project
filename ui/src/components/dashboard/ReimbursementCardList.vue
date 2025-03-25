<template>
  <div class="reimbursement">
    <h3
      class="text-ellipsis max-w-64 overflow-hidden text-nowrap whitespace-nowrap"
      :title="request.reimbursementName || 'Invalid Reimbursement'"
    >
      {{ request.reimbursementName || "Invalid Reimbursement" }}
    </h3>
    <h5>${{ request.totalCost ? request.totalCost.toFixed(2) : "0.00" }}</h5>
    <h5>
      {{ parseDate(request.reimbursementDate) }}
    </h5>
    <h5>
      {{ request.reimbursementStatus || "Invalid" }}
    </h5>
    <div class="flex items-center gap-3">
      <button
        title="Duplicate Request"
        class="bg-white cursor-pointer border-none"
        @click="duplicateRequest"
      >
        <img :src="DuplicateIcon" alt="Pencil icon" class="w-5" />
      </button>
      <button
        v-if="
          request.reimbursementStatus != 'Submitted' &&
          request.reimbursementStatus != 'Approved' &&
          request.reimbursementStatus != 'Approved*'
        "
        title="Modify Request"
        class="bg-white cursor-pointer border-none"
        @click="goToReimbursementPage"
      >
        <img :src="PencilIcon" alt="Pencil icon" class="w-4" />
      </button>
      <span
        v-if="
          props.request.reimbursementStatus === 'Submitted' ||
          props.request.reimbursementStatus === 'Approved'
        "
        class="bg-white h-8 justify-center cursor-pointer py-2 flex items-center content-center rounded-full"
        @click="viewPdf"
        title="View"
      >
        <img :src="EyeIcon" class="w-4" alt="Eye Icon" />
      </span>
      <button
        title="Delete Request"
        class="bg-white cursor-pointer border-none"
        @click="deleteRequest"
      >
        <img :src="DeleteIcon" alt="Delete Icon" class="w-4" />
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import PencilIcon from "../../assets/blue-pencil.png";
import DeleteIcon from "../../assets/trash-icon.png";
import DuplicateIcon from "../../assets/duplicate-blue.png";
import ReimbursementStatus from "./ReimbursementStatus.vue";
import { useRouter } from "vue-router";
import { ReimbursementTicket } from "../../types/types";
import { useConfirm } from "primevue/useconfirm";
import { TYPE, useToast } from "vue-toastification";
import axios from "axios";
import parseDate from "../../utils/parseDate";
import EyeIcon from "../../assets/eye-view-blue.png";
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

function goToReimbursementPage() {
  router.push({
    path: "/add-reimbursement",
    query: {
      reimbursementId: props.request._id,
    },
  });
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
</script>
