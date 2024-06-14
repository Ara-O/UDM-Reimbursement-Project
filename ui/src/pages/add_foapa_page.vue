<template>
  <section class="add-foapa-page">
    <img src="../assets/detroit-mercy-logo.png" class="udmercy-logo" @click="$router.push('/dashboard')"
      alt="Detroit mercy logo" />
    <div class="manage-foapa-div">
      <h3 class="manage-foapa-text">Manage FOAPA</h3>
      <ManageFoapaDetails :foapa-details="foapaDetails" @changes-were-made="changesWereMade" />
      <div class="add-foapa-button-wrapper">
        <button class="add-foapa-button" style="width: auto; padding: 0px 30px" @click="$router.push('/dashboard')">
          Go to Dashboard
        </button>
        <button class="add-foapa-button" @click="saveFOAPA">
          Save FOAPAs
        </button>
      </div>
    </div>
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
import ManageFoapaDetails from "../components/manage-foapa/ManageFoapaDetails.vue";
import axios from "axios";
import { ref, onMounted } from "vue";
import { FoapaStuff } from "../types/types";
import { onBeforeRouteLeave, useRouter } from "vue-router";
import { TYPE, useToast } from "vue-toastification";

const router = useRouter();
let foapaDetails = ref<FoapaStuff[]>([]);
let changes_were_made = ref<boolean>(false)
let show_leave_dialogue = ref<boolean>(false)


const toast = useToast()

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
