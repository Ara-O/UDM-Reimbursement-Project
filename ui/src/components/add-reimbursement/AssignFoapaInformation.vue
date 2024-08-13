<template>
  <section
    class="xl:w-auto mx-10 sm:mx-20 xl:ml-0 h-full sm:mt-0 mb-32 sm:mb-0"
  >
    <span class="flex items-center gap-6 mb-2 mt-42 md:mt-0">
      <h2 class="font-semibold my-0 text-[27px]">Assign FOAPA Information</h2>
      <img
        src="../../assets/edit-icon.png"
        alt="Edit icon"
        class="w-7 hidden md:block"
      />
    </span>

    <form @submit.prevent="addFoapa">
      <div class="flex gap-x-14 flex-wrap">
        <span>
          <h4 class="font-normal text-sm">Select FOAPA</h4>
          <select
            name="foapa"
            id="foapa"
            v-model="assignedFoapa.foapa_id"
            class="border-[0.5px] h-11 rounded-md bg-white border-gray-200 w-72 box-border px-5 text-xs border-solid shadow-md"
            required
          >
            <!-- <option disabled selected value="">Select FOAPA</option> -->
            <option :value="foapa._id" v-for="foapa in filteredUserFoapas">
              {{ foapa.foapaName }} - {{ formatUserFoapa(foapa) }}
            </option>
            <option value="Add a New FOAPA">Add a New FOAPA</option>
            <option value="Don't Know FOAPA">Don't Know FOAPA</option>
          </select>
        </span>
        <span>
          <h4 class="font-normal text-sm">Quantity to use from FOAPA</h4>
          <input
            type="text"
            name="quantity-assigned"
            placeholder="Desired Amount"
            v-model="assignedFoapa.cost"
            class="border-[0.5px] h-11 rounded-md border-gray-200 w-72 box-border px-5 text-xs border-solid shadow-md"
            required
          />
        </span>
      </div>

      <div class="flex gap-5 mt-8">
        <button
          type="submit"
          class="bg-udmercy-blue text-white border-none w-40 h-11 rounded-full cursor-pointer text-xs"
        >
          {{ triggerAssignedFoapaEditMode ? "Edit FOAPA" : "Assign FOAPA" }}
        </button>
        <button
          type="button"
          @click="moveToNextSection"
          class="bg-udmercy-blue text-white border-none w-40 h-11 rounded-full cursor-pointer text-xs"
        >
          Next Section
        </button>
      </div>
      <button
        type="button"
        @click="moveToPreviousSection"
        class="bg-udmercy-blue mt-6 xl:hidden text-white border-none w-40 h-11 rounded-full cursor-pointer text-xs"
      >
        Previous Section
      </button>
    </form>

    <!-- ALL FOAPA SECTION -->
    <div class="flex gap-x-28 flex-wrap">
      <div class="w-[330px]">
        <h4 class="underline mb-5 font-semibold text-lg text-gray-800">
          All FOAPA
        </h4>
        <div
          class="overflow-auto flex flex-col gap-10 flex-wrap custom-scroll-bar max-w-[1075px] w-auto"
        >
          <div v-if="props.claim.activities.length === 0">
            <h5 class="mt-0 font-medium text-gray-500">
              Added FOAPA numbers will be listed
            </h5>
          </div>
        </div>
        <div
          class="flex gap-3 flex-col max-h-80 overflow-auto"
          v-if="userFoapas.length !== 0"
        >
          <!-- Wait till the user's foapa have been loaded in, so that this component
         can use that to match foapa names, etc -->
          <foapa-container
            v-for="foapa in props.claim.foapaDetails"
            :filtered-user-foapas="userFoapas"
            :foapa="foapa"
            @delete-foapa="deleteFOAPA"
            @edit-foapa="editFOAPA"
          >
          </foapa-container>
        </div>
      </div>
      <!-- BALANCE SECTION -->
      <div class="mb-0">
        <h4 class="underline font-semibold mb-0 text-lg text-gray-800">
          Balance
        </h4>
        <div
          class="overflow-auto flex flex-col gap-10 flex-wrap custom-scroll-bar max-w-[1075px] w-auto"
        >
          <div class="flex gap-3 flex-col max-h-80 overflow-auto">
            <balance-container :claim="props.claim"> </balance-container>
          </div>
        </div>
      </div>
    </div>

    <!-- FOAPA POPUP -->
    <section v-if="foapaPopupIsVisible">
      <div
        class="absolute bg-black bg-opacity-50 h-full xl:h-screen top-0 left-0 w-screen items-center flex justify-center"
      >
        <div class="bg-white px-10 h-96 overflow-auto rounded-md pt-3 pb-11">
          <div class="flex justify-between items-center">
            <h3 class="mb-5 font-semibold">Add FOAPA here</h3>
            <img
              :src="CancelIcon"
              alt="Cancel icon"
              class="w-3.5 opacity-75 hover:opacity-100 cursor-pointer"
              @click="closeFoapaPopup"
            />
          </div>
          <manage-foapa-details
            :foapa-details="foapaDetailsToAdd"
          ></manage-foapa-details>
          <button
            @click="saveFoapas"
            class="bg-udmercy-blue mt-7 text-white border-none w-40 h-11 rounded-full cursor-pointer text-xs"
          >
            Save FOAPAs
          </button>
        </div>
      </div>
    </section>
  </section>
</template>

<script lang="ts" setup>
import axios from "axios";
import CancelIcon from "../../assets/cross-icon.svg";
import FoapaContainer from "./FoapaContainer.vue";
import { ref, onMounted, watch } from "vue";
import ManageFoapaDetails from "../manage-foapa/ManageFoapaDetails.vue";
import {
  ReimbursementTicket,
  FoapaStuff,
  FoapaInputWithID,
} from "../../types/types";
import BalanceContainer from "./BalanceContainer.vue";
import { TYPE, useToast } from "vue-toastification";
import { computed } from "@vue/reactivity";
let props = defineProps<{
  claim: ReimbursementTicket;
}>();

let assignedFoapa = ref<FoapaInputWithID>({
  cost: "",
  foapa_id: "",
});

type FoapaDetails = FoapaStuff & { _id: string };
let userFoapas = ref<FoapaDetails[]>([]);
let foapaDetailsToAdd = ref<FoapaStuff[]>([]);
let foapaPopupIsVisible = ref<boolean>(false);
let triggerAssignedFoapaEditMode = ref<boolean>(false);
let knowFoapa = false;

const emits = defineEmits(["move-to-next-section", "move-to-previous-section"]);
const toast = useToast();

watch(
  () => assignedFoapa.value.foapa_id,
  (newVal, oldVal) => {
    if (newVal == "Add a New FOAPA") showFoapaPopup();

    if (newVal == "Don't Know FOAPA") dontKnowFoapa();
  }
);

function moveToPreviousSection() {
  emits("move-to-previous-section");
}

//Removes a foapa from the list to select foapa from if they already added one
const filteredUserFoapas = computed(() => {
  let foapas: any = [];
  userFoapas.value.forEach((foapa) => {
    let wasFound = false;
    for (let i = 0; i < props.claim.foapaDetails.length; i++) {
      if (foapa._id === props.claim.foapaDetails[i].foapa_id) {
        wasFound = true;
        break;
      }
    }

    if (wasFound === false) {
      foapas.push(foapa);
    }
  });

  return foapas;
});

function showFoapaPopup() {
  foapaPopupIsVisible.value = true;
  window.scrollTo(0, 0);

  //@ts-ignore
  document.querySelector("body").style.overflow = "hidden";
}

function closeFoapaPopup() {
  foapaPopupIsVisible.value = false;
  assignedFoapa.value = {
    cost: "",
    foapa_id: "",
  };
  //@ts-ignore
  document.querySelector("body").style.overflow = "auto";
}

function dontKnowFoapa() {
  props.claim.knowFoapa = false;
}

function editFOAPA(foapa_id) {
  triggerAssignedFoapaEditMode.value = true;
  props.claim.foapaDetails.forEach((foapa) => {
    if (foapa.foapa_id === foapa_id) {
      assignedFoapa.value.foapa_id = foapa_id;
      assignedFoapa.value.cost = foapa.cost;
    }
  });

  deleteFOAPA(foapa_id);
}

function moveToNextSection() {
  if (assignedFoapa.value.foapa_id !== "" || assignedFoapa.value.cost !== "") {
    let moveon = confirm(
      "Warning: You are moving to next section without adding your currently inputted FOAPA. Click 'OK' to discard the inputted FOAPA and move to the next section, or click 'Cancel' to return"
    );
    if (moveon) {
      emits("move-to-next-section");
    }

    return;
  }

  emits("move-to-next-section");
}

function addFoapa() {
  const num = parseFloat(assignedFoapa.value.cost);

  if (isNaN(num) && !isFinite(num)) {
    toast("Error: Assigned quantity must be a number", {
      type: TYPE.ERROR,
    });
    return;
  }

  props.claim.foapaDetails.push(
    JSON.parse(JSON.stringify(assignedFoapa.value))
  );

  assignedFoapa.value = {
    cost: "",
    foapa_id: "",
  };

  if (triggerAssignedFoapaEditMode.value) {
    triggerAssignedFoapaEditMode.value = false;
  }
}

function saveFoapas() {
  toast("Saving FOAPA information...", {
    type: TYPE.INFO,
  });

  axios
    .post(`${import.meta.env.VITE_API_URL}/api/add-foapa-details`, {
      foapaDetails: foapaDetailsToAdd.value,
    })
    .then(() => {
      toast("Successfully saved FOAPA information", {
        type: TYPE.SUCCESS,
      });
      retrieveFoapaDetails();
      foapaDetailsToAdd.value = [];
      foapaPopupIsVisible.value = false;
    })
    .catch((err) => {
      toast(
        err?.response?.data?.message ||
          "An unexpected error occured when saving your FOAPA details. Please try again later",
        {
          type: TYPE.ERROR,
        }
      );
    });
}

function retrieveFoapaDetails() {
  axios
    .get(`${import.meta.env.VITE_API_URL}/api/retrieve-foapa-details`)
    .then((res) => {
      userFoapas.value = res.data;
    })
    .catch((err) => {
      console.log(err);
    });
}

onMounted(() => {
  retrieveFoapaDetails();
});

function formatUserFoapa(foapa: FoapaStuff) {
  return `${foapa.fund}-${foapa.organization || "XXXX"}-${foapa.account}-${
    foapa.program || "XXXX"
  }-${foapa.activity || "XXXX"}`;
}

function deleteFOAPA(id: string) {
  props.claim.foapaDetails = props.claim.foapaDetails.filter(
    (foapa) => foapa.foapa_id !== id
  );
}
</script>
