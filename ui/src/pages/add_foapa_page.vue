<template>
  <section class="px-20 pt-10">
    <div class="flex items-center gap-4 cursor-pointer" @click="returnToDashboard">
      <img src="../assets/left-arrow.png" alt="Left arrow" class="w-4">
      <h4 class="font-normal text-sm text-gray-600">Return to dashboard</h4>
    </div>
    <section class="flex gap-28">
      <section>
        <h3 class="mt-28 font-semibold text-3xl">Manage FOAPA Details</h3>
        <h4 class="font-semibold text-lg mb-5">Add FOAPA Details</h4>
        <h4 class="font-normal cursor-pointer underline text-sm mt-0 text-gray-700">Need help? Click here to learn more
          about FOAPA
          and how to use them.</h4>
        <Form @submit="addFoapa">
          <div class="mt-7 flex flex-wrap gap-8">
            <div class="flex flex-col gap-y-3">
              <label for="foapa-name" class="text-sm">FOAPA Name</label>
              <Field name="foapa-name" placeholder="Name"
                class="text-xs border-box px-4 rounded-md border border-gray-100 shadow-md h-9 border-solid w-40">
              </Field>
              <ErrorMessage name="foapa-name" class="text-red-400 text-xs"></ErrorMessage>
            </div>
            <div class="flex flex-col gap-y-3">
              <label for="foapa-description" class="text-sm">FOAPA Description</label>
              <Field name="foapa-description" placeholder="Description"
                class="text-xs border-box px-4 rounded-md border border-gray-100 shadow-md h-9 border-solid w-40">
              </Field>
              <ErrorMessage name="foapa-description" class="text-red-400 text-xs"></ErrorMessage>
            </div>
            <div class="flex flex-col gap-y-3">
              <label for="initial-amount" class="text-sm">Initial/Current Amount</label>
              <Field name="initial-amount" placeholder="Enter Initial Amount"
                class="text-xs border-box px-4 rounded-md border border-gray-100 shadow-md h-9 border-solid w-40">
              </Field>
              <ErrorMessage name="initial-amount" class="text-red-400 text-xs"></ErrorMessage>
            </div>
          </div>

          <!-- SECOND ROW -->

          <div class="mt-8 flex flex-wrap gap-8">
            <div class="flex flex-col gap-y-3">
              <label for="fund" class="text-sm">FUND</label>
              <Field name="fund" placeholder="Enter FUND"
                class="text-xs border-box px-4 rounded-md border border-gray-100 shadow-md h-9 border-solid w-28">
              </Field>
              <ErrorMessage name="fund" class="text-red-400 text-xs"></ErrorMessage>
            </div>
            <div class="flex flex-col gap-y-3">
              <label for="organization" class="text-sm">ORGANIZATION (ORG)</label>
              <Field name="organization" placeholder="Enter ORG"
                class="text-xs border-box px-4 rounded-md border border-gray-100 shadow-md h-9 border-solid w-28">
              </Field>
              <ErrorMessage name="organization" class="text-red-400 text-xs"></ErrorMessage>
            </div>
            <div class="flex flex-col gap-y-3">
              <label for="account" class="text-sm">ACCOUNT (ACCT)</label>
              <Field name="account" placeholder="Enter ACCT"
                class="text-xs border-box px-4 rounded-md border border-gray-100 shadow-md h-9 border-solid w-28">
              </Field>
              <ErrorMessage name="account" class="text-red-400 text-xs"></ErrorMessage>
            </div>
            <div class="flex flex-col gap-y-3">
              <label for="program" class="text-sm">PROGRAM (PROG)</label>
              <Field name="program" placeholder="Enter PROG"
                class="text-xs border-box px-4 rounded-md border border-gray-100 shadow-md h-9 border-solid w-28">
              </Field>
              <ErrorMessage name="program" class="text-red-400 text-xs"></ErrorMessage>
            </div>
            <div class="flex flex-col gap-y-3">
              <label for="activity" class="text-sm">ACTIVITY (ACTV)</label>
              <Field name="activity" placeholder="Enter ACTV"
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
        <h3 class="mt-28 font-semibold text-3xl">Your FOAPA Details</h3>
        <div class="border shadow-sm w-[30rem] box-border px-7 py-6 border-gray-200 border-solid h-auto">
          <h3 class="font-semibold text-base mt-0">UDMP: 3293-2323-XXXXXX-3232</h3>
          <h4 class="text-sm font-normal">This is a description</h4>
          <h4 class="text-sm font-normal">Current amount: $5000</h4>
          <div class="flex gap-5 items-center">
            <img :src="EditIcon" alt="Edit icon" class="w-5 cursor-pointer">
            <img :src="DeleteIcon" alt="Trash icon" class="w-4 cursor-pointer">
            <span class="flex items-center gap-3 hover:underline">
              <!-- <img :src="ViewIcon" alt="View icon" class="w-5 cursor-pointer"> -->
              <h4 class="text-xs m-0 font-normal cursor-pointer">View more information</h4>
            </span>
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
import { ref, onMounted } from "vue";
import { FoapaStuff } from "../types/types";
import { onBeforeRouteLeave, useRouter } from "vue-router";
import { TYPE, useToast } from "vue-toastification";
import { isValidFoapaName } from "../utils/validators";

const router = useRouter();
let foapaDetails = ref<FoapaStuff[]>([]);
let changes_were_made = ref<boolean>(false)
let show_leave_dialogue = ref<boolean>(false)

const toast = useToast()

function addFoapa() {

}

function changesWereMade() {
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
  changes_were_made.value = false
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
