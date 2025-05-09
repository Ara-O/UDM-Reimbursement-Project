<template>
  <div
    class="relative h-44 overflow-auto flex flex-col justify-center gap-2.5 text-white box-border px-6 bg-udmercy-blue w-96 max-w-96 min-w-96 rounded-md"
  >
    <div>
      <p
        class="absolute bg-white top-0 right-3 cursor-pointer rounded-md font-medium text-[13px] w-30 px-3 flex items-center justify-center text-center h-7"
        :class="{ 'text-udmercy-blue': true }"
        v-if="hasPending(props.request.request.request_review_log)"
      >
        Pending Reviewer
      </p>
    </div>
    <h3
      class="font-medium text-base my-0 max-w-48 mt-[-10px] overflow-hidden whitespace-nowrap text-ellipsis"
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
          title="Edit Request"
          @click="editRequest"
        >
          <img :src="EditIcon" class="w-4" alt="Edit PDF" title="Edit PDF" />
        </span>
        <span
          class="bg-white px-4 w-12 h-8 cursor-pointer py-2 justify-center flex items-center content-center rounded-full"
          title="Forward Request"
          @click="forwardRequestDialogIsVisible = true"
        >
          <img
            :src="ForwardIcon"
            class="w-4 mt-[-2px]"
            alt="Forward Request"
            title="Forward Request"
          />
        </span>
        <span
          class="bg-white px-4 w-12 h-8 cursor-pointer py-2 justify-center flex items-center content-center rounded-full"
          title="Track Request"
          @click="trackRequestIsVisible = true"
        >
          <img
            :src="TrackIcon"
            class="w-4"
            alt="Track Request"
            title="Track Request"
          />
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
            <img :src="DenyIcon" alt="Deny request" class="w-3" />
          </span>
        </div>
      </div>
    </span>
  </div>

  <Dialog
    :dismissable-mask="true"
    v-model:visible="approvePopupIsVisible"
    modal
    :key="props.request.reimbursementName"
    header="Request Acceptance Confirmation"
    :style="{ width: '25rem' }"
  >
    <h3
      class="text-surface-500 dark:text-surface-400 font-normal mt-1 text-sm leading-7 block mb-5"
    >
      Are you sure you want to approve this request? If so, if you have any
      feedback or comments, please add it to the field below:
    </h3>

    <textarea
      name="request-denial"
      placeholder="Message here"
      class="w-full text-sm px-3 border-gray-300 h-32 leading-7 rounded-md border-solid border py-2 mt-0"
      v-model="requestApprovalMessage"
    ></textarea>

    <div class="flex justify-end gap-2 mt-8">
      <Button
        type="button"
        label="Cancel"
        severity="secondary"
        @click="approvePopupIsVisible = false"
      ></Button>
      <Button
        type="button"
        label="Approve Request"
        class="!bg-udmercy-blue !border-none"
        @click="approveRequest"
      ></Button>
    </div>
  </Dialog>

  <!-- DENY -->
  <Dialog
    :dismissable-mask="true"
    v-model:visible="denyPopupIsVisible"
    modal
    :key="props.request.reimbursementName"
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

  <!-- Forward Request Dialog -->
  <Dialog
    :dismissable-mask="true"
    v-model:visible="forwardRequestDialogIsVisible"
    modal
    header="Forward Request"
    :style="{ width: '50rem' }"
  >
    <h3
      class="text-surface-500 dark:text-surface-400 font-normal mt-1 text-sm leading-7 block !mb-0"
    >
      Please enter the tag of the person you would like to forward this to.
    </h3>

    <AutoComplete
      placeholder="Enter Tag"
      dropdown
      v-model="selectedTag"
      empty-search-message="No Existing Tags"
      style="height: 30px; box-shadow: none !important"
      class="border-sm !shadow-none sm:!w-80 !w-full rounded-md mt-4 !h-10 border !border-gray-200"
      :suggestions="tags"
      @complete="onComplete"
    />

    <input
      type="text"
      v-model="forwardRequestTo"
      class="border-gray-200 shadow-sm border-solid sm:!w-80 !w-full rounded-md !h-10 px-4 mt-4 border ms-4"
      placeholder="Enter Email"
      v-if="!multFacultyFoundByTags"
    />

    <select
      class="border-gray-200 bg-white border-solid shadow-sm sm:!w-80 !w-full rounded-md !h-10 px-4 mt-4 border ms-4"
      v-if="multFacultyFoundByTags"
      v-model="selectedFaculty"
    >
      <option
        v-for="faculty in FacultyFoundByTags"
        :key="faculty.id"
        :value="faculty.name"
      >
        {{ faculty.name }}
      </option>
    </select>

    <p class="text-sm">or</p>
    <p class="text-sm">Forward to any email:</p>
    <input
      type="text"
      v-model="forwardRequestToAnyEmail"
      class="border-gray-200 shadow-sm border-solid sm:!w-80 !w-full rounded-md !h-10 px-4 mt-1 border"
      placeholder="Enter Email"
    />
    <Button
      type="button"
      label="Select"
      class="!bg-udmercy-blue ml-4 !border-none"
      @click="selectAsFacultyToForward"
    ></Button>

    <div class="border border-solid border-gray-200 my-5 rounded-full"></div>
    <p class="text-sm">
      Forwarding request to: {{ forwardRequestTo }}
      {{ forwardName ? "(" + forwardName + ")" : "" }}
    </p>
    <div class="flex justify-end gap-2 mt-8">
      <Button
        type="button"
        label="Cancel"
        severity="secondary"
        @click="forwardRequestDialogIsVisible = false"
      ></Button>
      <Button
        type="button"
        label="Forward Request"
        class="!bg-udmercy-blue !border-none"
        @click="forwardRequest"
      ></Button>
    </div>
  </Dialog>

  <!-- Reviewer Message -->
  <Dialog
    :dismissable-mask="true"
    v-model:visible="reviewerMessageIsVisible"
    modal
    header="Reviewer Message"
    :style="{ width: '25rem' }"
  >
    <h3
      class="text-surface-500 dark:text-surface-400 font-normal mt-1 text-sm leading-7 block mb-5"
    >
      {{
        props.request.request.additional_approval_information ||
        "No additional messagess was added"
      }}
    </h3>

    <div class="flex justify-end gap-2 mt-8">
      <Button
        type="button"
        label="Cancel"
        severity="secondary"
        @click="reviewerMessageIsVisible = false"
      ></Button>
    </div>
  </Dialog>

  <!-- Track request -->
  <!-- Forward Request Dialog -->
  <Dialog
    :dismissable-mask="true"
    v-model:visible="trackRequestIsVisible"
    modal
    header="Track Request"
    :style="{ width: '50rem', 'padding-bottom': '20px' }"
  >
    <h3
      class="text-surface-500 dark:text-surface-400 font-normal mt-1 text-sm leading-7 block !mb-0"
    >
      Track the review status of this request
    </h3>

    <div
      v-for="reviewer in props.request.request.request_review_log"
      class="shadow-sm border px-4 py-1 rounded-md border-gray-200 mt-4 relative border-solid"
    >
      <reimbursement-status
        class="absolute top-3 right-4"
        :status="reviewer.review_status"
      ></reimbursement-status>
      <p class="font-medium">Reviewer Email: {{ reviewer.email }}</p>
      <p class="text-sm" v-if="reviewer.review_message">
        Message: {{ reviewer.review_message }}
      </p>
      <Button
        class="!bg-udmercy-blue !px-4 !text-sm !py-3 mb-5 !border-none"
        @click="() => withdrawReviewRequest(reviewer)"
        >Withdraw review request</Button
      >
    </div>
    <p
      v-if="props.request.request.request_review_log.length === 0"
      class="text-sm"
    >
      You have not forwarded this request to anyone yet.
    </p>
  </Dialog>

  <!-- <confirmation-popup
    v-if="showConfirmationPopup"
    :key="1"
    left-button-text="Discard Changes"
    right-button-text="Cancel"
    :cancel-function="cancelConfirmationPopup"
    :continue-function="cancelConfirmationPopup"
  >
    <template #message>
      Are you sure you want to witdraw this request from the list?
    </template>
  </confirmation-popup> -->
</template>

<script lang="ts" setup>
import Dialog from "primevue/dialog";
import ReimbursementStatus from "./ReimbursementStatus.vue";
import DenyIcon from "../../assets/deny-icon.png";
// import ConfirmationPopup from "../utilities/ConfirmationPopup.vue";
import Button from "primevue/button";
import ViewIcon from "../../assets/eye-view-blue.png";
import ApproveIcon from "../../assets/approve-icon.png";
import parseDate from "../../utils/parseDate";
import EditIcon from "../../assets/blue-pencil.png";
import AutoComplete from "primevue/autocomplete";
import { useRouter } from "vue-router";
import { TicketAndFaculty } from "../../types/types";
import { useConfirm } from "primevue/useconfirm";
import { TYPE, useToast } from "vue-toastification";
import axios from "axios";
import { onMounted, ref, watch } from "vue";
import ForwardIcon from "../../assets/forward-icon.png";
import TrackIcon from "../../assets/target-icon.png";

const router = useRouter();
const props = defineProps<{
  request: TicketAndFaculty;
}>();

const emits = defineEmits(["reload-requests-list"]);
const denyPopupIsVisible = ref<boolean>(false);
const requestDenialMessage = ref<string>("");
const approvePopupIsVisible = ref<boolean>(false);
const forwardRequestDialogIsVisible = ref<boolean>(false);
const trackRequestIsVisible = ref<boolean>(false);
const requestApprovalMessage = ref<string>("");
const reviewerMessageIsVisible = ref<boolean>(false);
const forwardRequestTo = ref<string>("");
const forwardName = ref<string>("");
const confirm = useConfirm();
const toast = useToast();
const tags = ref<string[]>([]);
const originalTags = ref<string[]>([]);
const selectedTag = ref<string>("");
const multFacultyFoundByTags = ref<boolean>(false);
const FacultyFoundByTags = ref<Faculties[]>([]);
const selectedFaculty = ref<string>("");
const forwardRequestToAnyEmail = ref<string>("");
const showConfirmationPopup = ref<boolean>(true);

interface Faculties {
  id: string;
  name: string;
  email: string;
  tag: string;
}

watch(selectedTag, (newTag) => {
  if (originalTags.value.includes(newTag)) {
    // Call the function when a tag is selected
    console.log("Calling UpdateEMailbyTag");
    updateEmailByTag(newTag);
  }
});

watch(selectedFaculty, (selFaculty) => {
  // Filter FacultyFoundByTags to find the selected faculty
  const selectedFacultyData = FacultyFoundByTags.value.filter(
    (faculty) => faculty.name === selFaculty
  );

  if (selectedFacultyData.length === 1) {
    // Only one faculty found
    forwardRequestTo.value = selectedFacultyData[0].email;
    forwardName.value = selectedFacultyData[0].name;

    // Set multFacultyFoundByTags to false as only one faculty is selected
    multFacultyFoundByTags.value = false;
  } else if (selectedFacultyData.length > 1) {
    // Multiple faculties found, so set multFacultyFoundByTags to true
    multFacultyFoundByTags.value = true;
  } else {
    // No faculty found, reset the forward request details
    forwardRequestTo.value = "";
    forwardName.value = "";
    multFacultyFoundByTags.value = false;
  }
});

function confirmRequestDenial() {
  denyPopupIsVisible.value = true;
}

/**
 * Checks if a request has at least one reviewer with a pending status.
 * @param {Object[]} request_review_log - The array of reviewers for the request.
 * @returns {boolean} - Whether the request has at least one reviewer with a pending status.
 */
function hasPending(request_review_log) {
  for (let i = 0; i < request_review_log.length; i++) {
    const reviewer = request_review_log[i];
    if (reviewer.review_status === "Pending") {
      return true;
    }
  }
  return false;
}

function selectAsFacultyToForward() {
  forwardRequestTo.value = "";
  selectedTag.value = "";
  forwardRequestTo.value = forwardRequestToAnyEmail.value;
}

/**
 * Forwards a reimbursement request to the specified email address.
 * Clears any existing toast notifications and shows a loading message.
 * Sends the reimbursement data and faculty information to the server.
 * On success, clears the loading message, shows a success toast,
 * reloads the requests list, and closes the forward request dialog.
 * On failure, clears the loading message and shows an error toast.
 *
 * @throws {Error} - If there is an error during the forwarding process.
 */

async function forwardRequest() {
  try {
    toast.clear();

    toast("Forwarding request...", {
      type: TYPE.INFO,
    });

    await axios.post(`${import.meta.env.VITE_API_URL}/admin/forward-request`, {
      to: forwardRequestTo.value,
      reimbursementData: props.request.request,
      faculty: props.request.faculty,
    });

    toast.clear();

    toast("Request successfully forwarded...", {
      type: TYPE.INFO,
    });

    emits("reload-requests-list");
    forwardRequestDialogIsVisible.value = false;
  } catch (err: any) {
    console.log(err);
    toast.clear();
    toast(
      err?.response?.data?.message ??
        "An unexpected error occured. Please try again later",
      {
        type: TYPE.ERROR,
      }
    );
  }
}

/**
 * Withdraw a reviewer from a reimbursement request.
 * @param {Object} reviewer - The reviewer object to be withdrawn.
 * @throws {Error} - If there was an error withdrawing the request.
 */
async function withdrawReviewRequest(reviewer: any) {
  try {
    let res = await axios.post(
      `${import.meta.env.VITE_API_URL}/admin/withdraw-review-request`,
      {
        reviewer_email: reviewer.email,
        reimbursement_id: props.request.request._id,
      }
    );

    toast("Reviewer has been withdrawn", {
      type: TYPE.SUCCESS,
    });

    emits("reload-requests-list");

    // props.request.request.request_review_log
  } catch (err: any) {
    toast.clear();
    toast(
      err?.response?.data?.message ||
        "There was an error withdrawing this request. Please try again later",
      {
        type: TYPE.ERROR,
      }
    );
  }
}

/**
 * Makes a GET request to retrieve all faculty with the given tag.
 *
 * On success, populates FacultyFoundByTags with the retrieved faculty,
 * and sets forwardRequestTo and forwardName accordingly.
 *
 * If multiple faculty are found, sets multFacultyFoundByTags to true.
 *
 * On failure, shows an error toast with a generic error message.
 *
 * @param {string} tag the tag to search for
 * @return {Promise<void>}
 */
async function updateEmailByTag(tag) {
  try {
    let faculties = await axios.get(
      `${import.meta.env.VITE_API_URL}/admin/retrieve-faculty-by-tag`,
      {
        params: { tag: tag },
      }
    );

    FacultyFoundByTags.value = faculties.data.map((faculty: any) => ({
      id: faculty._id,
      name: faculty.firstName + " " + faculty.lastName,
      email: faculty.workEmail,
      tag: faculty.tag,
    }));

    if (FacultyFoundByTags.value.length == 1) {
      forwardRequestTo.value = FacultyFoundByTags.value[0].email;
      forwardName.value = FacultyFoundByTags.value[0].name;

      console.log("FORWARD NAME", forwardName);
    } else if (FacultyFoundByTags.value.length == 0) {
      forwardRequestTo.value = "";
      forwardName.value = "";
    } else {
      multFacultyFoundByTags.value = true;
    }

    console.log(faculties, forwardRequestTo);
  } catch (err) {
    toast("An unexpected error occured. Please try again later", {
      type: TYPE.ERROR,
    });
    console.log(err);
  }
}

function editRequest() {
  console.log(props.request.request._id);
  router.push({
    path: "/admin/edit-reimbursement",
    query: {
      reimbursementId: props.request.request._id,
      facultyId: props.request.faculty._id,
    },
  });
}

function onComplete(event) {
  const query = event.query.toLowerCase();

  console.log("query", query);

  if (!event.query.trim().length) {
    tags.value = [...originalTags.value]; // Assuming originalTags holds the original unfiltered list of tags
  } else {
    tags.value = originalTags.value.filter((tag) => {
      return tag.toLowerCase().includes(query);
    });
  }
}

async function get_tags() {
  let res = await axios.get(
    `${import.meta.env.VITE_API_URL}/admin/retrieve-faculty-tags`
  );

  if (res.data.length !== 0) {
    originalTags.value = res.data.map((tag: any) => tag.tag); // Populate tags array
  } else {
    originalTags.value = ["No Tags Exist"]; // Fallback value if no tags are found
  }
}

function confirmRequestApproval() {
  approvePopupIsVisible.value = true;
}

/**
 * Submits a request denial to the backend and updates the component's state accordingly.
 *
 * @throws {Error} If there is an unexpected error when making the request
 */
async function denyRequest() {
  try {
    await axios.post(
      `${import.meta.env.VITE_API_URL}/admin/deny-reimbursement`,
      {
        reimbursementTicket: props.request.request,
        facultyID: props.request.faculty._id,
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
    toast("An unexpected error occured. Please try again later", {
      type: TYPE.ERROR,
    });
    console.log(err);
  }
}

async function approveRequest() {
  try {
    await axios.post(
      `${import.meta.env.VITE_API_URL}/admin/approve-reimbursement`,
      {
        reimbursementTicket: props.request.request,
        facultyID: props.request.faculty._id,
        approvalMessage: requestApprovalMessage.value,
      }
    );

    requestApprovalMessage.value = "";
    approvePopupIsVisible.value = false;
    emits("reload-requests-list");

    toast.clear();
    toast("Request approved successfully", {
      type: TYPE.SUCCESS,
    });
  } catch (err) {
    toast("An unexpected error occured. Please try again later", {
      type: TYPE.ERROR,
    });
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

onMounted(() => {
  get_tags();
});
</script>
