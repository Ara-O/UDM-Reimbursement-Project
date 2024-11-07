<template>
  <section
    class="xl:w-auto mx-10 sm:mx-20 xl:ml-0 h-full sm:mt-0 mb-32 sm:mb-0"
  >
    <span class="flex items-center gap-6 mb-2">
      <h2 class="font-semibold my-0 text-[27px]">Next Steps</h2>
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
          @click="saveAsTemplate"
          class="bg-udmercy-blue text-white w-64 border-none px-5 h-11 rounded-full cursor-pointer text-xs"
        >
          Save as Template
        </button>
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
          Email Reimbursement Claim
        </button>

        <button
          @click="submitTicket"
          class="bg-udmercy-blue text-white w-64 border-none px-5 h-11 rounded-full cursor-pointer text-xs"
        >
          Submit Reimbursement Claim
        </button>
      </div>
      <div class="flex gap-5 items-center">
      <button
        @click="discardChanges"
        class="bg-udmercy-red mt-8 text-white w-64 border-none px-5 h-11 rounded-full cursor-pointer text-xs"
      >
        Discard Changes
      </button>
      <button
        type="button"
        @click="moveToPreviousSection"
        class="bg-udmercy-blue mt-8 text-white border-none w-64 h-11 rounded-full cursor-pointer text-xs flex justify-center items-center gap-4"
      >
      <img src="../../assets/prev-arrow.png" class="w-3">
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
                value="adairja@udmercy.edu"
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
                value="Reimbursement Request"
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
                :value="knowFoapaText"
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
            <input
              type="checkbox"
              id="submitCB"
              name="submitCB"
              v-model="checked"
            />
            <label
              for="submissionEmail"
              class="font-semibold text-sm leading-7"
            >
              Mark Claim As Submitted?
              <img
                src="../../assets/user-help-icon.png"
                alt="Help"
                class="w-4"
                title="By checking this box the claim will be marked as submitted. This will deduct the respective amounts from each of your saved FOAPA."
              />
            </label>
          </Form>
        </span>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import axios from "axios";
import parseDate from "../../utils/parseDate";
import { Form, Field, ErrorMessage, validate } from "vee-validate";
import { ReimbursementTicket } from "../../types/types";
import { FoapaNumbers } from "../../types/types";
import { onMounted, ref } from "vue";
import ConfirmationPopup from "../utilities/ConfirmationPopup.vue";
import { useRoute, useRouter } from "vue-router";
import { TYPE, useToast } from "vue-toastification";
import pdfMake from "pdfmake/build/pdfmake";
import { isValidRecipientEmail } from "../../utils/validators";
import CancelIcon from "../../assets/cross-icon.svg";

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
let knowFoapaText = "";
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
  knowFoapaText = "";
  if (!props.claim.knowFoapa && props.claim.knowFoapa !== undefined)
    knowFoapaText = "I don't know one or more of my foapas";
  showEmailPopup.value = true;
}

async function sendEmail(values: any, { resetForm }) {
  let savedFoapaDetails;
  try {
    let response = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/retrieveAccountInformation`
    );

    savedFoapaDetails = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/retrieve-foapa-details`
    );

    if (checked) {
      await saveReimbursement();
      await submitTicket();
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/mark-claim-as-submitted`,
        {
          reimbursementData: props.claim,
        }
      );
    }

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

    toast("Your email was sent successfully", {
      type: TYPE.SUCCESS,
    });

    resetForm();
    showEmailPopup.value = false;
    //clear email values etc
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

async function download() {
  toast("Creating your reimbursement claim PDF. Please wait...", {
    type: TYPE.INFO,
  });

  axios
    .get(`${import.meta.env.VITE_API_URL}/api/retrieveAccountInformation`)
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
            timeout: false,
          }
        );
      } else if (totalCoveredFoapaCost < props.claim.totalCost) {
        toast(
          "Warning: The amount of money you are retrieving from your FOAPAs is less than the amount of money you are trying to get reimbursed for. Please double check your FOAPA coverages and make sure they match.",
          {
            type: TYPE.WARNING,
            timeout: false,
          }
        );
      }

      axios
        .get(`${import.meta.env.VITE_API_URL}/api/generatePdf`, {
          params: {
            reimbursementData: props.claim,
            userInfo: response.data,
          },
        })
        .then((res) => {
          const link = document.createElement("a");
          const fileName = "reimbursement_claim.pdf";

          link.href = res.data;
          link.download = fileName;
          link.click();
        })
        .catch((err) => {
          console.log("error: " + err);
          toast(
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

async function saveAsTemplate() {
  try {
    // toast("Saving reimbursement claim as template...", {
    //   type: TYPE.INFO,
    // });
    await axios.post(`${import.meta.env.VITE_API_URL}/api/save-as-template`, {
      reimbursementTicket: props.claim,
    });
    toast("Reimbursement saved as a template successfully.", {
      type: TYPE.SUCCESS,
    });
  } catch (error) {
    toast(
      "An unexpected error occured when saving your claim as a template. Please try again later",
      {
        type: TYPE.ERROR,
      }
    );
  }
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

  if (props.claim.UDMPUVoucher === true && user_has_added_UDMPU === false) {
    toast(
      "Error: You have selected that you will be using a UDMPU Voucher but you have not used your UDMPU FOAPA. Please, either unselect this option, or add a UDMPU FOAPA",
      {
        type: TYPE.ERROR,
      }
    );

    return false;
  }

  if (props.claim.UDMPUVoucher === false && user_has_added_UDMPU === true) {
    toast(
      "INFO: You have used your UDMPU FOAPA, but did not specify that you will be using it in the Claim Information section. This option has been automatically selected for you",
      {
        type: TYPE.INFO,
      }
    );

    props.claim.UDMPUVoucher = true;
  }

  return true;
}

async function submitTicket() {
  console.log("TICKET IS BEING SUBMITTED");
  try {
    await checkForUDMPU();
    //CHeck for UDMPU

    if (props.claim.foapaDetails.length === 0) {
      toast(
        "Warning: You are submitting this claim without adding any FOAPA numbers to cover the cost",
        {
          type: TYPE.WARNING,
          timeout: false,
        }
      );
    }
    if (props.claim.reimbursementReceipts.length === 0) {
      toast(
        "Error: Before submission, you must have at least one proof of payment/receipt attached with this reimbursement claim.",
        {
          type: TYPE.ERROR,
          timeout: false,
        }
      );
      return;
    }

    props.claim.reimbursementStatus = "Submitted";

    console.log(props.claim);
    await axios.post(
      `${import.meta.env.VITE_API_URL}/api/update-reimbursement`,
      {
        reimbursementTicket: props.claim,
      }
    );

    toast("Reimbursement claim submitted successfully", {
      type: TYPE.SUCCESS,
    });

    emits("onClaimSaved");

    router.push("/dashboard");
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

function createPdf() {
  toast("Creating your reimbursement claim PDF. Please wait...", {
    type: TYPE.INFO,
  });

  axios
    .get(`${import.meta.env.VITE_API_URL}/api/retrieveAccountInformation`)
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
            timeout: false,
          }
        );
      } else if (totalCoveredFoapaCost < props.claim.totalCost) {
        toast(
          "Warning: The amount of money you are retrieving from your FOAPAs is less than the amount of money you are trying to get reimbursed for. Please double check your FOAPA coverages and make sure they match.",
          {
            type: TYPE.WARNING,
            timeout: false,
          }
        );
      }

      axios
        .get(`${import.meta.env.VITE_API_URL}/api/generatePdf`, {
          params: {
            reimbursementData: props.claim,
            userInfo: response.data,
          },
        })
        .then((res) => {
          console.log(res.data);
          downloadPDF(res.data);
          currentlyCreatingPDF.value = false;
        })
        .catch((err) => {
          toast(
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

async function updateReimbursement() {
  props.claim.totalCost = getAllActivitiesAmount();
  props.claim.reimbursementDate = parseDate(new Date().toISOString());

  console.log(props.claim);
  await axios.post(`${import.meta.env.VITE_API_URL}/api/update-reimbursement`, {
    reimbursementTicket: props.claim,
  });

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
  console.log("Ticket is being saved");
  try {
    if (props.claim.reimbursementName.trim() === "") {
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
