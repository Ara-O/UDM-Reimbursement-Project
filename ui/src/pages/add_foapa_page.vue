<template>
  <main class="xl:px-32 2xl:h-screen h-auto px-16 flex flex-col justify-center">
    <div class="absolute top-0 hidden top_indicator"></div>
    <div
      class="flex items-center absolute top-0 gap-4 pt-10 return_to_dashboard cursor-pointer"
      @click="returnToDashboard"
    >
      <img src="../assets/left-arrow.png" alt="Left arrow" class="w-4" />
      <h4 class="font-normal text-sm text-gray-600 hover:underline">
        Return to dashboard
      </h4>
    </div>
    <section
      class="flex flex-wrap lg:flex-nowrap items-center justify-start gap-y-32 w-full gap-x-28 mb-20 mt-20 xl:mt-20"
    >
      <section>
        <h3 class="font-semibold text-3xl mt-20 leading-10 xl:mt-7">
          Manage FOAPA Details
        </h3>
        <h4 class="font-semibold text-lg mb-5">Add FOAPA Details</h4>
        <h4
          class="font-normal cursor-pointer inline underline leading-7 text-sm mt-0 text-gray-700"
          @click="showHelpScreen"
        >
          Need help? Click here to learn more about FOAPA and how to use them.
        </h4>
        <Form @submit="addFoapa" v-slot="{ handleReset }" class="max-w-auto">
          <div class="mt-7 flex flex-wrap gap-8 min-w-0 sm:min-w-[450px]">
            <div class="flex flex-col gap-y-3 relative">
              <label for="foapaName" class="text-sm">FOAPA Name*</label>
              <Field
                name="foapaName"
                placeholder="Name"
                :rules="isValidFoapaName"
                v-model="added_foapa.foapaName"
                :validate-on-input="false"
                class="text-xs border-box px-4 rounded-md border w-full border-gray-100 shadow-md h-9 border-solid sm:w-40"
              >
              </Field>
              <ErrorMessage
                name="foapaName"
                class="text-red-400 bottom-[-24px] absolute text-xs"
              ></ErrorMessage>
            </div>
            <div class="flex flex-col gap-y-3 relative">
              <label for="description" class="text-sm">FOAPA Description</label>
              <Field
                name="description"
                placeholder="Description"
                v-model="added_foapa.description"
                class="text-xs border-box px-4 rounded-md border w-full border-gray-100 shadow-md h-9 border-solid sm:w-40"
              >
              </Field>
              <ErrorMessage
                name="description"
                class="text-red-400 bottom-[-24px] absolute text-xs"
              ></ErrorMessage>
            </div>
            <!-- <div class="flex flex-col gap-y-3 relative">
              <label for="initialAmount" class="text-sm"
                >Initial/Current Amount</label
              >
              <Field
                name="initialAmount"
                placeholder="Enter Initial Amount"
                :rules="isValidFoapaAmount"
                v-model="added_foapa.initialAmount"
                class="text-xs border-box px-4 rounded-md border w-full border-gray-100 shadow-md h-9 border-solid sm:w-40"
              >
              </Field>
              <ErrorMessage
                name="initialAmount"
                class="text-red-400 bottom-[-24px] absolute text-xs"
              ></ErrorMessage>
            </div> -->

            <!-- SECOND ROW -->

            <div class="flex flex-col gap-y-3 relative">
              <label for="fund" class="text-sm">FUND*</label>
              <Field
                name="fund"
                placeholder="Enter FUND"
                :rules="isValidFundNumber"
                v-model="added_foapa.fund"
                class="text-xs border-box px-4 rounded-md border w-full border-gray-100 shadow-md h-9 border-solid sm:w-28"
              >
              </Field>
              <ErrorMessage
                name="fund"
                class="text-red-400 bottom-[-24px] absolute text-xs"
              ></ErrorMessage>
            </div>
            <div class="flex flex-col gap-y-3 relative">
              <label for="organization" class="text-sm"
                >ORGANIZATION (ORG)</label
              >
              <Field
                name="organization"
                placeholder="Enter ORG"
                :rules="isValidFoapaNumber"
                v-model="added_foapa.organization"
                class="text-xs border-box px-4 rounded-md border w-full border-gray-100 shadow-md h-9 border-solid sm:w-28"
              >
              </Field>
              <ErrorMessage
                name="organization"
                class="text-red-400 bottom-[-24px] absolute text-xs"
              ></ErrorMessage>
            </div>
            <div class="flex flex-col gap-y-3 relative">
              <label for="account" class="text-sm">ACCOUNT (ACCT)*</label>
              <Field
                name="account"
                placeholder="Enter ACCT"
                :rules="isValidAccountNumber"
                v-model="added_foapa.account"
                class="text-xs border-box px-4 rounded-md border w-full border-gray-100 shadow-md h-9 border-solid sm:w-28"
              >
              </Field>
              <ErrorMessage
                name="account"
                class="text-red-400 bottom-[-24px] absolute text-xs"
              ></ErrorMessage>
            </div>
            <div class="flex flex-col gap-y-3 relative">
              <label for="program" class="text-sm">PROGRAM (PROG)*</label>
              <Field
                name="program"
                placeholder="Enter PROG"
                :rules="isValidProgramNumber"
                v-model="added_foapa.program"
                class="text-xs border-box px-4 rounded-md border w-full border-gray-100 shadow-md h-9 border-solid sm:w-28"
              >
              </Field>
              <ErrorMessage
                name="program"
                class="text-red-400 bottom-[-24px] absolute text-xs"
              ></ErrorMessage>
            </div>
            <div class="flex flex-col gap-y-3 relative">
              <label for="activity" class="text-sm">ACTIVITY (ACTV)</label>
              <Field
                name="activity"
                placeholder="Enter ACTV"
                :rules="isValidActvNumber"
                v-model="added_foapa.activity"
                class="text-xs border-box px-4 rounded-md border w-full border-gray-100 shadow-md h-9 border-solid sm:w-28"
              >
              </Field>
              <ErrorMessage
                name="activity"
                class="text-red-400 bottom-[-24px] absolute text-xs"
              ></ErrorMessage>
            </div>
          </div>
          <button
            type="submit"
            class="bg-udmercy-blue mt-10 text-white border-none w-40 h-11 rounded-full cursor-pointer text-xs"
          >
            {{ state === "Add" ? "Add Foapa" : "Edit Foapa" }}
          </button>
          <button
            type="button"
            v-if="state === 'Edit'"
            @click="discardEdits(handleReset)"
            class="bg-udmercy-red mt-10 ml-5 text-white border-none w-40 h-11 rounded-full cursor-pointer text-xs"
          >
            Discard Edits
          </button>
          <h3 class="text-sm font-normal mt-6 leading-7">
            Note: If you don't know your PROG or ACCT number, Enter XXXX as a
            placeholder.
          </h3>
        </Form>
      </section>

      <!-- 
      -- RIGHT SECTION --
      -->
      <section class="sm:min-w-[450px]">
        <h3 class="font-semibold text-3xl">Your FOAPA Details</h3>
        <h4 class="font-medium text-sm max-w-md leading-8">
          Note: This section is scrollable for better visibility. Click a
          FOAPA's title for more information
        </h4>

        <!-- FOAPA DETAILS -->
        <div class="flex items-center gap-4">
          <input
            type="text"
            v-model="search_value"
            placeholder="Search by FOAPA name"
            class="border rounded-md box-border px-4 border-gray-200 border-solid w-auto md:w-full h-10"
          />
          <!-- <div class="border border-solid">
            <h3>View as list</h3>
          </div> -->
          <!-- <img :src="SortIcon" alt="Sort icon" class="w-5 cursor-pointer" /> -->
        </div>
        <div class="flex gap-3">
          <span
            class="hover:border-gray-400 w-auto py-0 h-10 text-gray-500 hover:text-gray-600 transition-all duration-150 border mt-5 rounded-full cursor-pointer border-solid flex items-center px-2 border-gray-200"
            @click="filterValues = 'Date(ASC)'"
            :class="
              filterValues === 'Date(ASC)'
                ? 'border-gray-400 text-gray-600'
                : ''
            "
          >
            <h4
              class="my-1 px-3 leading-7 h-auto font-normal text-xs m-auto text-inherit"
            >
              Sort by date (ASC)
            </h4>
          </span>
          <span
            class="hover:border-gray-400 w-auto py-0 h-10 text-gray-500 hover:text-gray-600 transition-all duration-150 border mt-5 rounded-full cursor-pointer border-solid flex items-center px-2 border-gray-200"
            @click="filterValues = 'Date(DESC)'"
            :class="
              filterValues === 'Date(DESC)'
                ? 'border-gray-400 text-gray-600'
                : ''
            "
          >
            <h4
              class="my-1 px-3 leading-7 h-auto font-normal text-xs m-auto text-inherit"
            >
              Sort by date added (DESC)
            </h4>
          </span>
        </div>
        <h3
          @click="view === 'Grid' ? (view = 'List') : (view = 'Grid')"
          class="text-sm mb-[-10px] font-normal cursor-pointer hover:underline"
        >
          View as {{ view === "Grid" ? "list" : "grid" }}
        </h3>
        <div
          class="flex flex-col mt-6 gap-7 sm:max-h-[28rem] h-[28rem] overflow-auto overflow-y-scroll sm:max-w-none max-w-[300px]"
        >
          <div
            class="border shadow-sm rounded w-auto box-border px-7 py-6 flex border-gray-200 border-solid h-auto"
            v-for="foapa in filteredFoapaDetails"
            v-if="view === 'List'"
          >
            <h3
              class="font-semibold text-base my-0 cursor-pointer"
              @click="router.push(`foapa-information/${foapa._id}`)"
            >
              {{ foapa.foapaName }}: {{ formatUserFoapa(foapa) }}
            </h3>
            <div class="flex items-center ml-5 gap-2">
              <img
                :src="EditIcon"
                alt="Edit icon"
                class="w-5 cursor-pointer"
                @click="triggerFoapaEditMode(foapa)"
              />
              <img
                :src="DeleteIcon"
                alt="Trash icon"
                class="w-4 cursor-pointer"
                @click="showDeleteFoapaDialogue(foapa._id)"
              />
            </div>
          </div>
          <div
            class="border shadow-sm rounded w-auto box-border px-7 py-6 border-gray-200 border-solid h-auto"
            v-for="foapa in filteredFoapaDetails"
            v-if="view === 'Grid'"
          >
            <h3
              class="font-semibold text-base my-0 cursor-pointer"
              @click="router.push(`foapa-information/${foapa._id}`)"
            >
              {{ foapa.foapaName }}: {{ formatUserFoapa(foapa) }}
            </h3>
            <h4
              :title="foapa.description"
              class="text-sm mt-3 font-normal mb-0 leading-7 max-h-28 overflow-hidden text-ellipsis"
            >
              {{
                foapa.description ||
                "You have not added a description for this FOAPA"
              }}
            </h4>
            <!-- <h4 class="text-[13px] font-normal mt-3" v-if="foapa.initialAmount">
              Current amount: ${{ foapa.currentAmount }} | Available amount: ${{
                foapa.availableAmount
              }}
            </h4> -->
            <div class="flex gap-5 items-center mt-4">
              <img
                :src="EditIcon"
                alt="Edit icon"
                class="w-5 cursor-pointer"
                @click="triggerFoapaEditMode(foapa)"
              />
              <img
                :src="DeleteIcon"
                alt="Trash icon"
                class="w-4 cursor-pointer"
                @click="showDeleteFoapaDialogue(foapa._id)"
              />
              <span class="flex items-center gap-3">
                <h4 class="text-xs my-0 font-normal">
                  Created
                  {{ formatDate(foapa.createdAt) }}
                </h4>
                <!-- <img :src="ViewIcon" alt="View icon" class="w-5 cursor-pointer"> -->
                <!-- <h4 class="text-xs m-0 font-normal cursor underline cursor-pointer">Click to view more information</h4> -->
              </span>
            </div>
          </div>
          <div v-if="loaded && foapaDetails.length === 0">
            <h4 class="font-medium text-sm mt-0">
              You have not added any FOAPAs yet
            </h4>
          </div>
          <div
            v-if="
              loaded &&
              foapaDetails.length !== 0 &&
              filteredFoapaDetails.length === 0
            "
          >
            <h4 class="font-medium text-sm mt-0">
              No results found for {{ search_value }}
            </h4>
          </div>
          <h4 class="font-medium text-sm mt-0" v-if="!loaded">Loading...</h4>
        </div>
      </section>
    </section>

    <ConfirmationPopup
      :continue-function="stayOnPage"
      :cancel-function="discardChanges"
      v-show="show_leave_dialogue"
      left-button-text="Discard Changes"
      right-button-text="Go Back"
    >
      <template #message>
        You have some unsaved changes (You have inputted some FOAPA values
        without adding them). To discard these changes, click 'Discard Changes.'
        To go back and save these changes, click 'Go Back'.
      </template>
    </ConfirmationPopup>

    <ConfirmationPopup
      v-if="show_edit_clashes_dialogue"
      class="clashes_dialogue"
      :cancel-function="removeEditClashPopup"
      :continue-function="continueEditAfterClash"
      left-button-text="Don't Edit"
      right-button-text="Continue"
      title="Warning"
    >
      <template #message>
        Warning: You are about to edit a FOAPA that is being used by the
        following reimbursement claims:
        <p v-for="claim in edit_clashes" class="font-medium">{{ claim }}</p>
        To stop editing, click 'Don't Edit.' To continue editing this FOAPA,
        click 'Continue.' Note: Continuing editing this FOAPA will cause the
        FOAPA values in the above-mentioned reimbursements to change as well.
      </template>
    </ConfirmationPopup>

    <ConfirmationPopup
      v-if="show_delete_foapa_dialogue"
      :cancel-function="removeDeletePopup"
      :continue-function="() => deleteFoapa(foapa_to_delete)"
      left-button-text="Don't Delete"
      right-button-text="Delete"
      title="Caution"
    >
      <template #message>
        Warning: You are about to delete a FOAPA. Are you sure you want to
        delete this?
      </template>
    </ConfirmationPopup>

    <!-- Make not two OK buttons -->
    <ConfirmationPopup
      v-if="show_delete_foapa_clash_dialogue"
      :cancel-function="removeDeletePopup"
      :continue-function="removeDeletePopup"
      left-button-text="HIDE"
      right-button-text="OK"
      title="Error"
    >
      <template #message>
        Error: You are about to delete a FOAPA that is being used by the
        following reimbursement claims:
        <p v-for="claim in delete_clashes" class="font-medium">{{ claim }}</p>
        Please submit these claims before attempting to delete this FOAPA
      </template>
    </ConfirmationPopup>

    <section v-if="show_foapa_help_dialogue">
      <div
        class="absolute z-50 bg-black bg-opacity-50 h-screen top-0 left-0 w-screen items-center flex justify-center"
      >
        <div
          class="bg-white max-w-4xl max-h-[700px] shadow-md border border-solid border-gray-100 h-96 overflow-auto md:h-min px-6 py-9 rounded-md"
        >
          <div class="flex justify-between">
            <h3 class="text-md font-semibold mb-6 mt-0 underline">
              FOAPA Help
            </h3>
            <img
              :src="CancelIcon"
              alt="Cancel icon"
              class="w-4 h-4 my-0 cursor-pointer"
              @click="removeFoapaHelp"
            />
          </div>
          <div class="flex flex-wrap gap-y-10 gap-x-4">
            <span class="flex flex-col gap-3 w-72 justify-between">
              <h4 class="font-medium text-md my-0">F: Fund</h4>
              <h4 class="text-sm font-normal my-0 leading-8">
                Uniquely identifies all sources of funding
              </h4>
              <h4 class="my-0 font-normal text-sm">Example: 139233</h4>
              <h5 class="text-xs font-normal my-0 leading-8">
                Requirements: 6 characters
              </h5>
            </span>
            <span class="flex flex-col gap-3 w-72 justify-between">
              <h4 class="font-medium text-md my-0">O: Organization</h4>
              <h4 class="text-sm font-normal my-0 leading-8">
                Unit of budgetary responsibility, e.g College Office
              </h4>
              <h5 class="text-xs font-normal my-0 leading-8">
                Requirements: 4 numbers
              </h5>
            </span>
            <span class="flex flex-col gap-3 w-72 justify-between">
              <h4 class="font-medium text-md my-0">A: Account</h4>
              <h4 class="text-sm font-normal my-0 leading-8">
                Expenditures, revenues, transfers, assets, liabilities, fund
                balances
              </h4>
              <h5 class="text-xs font-normal my-0 leading-8">
                Requirements: 4 numbers
              </h5>
            </span>
            <span class="flex flex-col gap-3 w-72 justify-between">
              <h4 class="font-medium text-md my-0">P: Program</h4>
              <h4 class="text-sm font-normal my-0 leading-8">
                Function categories, e.g Instruction, Research
              </h4>
              <h5 class="text-xs font-normal my-0 leading-8">
                Requirements: 4 numbers
              </h5>
            </span>
            <span class="flex flex-col gap-3 w-72 justify-between">
              <h4 class="font-medium text-md my-0">A: Activity</h4>
              <h4 class="text-sm font-normal my-0 leading-8">User defined</h4>
              <h5 class="text-xs font-normal my-0 leading-8">Optional</h5>
            </span>
          </div>
          <div>
            <h4 class="font-semibold underline">Default FOAPA Information</h4>
            <h4 class="font-normal text-sm leading-7">
              These FOAPAs are added during account creation. They are the most
              commonly used FOAPAs and have been pre-filled based on your
              department and existing standards. If they don't match with the
              FOAPAs you have used in the past, or are familiar with, you are
              free to edit or delete them.
            </h4>
            <h4 class="font-normal text-sm leading-7">
              <span class="font-medium leading-7"
                >General Department Spending</span
              >
              : Allocated for routine operational expenses within the
              department, covering costs such as supplies, minor equipment, and
              other essential activities that support departmental functions.
            </h4>
            <h4 class="font-normal text-sm leading-7">
              <span class="font-medium leading-7">Faculty Development</span>
              : Funds designated for enhancing faculty skills and professional
              growth, including activities like conferences, workshops, training
              programs, and other opportunities aimed at improving teaching,
              research, and leadership capabilities.
            </h4>
          </div>
          <!-- <div class="mt-10">
            <h4 class="font-semibold underline">Cost Information</h4>
            <h4 class="font-normal text-sm leading-7">
              <span class="font-medium leading-7">Initial amount</span> : This
              is the amount available in the FOAPA at the time of entry. For
              example, if you have $550 in a FOAPA when adding it to this
              system, the initial amount recorded should be $550.
            </h4>
            <h4 class="font-normal text-sm leading-7">
              <span class="font-medium leading-7">Available amount</span> : This
              is the amount available in the FOAPA after the cost of accepted
              reimbursement claim expenses have been subtracted.
            </h4>
            <h4 class="font-normal text-sm leading-7">
              <span class="font-medium">Current amount</span> : This is the
              amount available in the FOAPA after the cost of submitted and
              accepted reimbursement claim expenses have been subtracted.
            </h4>
          </div> -->
        </div>
      </div>
    </section>
  </main>
</template>

<script lang="ts" setup>
import ConfirmationPopup from "../components/utilities/ConfirmationPopup.vue";
import axios from "axios";
import EditIcon from "../assets/blue-pencil.png";
import DeleteIcon from "../assets/red-delete-icon.png";
import CancelIcon from "../assets/cross-icon.svg";
// import SortIcon from "../assets/.png";
import { Form, Field, ErrorMessage } from "vee-validate";
import { ref, onMounted, watch, computed } from "vue";
import { FoapaStuff } from "../types/types";
import { onBeforeRouteLeave, useRouter } from "vue-router";
import { TYPE, useToast } from "vue-toastification";
import {
  isValidAccountNumber,
  isValidActvNumber,
  // isValidFoapaAmount,
  isValidFoapaName,
  isValidFoapaNumber,
  isValidFundNumber,
  isValidProgramNumber,
} from "../utils/validators";

const router = useRouter();
type Foapa = FoapaStuff & { _id?: string };
let foapaDetails = ref<Foapa[]>([]);
let changes_were_made = ref<boolean>(false);
let show_leave_dialogue = ref<boolean>(false);
let show_foapa_help_dialogue = ref<boolean>(false);
let show_edit_clashes_dialogue = ref<boolean>(false);
let show_delete_foapa_dialogue = ref<boolean>(false);
let show_delete_foapa_clash_dialogue = ref<boolean>(false);
let view = ref<"List" | "Grid">("Grid");
let loaded = ref<boolean>(false);
const edit_clashes = ref([]);
const delete_clashes = ref([]);

type FoapaStates = "Add" | "Edit";
let search_value = ref<string>("");
let state = ref<FoapaStates>("Add");
const edited_foapas_id = ref<string>("");
const return_to_dashboard = ref<boolean>(false);
const foapa_to_delete = ref<string>("");

type FilterValues = "Date(ASC)" | "Date(DESC)" | "Amount(ASC)" | "";
let filterValues = ref<FilterValues>("");

function formatDate(date) {
  const d = new Date(date);
  const month = String(d.getMonth() + 1).padStart(2, "0"); // Months are 0-based, so we add 1
  const day = String(d.getDate()).padStart(2, "0");
  const year = d.getFullYear();

  return `${month}/${day}/${year}`;
}

const toast = useToast();
const filteredFoapaDetails: any = computed(() => {
  if (search_value.value.trim() !== "") {
    return foapaDetails.value.filter((foapa) =>
      foapa.foapaName
        .toLowerCase()
        .includes(search_value.value.toLowerCase().trim())
    );
  }

  if (filterValues.value === "Date(ASC)") {
    return foapaDetails.value.sort((a, b) => {
      if (a.createdAt && b.createdAt) {
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      }
      if (!a.createdAt) return 1;
      if (!b.createdAt) return -1;
      return 0;
    });
  }

  if (filterValues.value === "Date(DESC)") {
    return foapaDetails.value.sort((a, b) => {
      if (a.createdAt && b.createdAt) {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      }
      if (!a.createdAt) return -1;
      if (!b.createdAt) return 1;
      return 0;
    });
  }

  if (search_value.value.trim() === "") {
    return foapaDetails.value;
  }
});

let added_foapa = ref({
  fund: "",
  organization: "",
  account: "",
  program: "",
  activity: "",
  foapaName: "",
  // initialAmount: "",
  // availableAmount: "",
  // currentAmount: "",
  description: "",
});

function removeEditClashPopup() {
  show_edit_clashes_dialogue.value = false;
  //@ts-ignore
  document.querySelector("body").style.overflow = "auto";
}

function removeDeletePopup() {
  show_delete_foapa_clash_dialogue.value = false;
  show_delete_foapa_dialogue.value = false;
  foapa_to_delete.value = "";
  //@ts-ignore
  document.querySelector("body").style.overflow = "auto";
}

let foapa_to_edit = ref<any>({});

function continueEditAfterClash() {
  edited_foapas_id.value = foapa_to_edit.value._id;
  Object.assign(added_foapa.value, foapa_to_edit.value);
  state.value = "Edit";
  //@ts-ignore
  document.querySelector("body").style.overflow = "auto";
  show_edit_clashes_dialogue.value = false;
  foapa_to_edit.value = {};
}

function showHelpScreen() {
  show_foapa_help_dialogue.value = true;
  window.scrollTo(0, 0);
  //@ts-ignore
  document.querySelector("body").style.overflow = "hidden";
}

function removeFoapaHelp() {
  show_foapa_help_dialogue.value = false;
  //@ts-ignore
  document.querySelector("body").style.overflow = "auto";
}

async function triggerFoapaEditMode(foapa: FoapaStuff) {
  try {
    foapa_to_edit.value = foapa;
    //Check if FOAPA is being used in other reimbursements
    let res = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/check-foapa-usage`,
      {
        params: {
          //@ts-ignore
          foapa_id: foapa._id,
        },
      }
    );

    if (res.data.length > 0) {
      // Scroll up
      window.scrollTo(0, 0);

      edit_clashes.value = res.data;
      show_edit_clashes_dialogue.value = true;
      //@ts-ignore
      document.querySelector(".add_foapa_main")?.scrollIntoView();

      //@ts-ignore
      document.querySelector("body").style.overflow = "hidden";
      return;
    }

    //@ts-ignore
    edited_foapas_id.value = foapa._id;
    Object.assign(added_foapa.value, foapa);
    state.value = "Edit";
  } catch (err) {
    toast("There was an error editing this FOAPA", {
      type: TYPE.ERROR,
    });
  }
}

function discardEdits(reset: any) {
  for (const prop of Object.getOwnPropertyNames(added_foapa.value)) {
    delete added_foapa.value[prop];
  }

  reset();
  state.value = "Add";
  edited_foapas_id.value = "";
}

async function editFoapaValues(foapaValues, resetForm) {
  try {
    // toast("Editing FOAPA details...", {
    //   type: TYPE.INFO,
    // });

    // foapaValues.currentAmount = foapaValues.initialAmount;
    // foapaValues.availableAmount = foapaValues.initialAmount;

    if (foapaValues.account === "XXXX") {
      foapaValues.account = "";
    }
    if (foapaValues.program === "XXXX") {
      foapaValues.program = "";
    }

    await axios.post(`${import.meta.env.VITE_API_URL}/api/edit-foapa-detail`, {
      id: edited_foapas_id.value,
      foapaDetail: foapaValues,
    });

    edited_foapas_id.value = "";
    await retrieveUserFoapaDetails();

    toast("FOAPA successfully edited", {
      type: TYPE.SUCCESS,
    });

    state.value = "Add";

    resetForm();

    // Clear the foapa values
  } catch (err: any) {
    toast(
      err?.response?.data?.message ||
        "An unexpected error has occured. Please try again later",
      {
        type: TYPE.ERROR,
      }
    );
    console.log(err);
  }
}

async function addFoapa(values, { resetForm }) {
  if (state.value === "Edit") {
    await editFoapaValues(values, resetForm);
    resetForm();
    return;
  }
  try {
    // toast("Adding FOAPA", {
    //   type: TYPE.INFO,
    // });

    // changes_were_made.value = true
    // values.currentAmount = values.initialAmount;
    // values.availableAmount = values.initialAmount;

    if (values.account === "XXXX") {
      values.account = "";
    }
    if (values.program === "XXXX") {
      values.program = "";
    }

    console.log(values);

    // if(values.account === "XXXX")

    await axios.post(`${import.meta.env.VITE_API_URL}/api/add-foapa-details`, {
      foapaDetails: [values],
    });

    resetForm();
    await retrieveUserFoapaDetails();

    toast("FOAPA successfully added", {
      type: TYPE.SUCCESS,
    });
  } catch (err) {
    toast("An unexpected error has occured. Please try again later", {
      type: TYPE.ERROR,
    });
  }
}

function formatUserFoapa(foapa: FoapaStuff) {
  return `${foapa.fund}-${foapa.organization || "XXXX"}-${
    foapa.account || "XXXX"
  }-${foapa.program || "XXXX"}-${foapa.activity || "XXXX"}`;
}

async function showDeleteFoapaDialogue(foapa_id) {
  try {
    // Check to see which pending reimbursements are using this FOAPA
    let res = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/check-foapa-usage`,
      {
        params: {
          //@ts-ignore
          foapa_id: foapa_id,
        },
      }
    );

    if (res.data.length > 0) {
      // A pending reimbursement is using this FOAPA
      delete_clashes.value = res.data;
      show_delete_foapa_clash_dialogue.value = true;
      foapa_to_delete.value = foapa_id;
      return;
    }

    show_delete_foapa_dialogue.value = true;
    foapa_to_delete.value = foapa_id;
  } catch (err: any) {
    toast(err?.response?.data?.data || "An unexpected error has occured", {
      type: TYPE.ERROR,
    });
    console.log(err);
  }
}

function deleteFoapa(foapa_id) {
  show_delete_foapa_clash_dialogue.value = false;
  show_delete_foapa_dialogue.value = false;
  //@ts-ignore
  document.querySelector("body").style.overflow = "auto";

  // if (confirm_deletion) {
  let index = foapaDetails.value.findIndex((foapa) => foapa._id === foapa_id);

  if (index > -1) {
    foapaDetails.value.splice(index, 1);
  }

  axios.post(`${import.meta.env.VITE_API_URL}/api/update-foapa-details`, {
    foapaDetails: foapaDetails.value,
  });

  toast("FOAPA deleted successfully", {
    type: TYPE.SUCCESS,
  });
  // }
  // } else {
  //   let index = foapaDetails.value.findIndex(
  //     (foapa) => foapa.foapaName === foapaName && foapa.fund === fund
  //   );

  //   if (index > -1) {
  //     foapaDetails.value.splice(index, 1);
  //   }

  //   toast("FOAPA deleted successfully", {
  //     type: TYPE.SUCCESS,
  //   });
  // }
}

async function retrieveUserFoapaDetails() {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/retrieve-foapa-details`
    );

    foapaDetails.value = res.data;
    loaded.value = true;
  } catch (err: any) {
    toast(
      err?.response?.data?.message ||
        "There was an error fetching your FOAPA details. Please try again later",
      {
        type: TYPE.ERROR,
      }
    );
  }
}

onBeforeRouteLeave((to, from, next) => {
  if (return_to_dashboard.value === true) {
    next();
    return;
  }

  if (
    (added_foapa.value.foapaName !== undefined &&
      added_foapa.value.foapaName.length > 0) ||
    (added_foapa.value.account !== undefined &&
      added_foapa.value.account.length > 0) ||
    (added_foapa.value.description !== undefined &&
      added_foapa.value.description.length > 0)
  ) {
    show_leave_dialogue.value = true;
    next(false);
  }

  next();
});

function returnToDashboard() {
  router.push("/dashboard");
}

function discardChanges() {
  return_to_dashboard.value = true;
  router.push("/dashboard");
}

function stayOnPage() {
  show_leave_dialogue.value = false;
}

onMounted(() => {
  retrieveUserFoapaDetails();
});
</script>

<style scoped>
@import url("../assets/styles/add-foapa-page.css");
</style>
