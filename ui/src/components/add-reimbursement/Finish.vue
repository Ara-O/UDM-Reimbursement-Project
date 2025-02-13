<template>
  <section
    class="xl:w-auto mx-10 sm:mx-20 xl:ml-0 h-full sm:mt-0 mb-32 sm:mb-0"
  >
    <span class="flex items-center gap-6 mb-2">
      <h2 class="font-semibold my-0 text-[27px]">Finish</h2>
      <img src="../../assets/edit-icon.png" alt="Edit icon" class="w-7" />
    </span>

    <div>
      <h3 class="text-sm font-medium leading-7">
        Select an option from the multiple categories as to how you would like
        to proceed:
      </h3>

      <h3 class="text-base mt-8 font-semibold">
        Save your reimbursement claim:
      </h3>
      <div class="flex gap-5 mt-6 flex-wrap">
        <button
          @click="saveReimbursement"
          class="bg-udmercy-blue text-white w-64 border-none px-5 h-11 rounded-full cursor-pointer text-xs"
        >
          Save as a Draft
        </button>
        <button
          @click="discardChanges"
          class="bg-udmercy-red text-white w-64 border-none px-5 h-11 rounded-full cursor-pointer text-xs"
        >
          Discard Changes
        </button>
        <!-- <button
          @click="saveAsTemplate"
          class="bg-udmercy-blue text-white w-64 border-none px-5 h-11 rounded-full cursor-pointer text-xs"
        >
          Save as Template
        </button> -->
      </div>

      <h3 class="text-base font-semibold">Manage generated PDF:</h3>
      <div class="flex gap-5 mt-6 flex-wrap">
        <button
          @click="createPdf"
          class="bg-udmercy-blue text-white w-64 border-none px-5 h-11 rounded-full cursor-pointer text-xs"
        >
          Preview generated PDF
        </button>
        <button
          @click="download"
          class="bg-udmercy-blue text-white w-64 border-none px-5 h-11 rounded-full cursor-pointer text-xs"
        >
          Download generated PDF
        </button>
      </div>

      <h3 class="text-base font-semibold">Submit generated PDF:</h3>
      <div class="flex gap-5 mt-6 flex-wrap">
        <button
          @click="emailPDF"
          class="bg-udmercy-blue text-white w-64 border-none px-5 h-11 rounded-full cursor-pointer text-xs"
        >
          Email Reimbursement Request
        </button>

        <button
          @click="markClaimAsSubmitted"
          class="bg-udmercy-blue text-white w-64 border-none px-5 h-11 rounded-full cursor-pointer text-xs"
        >
          Submit Request
        </button>
      </div>
      <div class="flex gap-5 items-center">
        <button
          type="button"
          @click="moveToPreviousSection"
          class="bg-udmercy-blue mt-8 text-white border-none w-64 h-11 rounded-full cursor-pointer text-xs flex justify-center items-center gap-4"
        >
          <img src="../../assets/prev-arrow.png" class="w-3" />
          Previous Section
        </button>
      </div>
      <br />
      <span class="flex gap-5 flex-wrap"> </span>
      <h5 class="font-normal" v-if="currentlyCreatingPDF">
        Generating PDF, please wait...
      </h5>
    </div>
    <confirmation-popup
      v-if="showConfirmationPopup"
      left-button-text="Discard Changes"
      right-button-text="Cancel"
      :cancel-function="returnToDashboard"
      :continue-function="cancelConfirmationPopup"
    >
      <template #message>
        Are you sure you want to discard the changes you made to this
        reimbursement claim?
      </template>
    </confirmation-popup>
    <div
      v-if="showEmailPopup"
      class="absolute bg-black bg-opacity-50 h-screen top-0 left-0 w-screen items-center flex justify-center"
    >
      <div
        class="bg-white shadow-md border border-solid border-gray-100 h-min px-6 box-border w-96 py-3 rounded-md"
      >
        <span class="flex items-center m-0">
          <h3 class="font-semibold mb-0">
            Send this claim attached to an email
          </h3>
          <img
            :src="CancelIcon"
            alt="Cancel icon"
            class="w-3 cursor-pointer"
            @click="showEmailPopup = false"
          />
        </span>
        <span>
          <Form @submit="sendEmail">
            <div>
              <h4 class="font-semibold text-sm">Recipient</h4>
              <Field
                class="h-8 w-full box-border px-3 border-gray-300 border-solid border rounded-md"
                :rules="isValidRecipientEmail"
                name="recipient"
                type="text"
                value=""
              >
              </Field>
              <ErrorMessage
                name="recipient"
                class="text-red-400 text-xs mt-2"
              />
            </div>
            <div>
              <h4 class="font-semibold text-sm">Subject</h4>
              <Field
                class="h-8 w-full box-border px-3 border-gray-300 border-solid border rounded-md"
                name="subject"
                type="text"
                :value="`${props.claim.reimbursementName} - ${props.claim.reimbursementReason}`"
              >
              </Field>
              <ErrorMessage name="subject" class="text-red-400 text-xs mt-2" />
            </div>
            <div>
              <h4 class="font-semibold text-sm leading-7">
                Message (Any supplementary info will be included in your email)
              </h4>
              <Field
                name="message"
                type="text"
                class="h-20 resize-none w-full box-border px-3 py-3 text-sm border-gray-300 border-solid border rounded-md"
                as="textarea"
              >
              </Field>
              <ErrorMessage name="message" class="text-red-400" />
            </div>
            <button
              type="submit"
              class="mt-6 mb-2 bg-udmercy-blue text-white border-none w-auto px-5 h-11 rounded-full cursor-pointer text-xs"
            >
              Send email
            </button>
            <h3 class="text-sm font-medium leading-6">
              Note: Your reimbursement claim PDF will be attached to this email
            </h3>
            <!-- <input type="checkbox" id="submitCB" name="submitCB" v-model="checked" /> -->
            <!-- <label for="submissionEmail" class="font-semibold text-sm leading-7">
              Submit Request
              <img src="../../assets/user-help-icon.png" alt="Help" class="w-4"
                title="By checking this box the claim will be marked as submitted. This will deduct the respective amounts from each of your saved FOAPA." />
            </label> -->
          </Form>
        </span>
      </div>
    </div>
    <ConfirmDialog></ConfirmDialog>
    <Dialog
      v-model:visible="showSubmitPopup"
      modal
      header="Submitting the Request"
      :style="{ width: '25rem' }"
    >
      <p class="text-sm font-normal my-2 leading-7">
        Would you like this reimbursement request to be submitted? Only do this
        if you are desiring to officially turn your request in for approval.
      </p>
      <button
        type="button"
        class="bg-udmercy-blue mt-4 text-white border-none rounded-md px-3 py-2 cursor-pointer"
        @click="dontSubmit"
      >
        No
      </button>
      <button
        type="button"
        class="bg-udmercy-blue mt-4 ml-4 text-white border-none rounded-md px-3 py-2 cursor-pointer"
        @click="markClaimAsSubmitted"
      >
        Submit
      </button>
    </Dialog>
  </section>
</template>

<script lang="ts" setup>
import axios from "axios";
import parseDate from "../../utils/parseDate";
import { Form, Field, ErrorMessage } from "vee-validate";
import { ReimbursementTicket } from "../../types/types";
import ConfirmDialog from "primevue/confirmdialog";
import { onMounted, ref } from "vue";
import ConfirmationPopup from "../utilities/ConfirmationPopup.vue";
import { useRoute, useRouter } from "vue-router";
import { TYPE, useToast } from "vue-toastification";
import { isValidRecipientEmail } from "../../utils/validators";
import CancelIcon from "../../assets/cross-icon.svg";
import { useConfirm } from "primevue/useconfirm";
import Dialog from "primevue/dialog";
const toast = useToast();

const props = defineProps<{
  claim: ReimbursementTicket;
}>();
const route = useRoute();
const router = useRouter();
const emits = defineEmits(["onClaimSaved", "move-to-previous-section"]);

let checked = false;
let currentlyCreatingPDF = ref<boolean>(false);
let userIsEditingReimbursement = ref<boolean>(false);
let showConfirmationPopup = ref<boolean>(false);
let showEmailPopup = ref<boolean>(false);
let showSubmitPopup = ref<boolean>(false);
//let foapaDetails;

function returnToDashboard() {
  router.push("/dashboard");
}

function cancelConfirmationPopup() {
  showConfirmationPopup.value = false;
}
function moveToPreviousSection() {
  emits("move-to-previous-section");
}

function emailPDF() {
  showEmailPopup.value = true;
}

async function sendEmail(values: any, { resetForm }) {
  let savedFoapaDetails;
  try {
    toast.clear();
    toast("Sending email... Please wait, this might take a minute.", {
      type: TYPE.INFO,
    });

    let response = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/retrieve-account-information`
    );

    savedFoapaDetails = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/retrieve-foapa-details`
    );

    await axios.post(
      `${import.meta.env.VITE_API_URL}/api/send-reimbursement-email`,
      {
        message: values.message,
        subject: values.subject,
        recipient: values.recipient,
        reimbursementData: props.claim,
        userInfo: response.data,
      }
    );

    toast.clear();
    toast("Your email was sent successfully", {
      type: TYPE.SUCCESS,
    });

    showEmailPopup.value = false;
    showSubmitPopup.value = true;

    resetForm();
  } catch (err) {
    console.log(err);
  }
}

async function dontSubmit() {
  await saveReimbursement();
  showSubmitPopup.value = false;
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

async function download() {
  toast.clear();
  toast("Creating your reimbursement claim PDF. Please wait...", {
    type: TYPE.INFO,
  });

  axios
    .get(`${import.meta.env.VITE_API_URL}/api/retrieve-account-information`)
    .then((response) => {
      props.claim.totalCost = getAllActivitiesAmount();

      const totalCoveredFoapaCost = props.claim.foapaDetails.reduce(
        (acc, curr) => (acc += Number(curr.cost)),
        0
      );

      if (totalCoveredFoapaCost > props.claim.totalCost) {
        toast(
          "Warning: The amount of money you are retrieving from your FOAPAs is more than the amount of money you are trying to get reimbursed for. Please double check your FOAPA coverages and make sure they match.",
          {
            type: TYPE.WARNING,
            // timeout: false,
          }
        );
      } else if (totalCoveredFoapaCost < props.claim.totalCost) {
        toast(
          "Warning: The amount of money you are retrieving from your FOAPAs is less than the amount of money you are trying to get reimbursed for. Please double check your FOAPA coverages and make sure they match.",
          {
            type: TYPE.WARNING,
            // timeout: false,
          }
        );
      }

      axios
        .post(`${import.meta.env.VITE_API_URL}/api/generate-pdf`, {
          reimbursementTicket: props.claim,
          userInfo: response.data,
        })
        .then((res) => {
          const link = document.createElement("a");
          const fileName = "reimbursement_claim.pdf";

          link.href = res.data;
          link.download = fileName;
          link.click();
          toast.clear();
        })
        .catch((err) => {
          // console.log("error: " + err.response);
          toast(
            err?.response?.message ||
              "There was an error generating your PDF. Please try again later",
            {
              type: TYPE.ERROR,
            }
          );
        });
    })
    .catch((err) => {
      toast("There was an error generating your PDF. Please try again later", {
        type: TYPE.ERROR,
      });
    });
}

async function checkForUDMPU(): Promise<boolean> {
  let users_foapa_details = await axios.get(
    `${import.meta.env.VITE_API_URL}/api/retrieve-foapa-details`
  );

  let user_has_added_UDMPU = false;
  // Loop through the users foapa details
  for (let i = 0; i < props.claim.foapaDetails.length; i++) {
    // For each foapa, get its ID
    let id = props.claim.foapaDetails[i].foapa_id;

    // Finds its corresponding doapa detail
    let foapaDetail = users_foapa_details.data.find(
      (foapa) => id === foapa._id
    );

    if (foapaDetail.isUDMPU) {
      user_has_added_UDMPU = true;
      break;
    }
  }

  toast.clear();

  if (props.claim.UDMPUVoucher === true && user_has_added_UDMPU === false) {
    toast(
      "Error: You have selected that you will be using a UDMPU Voucher but you have not used your UDMPU FOAPA. Please, either unselect this option, or add the default UDMPU FOAPA",
      {
        type: TYPE.ERROR,
      }
    );

    return false;
  }

  if (props.claim.UDMPUVoucher === false && user_has_added_UDMPU === true) {
    toast(
      "Error: You have used your UDMPU FOAPA, but did not specify that you will be using it in the Claim Information section. Please select the UDMPU option in the Claim Information section",
      {
        type: TYPE.ERROR,
      }
    );

    return false;
  }

  return true;
}

const confirmSubmission = useConfirm();

const markClaimAsSubmitted = async () => {
  if (getAllActivitiesAmount() === 0) {
    toast.clear();
    toast("You must have at least 1 expense in order to submit this request", {
      type: TYPE.ERROR,
    });
    return;
  }

  let user_used_udmpu_after_selecting_it = await checkForUDMPU();

  if (user_used_udmpu_after_selecting_it === false) {
    return;
  }

  createPdf();

  confirmSubmission.require({
    message: `Please verify that the generated PDF reflects the desired information before confirming the submission.`,
    // message: `Marking this request as submitted does not submit the request itself. The submission process
    // is still a work-in-progress, and you will need to email the generated PDF from this reimbursement
    // request to the appropriate channel. Moreoever, marking a request as submitted does not save this reimbursement request. Please make sure to save as a draft.`,
    header: "Important",
    // icon: "pi pi-exclamation-triangle",
    rejectProps: {
      label: "Cancel",
      severity: "danger",
      outlined: true,
    },
    acceptProps: {
      label: "Submit",
    },
    accept: async () => {
      try {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/submit-request`, {
          reimbursementTicket: props.claim,
        });

        toast("Reimbursement claim marked as submitted successfully", {
          type: TYPE.SUCCESS,
        });

        emits("onClaimSaved");

        router.push("/dashboard");
      } catch (err: any) {
        toast(err?.response?.data?.message || "An unexpected error occured", {
          type: TYPE.ERROR,
        });
      }
    },
    reject: () => {},
  });
};

async function submitTicket() {
  try {
    await axios.post(
      `${import.meta.env.VITE_API_URL}/api/mark-claim-as-submitted`,
      {
        reimbursementData: props.claim,
      }
    );
  } catch (error) {
    toast(
      "An error occured while submitting your reimbursement claim. Please try again later",
      {
        type: TYPE.INFO,
      }
    );
  }
}

function getAllActivitiesAmount(): number {
  let sum: number = 0;
  props.claim.activities.forEach((activity) => {
    sum += Number(activity.cost);
  });
  return sum;
}

async function createPdf() {
  try {
    toast.clear();
    toast("Creating your reimbursement claim PDF. Please wait...", {
      type: TYPE.INFO,
    });

    props.claim.totalCost = getAllActivitiesAmount();

    const totalCoveredFoapaCost = props.claim.foapaDetails.reduce(
      (acc, curr) => (acc += Number(curr.cost)),
      0
    );

    if (totalCoveredFoapaCost > props.claim.totalCost) {
      toast(
        "Warning: The amount of money you are retrieving from your FOAPAs is more than the amount of money you are trying to get reimbursed for. Please double check your FOAPA coverages and make sure they match.",
        {
          type: TYPE.WARNING,
          // timeout: false,
        }
      );
    } else if (totalCoveredFoapaCost < props.claim.totalCost) {
      toast(
        "Warning: The amount of money you are retrieving from your FOAPAs is less than the amount of money you are trying to get reimbursed for. Please double check your FOAPA coverages and make sure they match.",
        {
          type: TYPE.WARNING,
          // timeout: false,
        }
      );
    }

    let res = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/generate-pdf`,
      {
        reimbursementTicket: props.claim,
      }
    );

    toast.clear();
    downloadPDF(res.data);
    currentlyCreatingPDF.value = false;
    // .catch((err) => {
  } catch (err: any) {
    console.log(err);
    toast(
      err?.response?.data?.message ||
        "There was an error generating your PDF. Please try again later",
      {
        type: TYPE.ERROR,
      }
    );
  }
}

async function updateReimbursement() {
  props.claim.totalCost = getAllActivitiesAmount();
  props.claim.reimbursementDate = parseDate(new Date().toISOString());

  // console.log(props.claim);
  await axios.post(`${import.meta.env.VITE_API_URL}/api/update-reimbursement`, {
    reimbursementTicket: props.claim,
  });

  toast.clear();
  toast("Reimbursement claim updated successfully.", {
    type: TYPE.SUCCESS,
  });
  router.push("/dashboard");
}

async function addReimbursement() {
  try {
    props.claim.totalCost = getAllActivitiesAmount();
    props.claim.reimbursementDate = parseDate(new Date().toISOString());

    await axios.post(`${import.meta.env.VITE_API_URL}/api/add-reimbursement`, {
      reimbursementTicket: props.claim,
    });

    toast("Reimbursement claim saved successfully.", {
      type: TYPE.SUCCESS,
    });
    router.push("/dashboard");
  } catch (error) {
    toast(
      "There was an error saving this reimbursement claim. Please try again later",
      {
        type: TYPE.ERROR,
      }
    );
  }
}

async function saveReimbursement() {
  // console.log("Ticket is being saved");
  try {
    if (props.claim.reimbursementName.trim() === "") {
      toast.clear();
      toast("Please add a title to this reimbursement claim", {
        type: TYPE.ERROR,
      });

      return;
    }

    // toast("Saving reimbursement claim...", {
    //   type: TYPE.INFO,
    // });

    props.claim.reimbursementStatus = "In Progress";

    emits("onClaimSaved");

    if (userIsEditingReimbursement.value) {
      await updateReimbursement();
    } else {
      await addReimbursement();
    }
  } catch (err) {
    toast(
      "There was an error saving this reimbursement claim. Please try again",
      {
        type: TYPE.ERROR,
      }
    );
  }
}

function discardChanges() {
  showConfirmationPopup.value = true;
  emits("onClaimSaved");
}

onMounted(() => {
  if (route.query.reimbursementId) {
    userIsEditingReimbursement.value = true;
  }
});
</script>

<style>
.p-confirmdialog-accept-button {
  background-color: var(--udmercy-blue) !important;
  border: solid 1px var(--udmercy-blue) !important;
}

.p-confirmdialog-accept-button:hover {
  background-color: var(--udmercy-blue) !important;
  border: solid 1px var(--udmercy-blue) !important;
}

.p-confirmdialog {
  max-width: 500px !important;
  line-height: 30px;
  font-size: 13px;
}

.p-dialog-title {
  font-size: 16px !important;
}

.p-dialog-header {
  margin-bottom: -18px;
}

.p-button-label {
  font-size: 13px;
}
</style>
