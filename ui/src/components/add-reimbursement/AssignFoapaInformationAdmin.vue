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
            v-model="assignedFoapa"
            class="border-[0.5px] h-11 rounded-md bg-white border-gray-200 w-72 box-border px-5 text-xs border-solid shadow-md"
            required
          >
            <option disabled selected :value="{}">Select FOAPA</option>
            <option :value="foapa" v-for="foapa in userFoapas">
              {{ formatFoapaDeails(foapa) }} - {{ foapa.foapaName }}
            </option>
            <option value="Add a New FOAPA">Add a New FOAPA</option>
          </select>
        </span>
        <span>
          <h4 class="font-normal text-sm">Quantity to use from FOAPA</h4>
          <span class="absolute pl-[0.75rem] pt-[10px] opacity-50">$</span>
          <input
            type="text"
            name="quantity-assigned"
            placeholder="Desired Amount"
            v-model="assignedFoapaCost"
            class="border-[0.5px] h-11 rounded-md border-gray-200 w-72 box-border px-5 text-xs border-solid shadow-md"
            required
            style="padding-left: 2rem"
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
      </div>
    </form>
    <p class="text-sm mt-5 leading-7 font-medium text-gray-600">
      If you don't know the appropriate FOAPA to use, please contact Jim Adair
      (adairja@udmercy.edu)
    </p>

    <!-- ALL FOAPA SECTION -->
    <div class="flex gap-x-28 flex-wrap">
      <div class="w-[370px]">
        <h4 class="underline mb-5 font-semibold text-lg text-gray-800">
          All FOAPA
        </h4>
        <div
          class="overflow-auto flex flex-col gap-10 flex-wrap custom-scroll-bar max-w-[1075px] w-auto"
        >
          <div v-if="props.claim.activities.length === 0">
            <h5 class="mt-0 font-medium text-gray-500">
              Added FOAPA numbers will be listed below:
            </h5>
          </div>
        </div>
        <div class="flex gap-3 flex-col max-h-80 overflow-auto">
          <!-- Wait till the user's foapa have been loaded in, so that this component
         can use that to match foapa names, etc -->
          <foapa-container
            v-for="foapa in props.claim.foapaDetails"
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
            @foapa-added="closeFoapaPopup"
          ></manage-foapa-details>
        </div>
      </div>
    </section>

    <!-- Moving forward/backward -->
    <div class="flex gap-8 items-center">
      <button
        type="button"
        @click="moveToPreviousSection"
        class="bg-udmercy-blue mt-6 text-white border-none w-40 h-11 rounded-full cursor-pointer text-xs flex justify-center items-center gap-3"
      >
        <img src="../../assets/next-arrow.png" class="w-3 rotate-180" />
        Previous Section
      </button>
      <button
        type="button"
        @click="moveToNextSection"
        class="mt-6 bg-udmercy-blue text-white border-none w-40 h-11 rounded-full cursor-pointer text-xs flex justify-center items-center gap-5"
      >
        Next Section
        <img src="../../assets/next-arrow.png" class="w-3" />
      </button>
    </div>
  </section>
</template>

<script lang="ts" setup>
import axios from "axios";
import CancelIcon from "../../assets/cross-icon.svg";
import FoapaContainer from "./FoapaContainer.vue";
import { ref, onMounted, watch } from "vue";
import ManageFoapaDetails from "../manage-foapa/AddFoapaPopup.vue";
import { ReimbursementTicket, FoapaStuff } from "../../types/types";
import BalanceContainer from "./BalanceContainer.vue";
import { TYPE, useToast } from "vue-toastification";
import { computed } from "@vue/reactivity";
import { formatFoapaDeails } from "../../utils/formatFoapaDetails";
type FoapaDetails = FoapaStuff & { _id: string };

let props = defineProps<{
  claim: ReimbursementTicket;
}>();

let assignedFoapa = ref<any>({});
let assignedFoapaCost = ref<string>("");

let userFoapas = ref<FoapaDetails[]>([]);
let foapaDetailsToAdd = ref<FoapaStuff[]>([]);
let foapaPopupIsVisible = ref<boolean>(false);
let triggerAssignedFoapaEditMode = ref<boolean>(false);

const emits = defineEmits(["move-to-next-section", "move-to-previous-section"]);

const toast = useToast();

watch(
  () => assignedFoapa.value,
  (newVal, oldVal) => {
    if (newVal == "Add a New FOAPA") showFoapaPopup();
  }
);

function moveToPreviousSection() {
  emits("move-to-previous-section");
}

function showFoapaPopup() {
  foapaPopupIsVisible.value = true;
  window.scrollTo(0, 0);

  //@ts-ignore
  document.querySelector("body").style.overflow = "hidden";
}

function closeFoapaPopup(foapa) {
  foapaPopupIsVisible.value = false;
  assignedFoapa.value = foapa;
  assignedFoapaCost.value = "";

  userFoapas.value.push(foapa);
  // retrieveFoapaDetails();

  //@ts-ignore
  document.querySelector("body").style.overflow = "auto";
}

function editFOAPA(foapa_to_edit_id) {
  console.log(foapa_to_edit_id);
  triggerAssignedFoapaEditMode.value = true;

  props.claim.foapaDetails.forEach((foapa: any) => {
    if (foapa._id === foapa_to_edit_id) {
      console.log(foapa);
      assignedFoapa.value =
        userFoapas.value.find((f) => f._id === foapa._id) || foapa;
      console.log(assignedFoapa.value);
      assignedFoapaCost.value = foapa.cost;
    }
  });

  deleteFOAPA(foapa_to_edit_id);
}

function moveToNextSection() {
  console.log(assignedFoapa.value.cost);
  if (assignedFoapaCost.value !== "0" && assignedFoapaCost.value !== "") {
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
  const cost_value = assignedFoapaCost.value;

  const isValidNumber = /^[0-9]*\.?[0-9]+$/.test(String(cost_value));

  // Validate the type of the cost field
  if (!isValidNumber) {
    toast.clear();
    toast("Error: Assigned quantity must be a number", {
      type: TYPE.ERROR,
    });
    return;
  }

  if (String(cost_value) === "0") {
    toast.clear();
    toast("Error: Assigned quantity must be higher than $0", {
      type: TYPE.ERROR,
    });
    return;
  }

  let total_expense_cost = props.claim.activities.reduce((prev, curr) => {
    return prev + Number(curr.cost) * 100;
  }, 0);

  let total_foapa_cost = props.claim.foapaDetails.reduce((prev, curr) => {
    return prev + Number(curr.cost) * 100;
  }, 0);

  total_expense_cost = total_expense_cost / 100;
  total_foapa_cost = total_foapa_cost / 100;

  if (total_foapa_cost + Number(assignedFoapaCost.value) > total_expense_cost) {
    toast.clear();

    toast(
      "You cannot assign more money than this reimbursement request requires.",
      {
        type: TYPE.ERROR,
      }
    );
    return;
  }

  assignedFoapa.value.cost = cost_value;

  // Check if FOAPA was already added
  let foapaWasAlreadyAdded = false;
  for (let i = 0; i < props.claim.foapaDetails.length; i++) {
    // If a FOAPA was fonud, add the cost in the quantity field to that existing FOAPA
    if (props.claim.foapaDetails[i]._id === assignedFoapa.value._id) {
      let currentFoapaCost = Number(props.claim.foapaDetails[i].cost) * 100;
      let newFoapaCost = Number(assignedFoapaCost.value) * 100;

      let totalPrice = currentFoapaCost + newFoapaCost;

      props.claim.foapaDetails[i].cost = String(totalPrice / 100);

      foapaWasAlreadyAdded = true;
      break;
    }
  }

  if (foapaWasAlreadyAdded == false) {
    props.claim.foapaDetails.push(
      JSON.parse(JSON.stringify(assignedFoapa.value))
    );
  }

  assignedFoapa.value = {};

  assignedFoapaCost.value =
    calculateBalance.value > 0 ? "" + calculateBalance.value : "0";

  if (triggerAssignedFoapaEditMode.value) {
    triggerAssignedFoapaEditMode.value = false;
  }
}

function retrieveFoapaDetails() {
  userFoapas.value = [...props.claim.foapaDetails] as any;
}

const calculateTotalExpenseCost = computed(() => {
  let total = 0;
  props.claim.activities.forEach((actv) => {
    total += actv.cost * 100;
  });

  return total / 100;
});

// Adding the cost in terms of cents rather than decimals to prevent js calculation errors
const calculateTotalFoapaCost = computed(() => {
  let total = 0;
  props.claim.foapaDetails.forEach((actv) => {
    total += Number(actv.cost) * 100;
  });
  return total / 100;
});

const calculateBalance = computed(() => {
  let exp_cost = calculateTotalExpenseCost.value * 100;
  let foapa_cost = calculateTotalFoapaCost.value * 100;

  let diff = exp_cost - foapa_cost;

  return diff / 100;
});

onMounted(() => {
  console.log(props.claim.foapaDetails);
  assignedFoapaCost.value =
    calculateBalance.value > 0 ? "" + calculateBalance.value : "0";
  retrieveFoapaDetails();
});

function deleteFOAPA(id: string) {
  props.claim.foapaDetails = props.claim.foapaDetails.filter(
    (foapa) => foapa._id !== id
  );

  if (triggerAssignedFoapaEditMode.value === false) {
    assignedFoapa.value.cost =
      calculateBalance.value > 0 ? "" + calculateBalance.value : "0";
  }
}
</script>
