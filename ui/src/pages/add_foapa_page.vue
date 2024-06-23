<template>
  <section class="px-20 pt-10">
    <div class="flex items-center gap-4 cursor-pointer" @click="returnToDashboard">
      <img src="../assets/left-arrow.png" alt="Left arrow" class="w-4">
      <h4 class="font-normal text-sm text-gray-600">Return to dashboard</h4>
    </div>
    <section class="flex gap-28 mt-20 xl:mt-28">
      <section>
        <h3 class="font-semibold text-3xl">Manage FOAPA Details</h3>
        <h4 class="font-semibold text-lg mb-5">Add FOAPA Details</h4>
        <h4 class="font-normal cursor-pointer underline text-sm mt-0 text-gray-700">Need help? Click here to learn more
          about FOAPA
          and how to use them.</h4>
        <Form @submit="addFoapa">
          <div class="mt-7 flex flex-wrap gap-8">
            <div class="flex flex-col gap-y-3">
              <label for="foapaName" class="text-sm">FOAPA Name*</label>
              <Field name="foapaName" placeholder="Name" :rules="isValidFoapaName"
                class="text-xs border-box px-4 rounded-md border border-gray-100 shadow-md h-9 border-solid w-40">
              </Field>
              <ErrorMessage name="foapaName" class="text-red-400 text-xs"></ErrorMessage>
            </div>
            <div class="flex flex-col gap-y-3">
              <label for="description" class="text-sm">FOAPA Description</label>
              <Field name="description" placeholder="Description"
                class="text-xs border-box px-4 rounded-md border border-gray-100 shadow-md h-9 border-solid w-40">
              </Field>
              <ErrorMessage name="description" class="text-red-400 text-xs"></ErrorMessage>
            </div>
            <div class="flex flex-col gap-y-3">
              <label for="initialAmount" class="text-sm">Initial/Current Amount</label>
              <Field name="initialAmount" placeholder="Enter Initial Amount" :rules="isValidFoapaAmount"
                class="text-xs border-box px-4 rounded-md border border-gray-100 shadow-md h-9 border-solid w-40">
              </Field>
              <ErrorMessage name="initialAmount" class="text-red-400 text-xs"></ErrorMessage>
            </div>
          </div>

          <!-- SECOND ROW -->

          <div class="mt-8 flex flex-wrap gap-8">
            <div class="flex flex-col gap-y-3">
              <label for="fund" class="text-sm">FUND*</label>
              <Field name="fund" placeholder="Enter FUND" :rules="isValidFundNumber"
                class="text-xs border-box px-4 rounded-md border border-gray-100 shadow-md h-9 border-solid w-28">
              </Field>
              <ErrorMessage name="fund" class="text-red-400 text-xs"></ErrorMessage>
            </div>
            <div class="flex flex-col gap-y-3">
              <label for="organization" class="text-sm">ORGANIZATION (ORG)</label>
              <Field name="organization" placeholder="Enter ORG" :rules="isValidFoapaNumber"
                class="text-xs border-box px-4 rounded-md border border-gray-100 shadow-md h-9 border-solid w-28">
              </Field>
              <ErrorMessage name="organization" class="text-red-400 text-xs"></ErrorMessage>
            </div>
            <div class="flex flex-col gap-y-3">
              <label for="account" class="text-sm">ACCOUNT (ACCT)*</label>
              <Field name="account" placeholder="Enter ACCT" :rules="isValidAccountNumber"
                class="text-xs border-box px-4 rounded-md border border-gray-100 shadow-md h-9 border-solid w-28">
              </Field>
              <ErrorMessage name="account" class="text-red-400 text-xs"></ErrorMessage>
            </div>
            <div class="flex flex-col gap-y-3">
              <label for="program" class="text-sm">PROGRAM (PROG)*</label>
              <Field name="program" placeholder="Enter PROG" :rules="isValidProgramNumber"
                class="text-xs border-box px-4 rounded-md border border-gray-100 shadow-md h-9 border-solid w-28">
              </Field>
              <ErrorMessage name="program" class="text-red-400 text-xs"></ErrorMessage>
            </div>
            <div class="flex flex-col gap-y-3">
              <label for="activity" class="text-sm">ACTIVITY (ACTV)</label>
              <Field name="activity" placeholder="Enter ACTV" :rules="isValidActvNumber"
                class="text-xs border-box px-4 rounded-md border border-gray-100 shadow-md h-9 border-solid w-28">
              </Field>
              <ErrorMessage name="activity" class="text-red-400 text-xs"></ErrorMessage>
            </div>
          </div>
          <button type="submit"
            class=" bg-udmercy-blue mt-10 text-white border-none w-40 h-11 rounded-full cursor-pointer text-xs">Add
            FOAPA
          </button>
        </Form>
      </section>
      <section>
        <h3 class="font-semibold text-3xl">Your FOAPA Details</h3>
        <h4 class="font-medium text-sm">Note: This section is scrollable for better visibility.
        </h4>
        <!-- FOAPA DETAILS -->
        <div class="flex flex-col gap-7 max-h-[28rem] overflow-auto overflow-y-scroll">
          <div class="border shadow-sm rounded w-[30rem] box-border px-7 py-6 border-gray-200 border-solid h-auto"
            v-for="foapa in foapaDetails">
            <h3 class="font-semibold text-base mt-0">{{ foapa.foapaName }}: {{ formatUserFoapa(foapa) }}</h3>
            <h4 class="text-sm font-normal mb-0 leading-7 max-h-28 overflow-hidden text-ellipsis whitespace-nowrap">{{
              foapa.description || "You have not added a description for this FOAPA" }}</h4>
            <h4 class="text-[13px] font-normal mt-3" v-if="foapa.initialAmount">Current amount: ${{ foapa.initialAmount
              }}
            </h4>
            <div class="flex gap-5 items-center mt-4">
              <img :src="EditIcon" alt="Edit icon" class="w-5 cursor-pointer">
              <img :src="DeleteIcon" alt="Trash icon" class="w-4 cursor-pointer"
                @click="deleteFoapa(foapa.foapaName, foapa.fund)">
              <span class="flex items-center gap-3 ">
                <!-- <img :src="ViewIcon" alt="View icon" class="w-5 cursor-pointer"> -->
                <h4 class="text-xs m-0 font-normal cursor underline cursor-pointer">Click to view more information</h4>
              </span>
            </div>
          </div>
        </div>
      </section>
    </section>

    <ConfirmationPopup :continue-function="returnToDashboard" :cancel-function="stayOnPage"
      v-show="show_leave_dialogue">
      <template #message>
        You have some unsaved changes (You have modified some
        FOAPA values without saving them). To go back and save these
        changes, click 'Cancel'. To discard these changes, click 'Continue'.
      </template>
    </ConfirmationPopup>
  </section>
</template>

<script lang="ts" setup>
import ConfirmationPopup from "../components/utilities/ConfirmationPopup.vue";
import { Form, Field, ErrorMessage } from "vee-validate";
import axios from "axios";
import EditIcon from "../assets/blue-pencil.png"
import DeleteIcon from "../assets/red-delete-icon.png"
import ViewIcon from "../assets/gray-eye-icon.png"
import { ref, onMounted, reactive } from "vue";
import { FoapaStuff } from "../types/types";
import { onBeforeRouteLeave, useRouter } from "vue-router";
import { TYPE, useToast } from "vue-toastification";
import { isValidAccountNumber, isValidActvNumber, isValidFoapaAmount, isValidFoapaName, isValidFoapaNumber, isValidFundNumber, isValidProgramNumber } from "../utils/validators";

const router = useRouter();
let foapaDetails = ref<FoapaStuff[]>([]);
let changes_were_made = ref<boolean>(false)
let show_leave_dialogue = ref<boolean>(false)

const toast = useToast()


async function addFoapa(values, { resetForm }) {
  try {

    toast("Adding FOAPA", {
      type: TYPE.INFO
    })

    changes_were_made.value = true
    values.currentAmount = values.initialAmount
    console.log(values)

    let res = await axios
      .post(
        `${import.meta.env.VITE_API_URL}/api/add-foapa-details`,
        {
          foapaDetails: values,
        }
      )

    resetForm();
    await retrieveUserFoapaDetails()

    toast("FOAPA details were added successfully", {
      type: TYPE.SUCCESS
    })
  } catch (err) {
    toast("An unexpected error has occured", {
      type: TYPE.ERROR
    })
  }
}

function formatUserFoapa(foapa: FoapaStuff) {
  return `${foapa.fund}-${foapa.organization || "XXXX"}-${foapa.account}-${foapa.program || "XXXX"
    }-${foapa.activity || "XXXX"}`;
}

function changesWereMade() {
  changes_were_made.value = true
}

function deleteFoapa(foapaName, fund, show_confirm_dialog = true) {
  if (show_confirm_dialog) {
    const confirm_deletion = confirm("Are you sure you want to delete this FOAPA. Click 'yes' to confirm")

    if (confirm_deletion) {
      let index = foapaDetails.value.findIndex(
        (foapa) => foapa.foapaName === foapaName && foapa.fund === fund
      );

      if (index > -1) {
        foapaDetails.value.splice(index, 1);
      }

      axios
        .post(
          `${import.meta.env.VITE_API_URL}/api/update-foapa-details`,
          {
            foapaDetails: foapaDetails.value,
          }
        )

      toast("FOAPA deleted successfully", {
        type: TYPE.SUCCESS
      })
    }
  }
  else {
    let index = foapaDetails.value.findIndex(
      (foapa) => foapa.foapaName === foapaName && foapa.fund === fund
    );

    if (index > -1) {
      foapaDetails.value.splice(index, 1);
    }
    toast("FOAPA deleted successfully", {
      type: TYPE.SUCCESS
    })
  }

  changes_were_made.value = true
}

async function retrieveUserFoapaDetails() {
  try {
    const res = await axios
      .get(
        `${import.meta.env.VITE_API_URL}/api/retrieve-foapa-details`
      )

    foapaDetails.value = res.data;

  } catch (err: any) {
    toast(err?.response?.data?.message || "There was an error fetching your FOAPA details. Please try again later", {
      type: TYPE.ERROR
    })
  }
}

function saveFOAPA() {
  toast("Saving FOAPA information...", {
    type: TYPE.INFO
  })

  axios
    .post(
      `${import.meta.env.VITE_API_URL}/api/update-foapa-details`,
      {
        foapaDetails: foapaDetails.value,
      }
    )
    .then(() => {
      changes_were_made.value = false
      toast("Successfully saved FOAPA information", {
        type: TYPE.SUCCESS
      })
      retrieveUserFoapaDetails()
    })
    .catch((err) => {
      toast(err?.response?.data?.message || "An unexpected error occured when saving your FOAPA details. Please try again later", {
        type: TYPE.ERROR
      })
    });
}

onBeforeRouteLeave((to, from, next) => {
  if (changes_were_made.value === true) {
    show_leave_dialogue.value = true;
    next(false)
  } else {
    next()
  }
})

function returnToDashboard() {
  // changes_were_made.value = false
  router.push("/dashboard")
}

function stayOnPage() {
  show_leave_dialogue.value = false
}

onMounted(() => {
  retrieveUserFoapaDetails();
});
</script>

<style scoped>
@import url("../assets/styles/add-foapa-page.css");
</style>
