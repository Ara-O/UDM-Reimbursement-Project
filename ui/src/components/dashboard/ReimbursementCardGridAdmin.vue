<template>
  <div
    class="relative h-48 overflow-auto flex flex-col justify-center gap-2.5 pt-0 text-white box-border px-6 py-1 bg-udmercy-blue w-96 max-w-96 min-w-96 rounded-md"
  >
    <h3
      class="font-medium text-base my-0 w-fit max-w-64 overflow-hidden whitespace-nowrap text-ellipsis cursor-pointer"
      @click="goToReimbursementPage"
    >
      {{ props.request.request.reimbursementName }}
    </h3>
    <h5 class="my-0 font-normal">
      Submitted by:
      {{
        props.request.faculty.firstName + " " + props.request.faculty.lastName
      }}
    </h5>
    <h5 class="my-0 font-normal">
      Date: {{ parseDate(props.request.request.reimbursementDate) }}
    </h5>
    <span class="flex items-center justify-between mt-2">
      <div class="flex gap-3">
        <span
          @click="viewPDF"
          class="bg-white w-12 px-4 h-8 cursor-pointer py-2 justify-center flex items-center content-center rounded-full"
          title="View PDF"
        >
          <img :src="ViewIcon" class="w-4" title="View PDF" />
        </span>
        <span
          class="bg-white px-4 w-12 h-8 cursor-pointer py-2 justify-center flex items-center content-center rounded-full"
          title="Edit PDF"
        >
          <img :src="EditIcon" class="w-4" alt="Edit PDF" title="Edit PDF" />
        </span>
        <div class="absolute bottom-[1.95rem] flex flex-col gap-3 right-5">
          <span
            class="bg-[#006672] px-4 w-12 h-8 cursor-pointer py-2 justify-center flex items-center content-center rounded-full"
            title="Approve Request"
            @click="confirmRequestApproval"
          >
            <img :src="ApproveIcon" alt="Approve" class="w-4" />
          </span>
          <span
            class="bg-udmercy-red w-12 px-4 h-8 cursor-pointer py-2 justify-center flex items-center content-center rounded-full"
            title="Deny Request"
            v-on:click="confirmRequestDenial"
          >
            <img :src="DenyIcon" alt="Deny request" class="w-4" />
          </span>
        </div>
      </div>
    </span>
  </div>
  <ConfirmDialog></ConfirmDialog>
  <Dialog
    v-model:visible="denyPopupIsVisible"
    modal
    header="Request Denial Confirmation"
    :style="{ width: '25rem' }"
  >
    <h3
      class="text-surface-500 dark:text-surface-400 font-normal mt-1 text-sm leading-7 block mb-5"
    >
      Are you sure you want to deny this request? If so, Please attach a message
      detailing the reason for denying this request
    </h3>

    <textarea
      name="request-denial"
      placeholder="Message here"
      class="w-full text-sm px-3 border-gray-300 h-32 leading-7 rounded-md border-solid border py-2 mt-0"
      v-model="requestDenialMessage"
    ></textarea>

    <div class="flex justify-end gap-2 mt-8">
      <Button
        type="button"
        label="Cancel"
        severity="secondary"
        @click="denyPopupIsVisible = false"
      ></Button>
      <Button
        type="button"
        label="Deny Request"
        class="!bg-udmercy-blue !border-none"
        @click="denyRequest"
      ></Button>
    </div>
  </Dialog>
</template>

<script lang="ts" setup>
import Dialog from "primevue/dialog";
import DenyIcon from "../../assets/deny-icon.png";
import Button from "primevue/button";
import ViewIcon from "../../assets/eye-view-blue.png";
import ApproveIcon from "../../assets/approve-icon.png";
import InputText from "primevue/inputtext";
import EditIcon from "../../assets/blue-pencil.png";
import parseDate from "../../utils/parseDateFormatted";
import ReimbursementStatus from "./ReimbursementStatus.vue";
import { useRouter } from "vue-router";
import { ReimbursementTicket, TicketAndFaculty } from "../../types/types";
import { useConfirm } from "primevue/useconfirm";
import { TYPE, useToast } from "vue-toastification";
import axios from "axios";
import ConfirmDialog from "primevue/confirmdialog";
import { onMounted, ref } from "vue";

const router = useRouter();
const props = defineProps<{
  request: TicketAndFaculty;
}>();

const emits = defineEmits(["reload-requests-list"]);
const denyPopupIsVisible = ref<boolean>(false);
const requestDenialMessage = ref<string>("");

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

function confirmRequestDenial() {
  denyPopupIsVisible.value = true;
}

function confirmRequestApproval() {
  confirm.require({
    message: "Are you sure you want to approve this reimbursement request?",
    header: "Confirmation",
    // icon: 'pi pi-exclamation-triangle',
    rejectProps: {
      label: "Cancel",
      severity: "secondary",
      outlined: true,
    },
    acceptProps: {
      label: "Yes, I am sure",
    },
    accept: () => {
      approveRequest();
    },
    reject: () => {},
  });
}

async function denyRequest() {
  try {
    props.request.request.reimbursementStatus = "Denied";

    await axios.post(
      `${import.meta.env.VITE_API_URL}/admin/deny-reimbursement`,
      {
        reimbursementTicket: props.request.request,
        denialMessage: requestDenialMessage.value,
      }
    );

    requestDenialMessage.value = "";
    denyPopupIsVisible.value = false;

    emits("reload-requests-list");

    toast.clear();
    toast("Request denied successfully", {
      type: TYPE.SUCCESS,
    });
  } catch (err) {
    console.log(err);
  }
}

async function approveRequest() {
  try {
    props.request.request.reimbursementStatus = "Approved";

    await axios.post(
      `${import.meta.env.VITE_API_URL}/api/update-reimbursement`,
      {
        reimbursementTicket: props.request.request,
      }
    );

    emits("reload-requests-list");

    toast.clear();
    toast("Request approved successfully", {
      type: TYPE.SUCCESS,
    });
  } catch (err) {
    console.log(err);
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

async function viewPDF() {
  try {
    toast.clear();
    toast("Loading... Please wait...", {
      type: TYPE.INFO,
    });

    let res = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/generate-pdf`,
      {
        reimbursementTicket: props.request.request,
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
</script>
