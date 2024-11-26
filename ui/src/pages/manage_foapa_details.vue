<template>
  <main class="xl:px-32 2xl:h-screen h-auto px-16 flex flex-col justify-center">
    <div class="absolute top-0 hidden top_indicator"></div>
    <div class="flex items-center absolute top-0 gap-4 pt-10 return_to_dashboard cursor-pointer"
      @click="returnToDashboard">
      <img src="../assets/left-arrow.png" alt="Left arrow" class="w-4" />
      <h4 class="font-normal text-sm text-gray-600 hover:underline">
        Return to dashboard
      </h4>
    </div>
    <section
      class="flex flex-wrap lg:flex-nowrap items-center justify-start gap-y-32 w-full gap-x-28 mb-20 mt-20 xl:mt-20">
      <section>
        <h3 class="font-semibold text-3xl mt-20 leading-10 xl:mt-7">
          Manage FOAPA Details
        </h3>
        <h4 class="font-semibold text-lg mb-5">Add FOAPA Details</h4>
        <h4 class="font-normal cursor-pointer inline underline leading-7 text-sm mt-0 text-gray-700"
          @click="showHelpScreen">
          Need help? Click here to learn more about FOAPA and how to use them.
        </h4>
        <Form @submit="addFoapa" v-slot="{ handleReset }" class="max-w-auto">
          <div class="mt-7 flex flex-wrap gap-8 min-w-0 sm:min-w-[450px]">
            <div class="flex flex-col w-full sm:w-auto gap-y-3 relative">
              <label for="foapaName" class="text-sm">FOAPA Name*</label>
              <Field name="foapaName" placeholder="Name" :rules="isValidFoapaName" v-model="added_foapa.foapaName"
                class="text-xs border-box px-4 rounded-md border w-full border-gray-100 shadow-md h-10 border-solid sm:w-40">
              </Field>
              <ErrorMessage name="foapaName" class="text-red-400 bottom-[-24px] absolute text-xs"></ErrorMessage>
            </div>
            <div class="flex flex-col gap-y-3 w-full sm:w-auto relative">
              <label for="description" class="text-sm">FOAPA Description</label>
              <Field name="description" placeholder="Description" v-model="added_foapa.description"
                class="text-xs border-box px-4 rounded-md border w-full border-gray-100 shadow-md h-10 border-solid sm:w-40">
              </Field>
              <ErrorMessage name="description" class="text-red-400 bottom-[-24px] absolute text-xs"></ErrorMessage>
            </div>

            <div class="flex flex-col w-full sm:w-auto gap-y-3 relative">
              <label for="fund" class="text-sm">FUND*</label>
              <AutoComplete placeholder="Enter FUND" v-model="added_foapa.fund" dropdown :completeOnFocus="true"
                empty-search-message="FUND not found - may still exist." style="height: 30px"
                class="border-sm shadow-sm sm:!w-40 !w-full rounded-md !h-10 border !border-gray-100"
                :suggestions="FUND" @complete="filterFund" />
              <p name="fund" class="text-red-400 my-0 bottom-[-24px] absolute text-xs">
                {{ fund_error_msg }}
              </p>
            </div>
            <div class="flex flex-col w-full sm:w-auto gap-y-3 relative">
              <label for="organization" class="text-sm">ORGANIZATION (ORG)*</label>
              <AutoComplete placeholder="Enter ORG" v-model="added_foapa.organization" dropdown :completeOnFocus="true"
                empty-search-message="ORG not found - may still exist." style="height: 30px"
                class="border-sm shadow-sm sm:!w-40 !w-full rounded-md !h-10 border !border-gray-100"
                :suggestions="ORGs" @complete="filterOrganization" />
              <p name="organization" class="text-red-400 my-0 bottom-[-24px] absolute text-xs">
                {{ organization_error_msg }}
              </p>
            </div>

            <div class="flex flex-col w-full sm:w-auto gap-y-3 relative">
              <label for="account" class="text-sm">ACCOUNT (ACCT)*</label>
              <AutoComplete placeholder="Enter ACCT" v-model="added_foapa.account" dropdown :completeOnFocus="true"
                empty-search-message="ACCT not found - may still exist."
                class="border-sm shadow-sm rounded-md  border sm:!w-40 !w-full sm: !border-gray-100"
                :suggestions="ACCTs" @complete="filterAccounts" />
              <p name="account" class="text-red-400 my-0 bottom-[-24px] absolute text-xs">
                {{ account_error_msg }}
              </p>
            </div>

            <div class="flex flex-col w-full sm:w-auto gap-y-3 relative">
              <label for="program" class="text-sm">PROGRAM (PROG)*</label>
              <AutoComplete placeholder="Enter PROG" v-model="added_foapa.program" dropdown :completeOnFocus="true"
                empty-search-message="PROG not found - may still exist."
                class="border-sm shadow-sm rounded-md sm:!w-40 border !w-full sm: !border-gray-100" :suggestions="PROG"
                @complete="filterProgram" />
              <p name="program" class="text-red-400 my-0 bottom-[-24px] absolute text-xs">
                {{ program_error_msg }}
              </p>
            </div>
            <div class="flex flex-col gap-y-3 w-full sm:w-auto relative">
              <label for="activity" class="text-sm">ACTIVITY (ACTV)</label>
              <Field name="activity" placeholder="Enter ACTV" :rules="isValidActvNumber" v-model="added_foapa.activity"
                class="text-xs border-box px-4 rounded-md border w-full border-gray-100 shadow-md h-10 border-solid sm:w-40">
              </Field>
              <ErrorMessage name="activity" class="text-red-400 bottom-[-24px] absolute text-xs"></ErrorMessage>
            </div>
          </div>
          <button type="submit"
            class="bg-udmercy-blue mt-10 text-white border-none w-40 h-11 rounded-full cursor-pointer text-xs">
            {{ state === "Add" ? "Add Foapa" : "Edit Foapa" }}
          </button>
          <button type="button" v-if="state === 'Edit'" @click="discardData(handleReset)"
            class="bg-udmercy-red mt-10 ml-5 text-white border-none w-40 h-11 rounded-full cursor-pointer text-xs">
            Discard Edits
          </button>
          <h3 class="text-sm font-normal mt-6 leading-7">
            Note: If you don't know your ORG, PROG or ACCT number, Enter XXXX as
            a placeholder.
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
          <input type="text" v-model="search_value" placeholder="Search by FOAPA name"
            class="border rounded-md box-border px-4 border-gray-200 border-solid w-auto md:w-full h-10" />
          <!-- <div class="border border-solid">
            <h3>View as list</h3>
          </div> -->
          <!-- <img :src="SortIcon" alt="Sort icon" class="w-5 cursor-pointer" /> -->
        </div>
        <div class="flex gap-x-3 flex-wrap">
          <span
            class="hover:border-gray-400 w-auto py-0 h-10 text-gray-500 hover:text-gray-600 transition-all duration-150 border mt-5 rounded-full cursor-pointer border-solid flex items-center px-2 border-gray-200"
            @click="filterValues = 'Date(ASC)'" :class="filterValues === 'Date(ASC)'
              ? 'border-gray-400 text-gray-600'
              : ''
              ">
            <h4 class="my-1 px-3 leading-7 h-auto font-normal text-xs m-auto text-inherit">
              Sort by date (ASC)
            </h4>
          </span>
          <span
            class="hover:border-gray-400 w-auto py-0 h-10 text-gray-500 hover:text-gray-600 transition-all duration-150 border mt-5 rounded-full cursor-pointer border-solid flex items-center px-2 border-gray-200"
            @click="filterValues = 'Date(DESC)'" :class="filterValues === 'Date(DESC)'
              ? 'border-gray-400 text-gray-600'
              : ''
              ">
            <h4 class="my-1 px-3 leading-7 h-auto font-normal text-xs m-auto text-inherit">
              Sort by date added (DESC)
            </h4>
          </span>
        </div>
        <h3 @click="view === 'Grid' ? (view = 'List') : (view = 'Grid')"
          class="text-sm mb-[-10px] font-normal cursor-pointer hover:underline">
          View as {{ view === "Grid" ? "list" : "grid" }}
        </h3>
        <div
          class="flex flex-col mt-6 gap-7 sm:max-h-[28rem] h-[28rem] overflow-auto overflow-y-scroll sm:max-w-none max-w-[300px]">
          <div
            class="border shadow-sm rounded w-auto box-border px-7 py-6 flex border-gray-200 border-solid h-auto justify-between"
            v-for="foapa in filteredFoapaDetails" v-if="view === 'List'">
            <h3 class="font-semibold text-base my-0 cursor-pointer"
              @click="router.push(`foapa-information/${foapa._id}`)">
              {{ foapa.foapaName }}: {{ formatFoapaDeails(foapa) }}
            </h3>
            <div class="flex items-center ml-5 gap-2">
              <img :src="EditIcon" alt="Edit icon" class="w-5 cursor-pointer" title="Edit FOAPA"
                @click="triggerFoapaEditMode(foapa)" />
              <img :src="DeleteIcon" alt="Trash icon" class="w-4 cursor-pointer" title="Delete FOAPA"
                @click="showDeleteFoapaDialogue(foapa._id)" />
            </div>
          </div>
          <div class="border shadow-sm rounded w-auto box-border px-7 py-6 border-gray-200 border-solid h-auto"
            v-for="foapa in filteredFoapaDetails" v-if="view === 'Grid'">
            <h3 class="font-semibold text-base my-0 cursor-pointer"
              @click="router.push(`foapa-information/${foapa._id}`)">
              {{ foapa.foapaName }}: {{ formatFoapaDeails(foapa) }}
            </h3>
            <h4 :title="foapa.description"
              class="text-sm mt-3 font-normal mb-0 leading-7 max-h-28 overflow-hidden text-ellipsis">
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
              <img :src="EditIcon" alt="Edit icon" title="Edit FOAPA" class="w-5 cursor-pointer"
                @click="triggerFoapaEditMode(foapa)" />
              <img :src="DeleteIcon" alt="Trash icon" title="Delete FOAPA" class="w-4 cursor-pointer"
                @click="showDeleteFoapaDialogue(foapa._id)" />
              <span class="flex items-center gap-3">
                <h4 class="text-xs my-0 font-normal">
                  Last Updated:
                  {{ formatDate(foapa.updatedAt) }}
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
          <div v-if="
            loaded &&
            foapaDetails.length !== 0 &&
            filteredFoapaDetails.length === 0
          ">
            <h4 class="font-medium text-sm mt-0">
              No results found for {{ search_value }}
            </h4>
          </div>
          <h4 class="font-medium text-sm mt-0" v-if="!loaded">Loading...</h4>
        </div>
      </section>
    </section>

    <ConfirmationPopup :continue-function="stayOnPage" :cancel-function="discardChanges" v-show="show_leave_dialogue"
      left-button-text="Discard Changes" right-button-text="Go Back">
      <template #message>
        You have some unsaved changes (You have inputted some FOAPA values
        without adding them). To discard these changes, click 'Discard Changes.'
        To go back and save these changes, click 'Go Back'.
      </template>
    </ConfirmationPopup>

    <ConfirmationPopup v-if="show_edit_clashes_dialogue" class="clashes_dialogue"
      :cancel-function="removeEditClashPopup" :continue-function="continueEditAfterClash" left-button-text="Don't Edit"
      right-button-text="Continue" title="Warning">
      <template #message>
        Warning: You are about to edit a FOAPA that is being used by the
        following reimbursement claims:
        <p v-for="claim in edit_clashes" class="font-medium cursor-pointer underline"
          @click="() => goToClashingRequest(claim.reimbursement_id)">
          {{ claim.name || "Error" }}
        </p>
        To stop editing, click 'Don't Edit.' To continue editing this FOAPA,
        click 'Continue.' Note: Continuing editing this FOAPA will cause the
        FOAPA values in the above-mentioned reimbursements to change as well.
      </template>
    </ConfirmationPopup>

    <ConfirmationPopup v-if="show_delete_foapa_dialogue" :cancel-function="removeDeletePopup"
      :continue-function="() => deleteFoapa(foapa_to_delete)" left-button-text="Don't Delete" right-button-text="Delete"
      title="Caution">
      <template #message>
        Warning: You are about to delete a FOAPA. Are you sure you want to
        delete this?
      </template>
    </ConfirmationPopup>

    <!-- Make not two OK buttons -->
    <ConfirmationPopup v-if="show_delete_foapa_clash_dialogue" :cancel-function="removeDeletePopup"
      :continue-function="removeDeletePopup" left-button-text="HIDE" right-button-text="OK" title="Error">
      <template #message>
        Error: You are about to delete a FOAPA that is being used by the
        following reimbursement claims:
        <p v-for="claim in delete_clashes" class="font-medium cursor-pointer underline"
          @click="() => goToClashingRequest(claim.reimbursement_id)">
          {{ claim.name || "Error" }}
        </p>
        Please submit these claims before attempting to delete this FOAPA
      </template>
    </ConfirmationPopup>

    <section v-if="show_foapa_help_dialogue">
      <div class="absolute z-50 bg-black bg-opacity-50 h-screen top-0 left-0 w-screen items-center flex justify-center">
        <div
          class="bg-white max-w-4xl max-h-[700px] shadow-md border border-solid border-gray-100 h-96 overflow-auto md:h-min px-6 py-9 rounded-md">
          <div class="flex justify-between">
            <h3 class="text-md font-semibold mb-6 mt-0 underline">
              FOAPA Help
            </h3>
            <img :src="CancelIcon" alt="Cancel icon" class="w-4 h-4 my-0 cursor-pointer" @click="removeFoapaHelp" />
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
              <span class="font-medium leading-7">General Department Spending</span>
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
import AutoComplete from "primevue/autocomplete";
import { useField, useSetFieldError } from "vee-validate";

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
import { formatFoapaDeails } from "../utils/formatFoapaDetails";

const router = useRouter();
type Foapa = FoapaStuff & { _id?: string };
let foapaDetails = ref<Foapa[]>([]);
let changes_were_made = ref<boolean>(false);
let show_leave_dialogue = ref<boolean>(false);
let show_foapa_help_dialogue = ref<boolean>(false);
let show_edit_clashes_dialogue = ref<boolean>(false);
let show_delete_foapa_dialogue = ref<boolean>(false);
let show_delete_foapa_clash_dialogue = ref<boolean>(false);
const organization_error_msg = ref<string>("");
const program_error_msg = ref<string>("");
const account_error_msg = ref<string>("");
const fund_error_msg = ref<string>("");

let view = ref<"List" | "Grid">("Grid");
let loaded = ref<boolean>(false);
const edit_clashes = ref<{ name: String; reimbursement_id: String }[]>([]);
const delete_clashes = ref<{ name: String; reimbursement_id: String }[]>([]);

type FoapaStates = "Add" | "Edit";
let search_value = ref<string>("");
let state = ref<FoapaStates>("Add");
const edited_foapas_id = ref<string>("");
const return_to_dashboard = ref<boolean>(false);
const foapa_to_delete = ref<string>("");
const originalACCTs = ref<any[]>([]);
const originalORGs = ref<any[]>([]);
const originalPROG = ref<any[]>([]);
const originalFUND = ref<any[]>([]);

const FUND = ref<any[]>([]);
const ACCTs = ref<any[]>([]);
const ORGs = ref<any[]>([]);
const PROG = ref<any[]>([]);

type FilterValues = "Date(ASC)" | "Date(DESC)" | "Amount(ASC)" | "";
let filterValues = ref<FilterValues>("");

function formatDate(date) {
  const d = new Date(date);
  const month = String(d.getMonth() + 1).padStart(2, "0"); // Months are 0-based, so we add 1
  const day = String(d.getDate()).padStart(2, "0");
  const year = d.getFullYear();

  return `${month}/${day}/${year}`;
}

function goToClashingRequest(claim_id) {
  router.push({
    path: "/add-reimbursement",
    query: { reimbursementId: claim_id },
  });
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
  description: "",
  isUDMPU: false,
});

async function retrieveFoapaRegistry() {
  try {
    let res = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/retrieve-foapa-registry`
    );

    const acct_numbers = res.data.account;
    const org_numbers = res.data.organization;
    const prog_numbers = res.data.program;
    const fund_numbers = res.data.fund;

    originalACCTs.value = acct_numbers.map(
      (acct) => acct.number + " - " + acct.description
    );

    ACCTs.value = originalACCTs.value;

    originalORGs.value = org_numbers.map(
      (org) => org.number + " - " + org.description
    );

    ORGs.value = originalORGs.value;

    originalPROG.value = prog_numbers.map(
      (prog) => prog.number + " - " + prog.description
    );

    PROG.value = originalPROG.value;

    originalFUND.value = fund_numbers.map(
      (fund) => fund.number
    );

    FUND.value = originalFUND.value;
  } catch (err) {
    console.log(err);
    toast("There was an error fetching FOAPA registry", {
      type: TYPE.ERROR,
    });
  }
}

function filterAccounts(event) {
  const query = event.query.toLowerCase();

  if (!event.query.trim().length) {
    ACCTs.value = [...originalACCTs.value];
  } else {
    ACCTs.value = originalACCTs.value.filter((acct) => {
      return acct.toLowerCase().includes(query);
    });
  }
}

function filterOrganization(event) {
  const query = event.query.toLowerCase();

  if (!event.query.trim().length) {
    ORGs.value = [...originalORGs.value];
  } else {
    ORGs.value = originalORGs.value.filter((acct) => {
      return acct.toLowerCase().includes(query);
    });
  }
}

function filterProgram(event) {
  const query = event.query.toLowerCase();

  if (!event.query.trim().length) {
    PROG.value = [...originalPROG.value];
  } else {
    PROG.value = originalPROG.value.filter((acct) => {
      return acct.toLowerCase().includes(query);
    });
  }
}

function filterFund(event) {
  const query = event.query.toLowerCase();

  if (!event.query.trim().length) {
    FUND.value = [...originalFUND.value];
  } else {
    FUND.value = originalFUND.value.filter((fund) => {
      return fund.toLowerCase().includes(query);
    });
  }
}


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

function discardData(reset?: any) {
  //Clear added FOAPA
  added_foapa.value = {
    fund: "",
    organization: "",
    account: "",
    program: "",
    activity: "",
    foapaName: "",
    description: "",
    isUDMPU: false,
  };

  state.value = "Add";
  edited_foapas_id.value = "";

  if (reset) {
    reset();
  }
}

async function editFoapaValues(foapaValues, resetForm) {
  try {
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
  } finally {
    discardData();
  }
}

// ADDED FOAPA WATCHERS
watch(
  () => added_foapa.value.organization,
  (new_val, old_val) => {
    if (new_val !== old_val) {
      if (old_val.trim() === "" && new_val.trim() !== "") {
        organization_error_msg.value = "";
      }
    }
  }
);

watch(
  () => added_foapa.value.account,
  (new_val, old_val) => {
    if (new_val !== old_val) {
      if (old_val.trim() === "" && new_val.trim() !== "") {
        account_error_msg.value = "";
      }
    }
  }
);

watch(
  () => added_foapa.value.program,
  (new_val, old_val) => {
    if (new_val !== old_val) {
      if (old_val.trim() === "" && new_val.trim() !== "") {
        program_error_msg.value = "";
      }
    }
  }
);

async function addFoapa(values, { resetForm, setFieldError }) {
  if (added_foapa.value.organization.trim() === "") {
    organization_error_msg.value = "Required";
  }

  if (added_foapa.value.account.trim() === "") {
    account_error_msg.value = "Required";
  }

  if (added_foapa.value.program.trim() === "") {
    program_error_msg.value = "Required";
  }


  // if (added_foapa.value.fund.trim().length !== 6) {
  //   fund_error_msg.value = "Must be 6 characters";
  // }

  if (added_foapa.value.fund.trim() === "") {
    fund_error_msg.value = "Required";
  }


  if (
    organization_error_msg.value !== "" ||
    account_error_msg.value !== "" ||
    program_error_msg.value !== ""
  ) {
    return;
  }

  if (state.value === "Edit") {
    await editFoapaValues(added_foapa.value, resetForm);
    resetForm();
    return;
  }

  try {
    // By default, the UDMPU flag is set to false, but we can explicitly set it to false here for
    // redundancy
    added_foapa.value.isUDMPU = false;

    await axios.post(`${import.meta.env.VITE_API_URL}/api/add-foapa-details`, {
      foapaDetails: added_foapa.value,
    });

    discardData(resetForm);

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

    window.scrollTo(0, 0);
    show_delete_foapa_dialogue.value = true;
    foapa_to_delete.value = foapa_id;
  } catch (err: any) {
    toast(err?.response?.data?.data || "An unexpected error has occured", {
      type: TYPE.ERROR,
    });
    console.log(err);
  }
}

async function deleteFoapa(foapa_id) {
  try {
    show_delete_foapa_clash_dialogue.value = false;
    show_delete_foapa_dialogue.value = false;
    //@ts-ignore
    document.querySelector("body").style.overflow = "auto";

    toast("Deleting FOAPA...", {
      type: TYPE.SUCCESS,
    });

    await axios.post(
      `${import.meta.env.VITE_API_URL}/api/delete-foapa-detail`,
      {
        foapa_id: foapa_id,
      }
    );

    await retrieveUserFoapaDetails();

    toast("FOAPA deleted successfully", {
      type: TYPE.SUCCESS,
    });
  } catch (err) {
    toast("There was an error deleting this FOAPA. Please try again later", {
      type: TYPE.ERROR,
    });
  }
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
  retrieveFoapaRegistry();
});
</script>

<style>
@import url("../assets/styles/add-foapa-page.css");
</style>

<style>
/* temporary */
/* .p-autocomplete-overlay {
  margin-top: 20px !important;
  margin-left: -15px !important;
  background-color: white !important;
  border: solid 1px rgb(226, 226, 226) !important;
  padding: 10px 15px !important;
  border-radius: 6px !important;
  font-size: 14px !important;
}

.p-autocomplete-option {
  margin-bottom: 7px;
}

.p-autocomplete {
  width: 7rem !important;
}

.p-inputtext.p-component.p-autocomplete-input {
  font-size: 0.75rem;
}

.p-inputtext::placeholder {
  color: gray !important;
} */
</style>
