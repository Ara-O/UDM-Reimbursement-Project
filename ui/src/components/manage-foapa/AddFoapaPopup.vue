<template>
  <Form @submit="addFoapa">
    <div
      class="input-field-foapa-wrapper"
      style="text-align: center; height: auto"
    >
      <div class="input-FOAPA-field">
        <span class="foapa-title-span">
          <label for="foapa-name">Name</label>
          <img
            src="../../assets/user-help-icon.png"
            alt="Help"
            class="foapa-help-icon"
            title="Unique identifier for FOAPA Number for easy identification. The FOAPA name is arbitrary and not related to the actual FOAPA"
          />
        </span>
        <span class="input-FOAPA-field-span">
          <Field
            type="text"
            :rules="(value) => isValidFoapaName(value, 100)"
            style="width: 150px"
            placeholder="Name"
            name="foapa-name"
            id="foapa-name"
            class="!h-10"
            v-model="currentlyInputtedFOAPA.foapaName"
          />
          <ErrorMessage name="foapa-name" class="error-field" />
        </span>
      </div>
      <div class="input-FOAPA-field">
        <span class="foapa-title-span">
          <label for="foapa-description">Description (Optional)</label>
          <img
            src="../../assets/user-help-icon.png"
            alt="Help"
            class="foapa-help-icon"
            title="Give a description to help identify each FOAPA."
          />
        </span>
        <span class="input-FOAPA-field-span">
          <Field
            type="text"
            :rules="(value) => isValidFoapaDescription(value)"
            style="width: 150px"
            placeholder="Description"
            class="!h-10"
            name="foapa-description"
            id="foapa-description"
            v-model="currentlyInputtedFOAPA.description"
          />
          <ErrorMessage name="foapa-description" class="error-field" />
        </span>
      </div>

      <h5>:</h5>

      <div class="flex flex-col w-full sm:w-auto gap-y-3 relative">
        <label for="organization" class="text-sm">FUND (FUND)*</label>
        <AutoComplete
          placeholder="Enter FUND"
          v-model="currentlyInputtedFOAPA.fund"
          dropdown
          :completeOnFocus="true"
          empty-search-message="FUND not found - may still exist."
          style="height: 30px"
          class="border-sm shadow-sm sm:!w-40 !w-full rounded-md !h-10 border !border-gray-100"
          :suggestions="FUND"
          @complete="filterFund"
        />
        <p
          name="organization"
          class="text-red-400 my-0 bottom-[-24px] absolute text-xs"
        >
          {{ fund_error_msg }}
        </p>
      </div>

      <h5>-</h5>

      <div class="flex flex-col w-full sm:w-auto gap-y-3 relative">
        <label for="organization" class="text-sm">ORGANIZATION (ORG)*</label>
        <AutoComplete
          placeholder="Enter ORG"
          v-model="currentlyInputtedFOAPA.organization"
          dropdown
          :completeOnFocus="true"
          empty-search-message="ORG not found - may still exist."
          style="height: 30px"
          class="border-sm shadow-sm sm:!w-40 !w-full rounded-md !h-10 border !border-gray-100"
          :suggestions="ORGs"
          @complete="filterOrganization"
        />
        <p
          name="organization"
          class="text-red-400 my-0 bottom-[-24px] absolute text-xs"
        >
          {{ organization_error_msg }}
        </p>
      </div>

      <h5>-</h5>
      <div class="flex flex-col w-full sm:w-auto gap-y-3 relative">
        <label for="account" class="text-sm">ACCOUNT (ACCT)*</label>
        <AutoComplete
          placeholder="Enter ORG"
          v-model="currentlyInputtedFOAPA.account"
          dropdown
          :completeOnFocus="true"
          empty-search-message="ACCT not found - may still exist."
          style="height: 30px"
          class="border-sm shadow-sm sm:!w-40 !w-full rounded-md !h-10 border !border-gray-100"
          :suggestions="ACCTs"
          @complete="filterAccounts"
        />
        <p
          name="organization"
          class="text-red-400 my-0 bottom-[-24px] absolute text-xs"
        >
          {{ account_error_msg }}
        </p>
      </div>
      <h5>-</h5>

      <div class="flex flex-col w-full sm:w-auto gap-y-3 relative">
        <label for="account" class="text-sm">PROGRAM (PROG)*</label>
        <AutoComplete
          placeholder="Enter PROG"
          v-model="currentlyInputtedFOAPA.program"
          dropdown
          :completeOnFocus="true"
          empty-search-message="ACCT not found - may still exist."
          style="height: 30px"
          class="border-sm shadow-sm sm:!w-40 !w-full rounded-md !h-10 border !border-gray-100"
          :suggestions="PROG"
          @complete="filterProgram"
        />
        <p
          name="organization"
          class="text-red-400 my-0 bottom-[-24px] absolute text-xs"
        >
          {{ program_error_msg }}
        </p>
      </div>
      <h5>-</h5>
      <div class="input-FOAPA-field">
        <span class="foapa-title-span">
          <label for="foapa-name">ACTV</label>
          <img
            src="../../assets/user-help-icon.png"
            alt="Help"
            class="foapa-help-icon"
            title="Optional: Activity, 4 letters&#013;The activity is used to track special projects."
          />
        </span>
        <span class="input-FOAPA-field-span">
          <Field
            type="text"
            name="actv-input"
            :rules="isValidActvNumber"
            id="actv-input"
            placeholder="xxxx"
            v-model="currentlyInputtedFOAPA.activity"
          />
          <ErrorMessage name="actv-input" class="error-field" />
        </span>
      </div>
    </div>
    <button
      class="add-foapa-button w-auto flex gap-3 !border-udmercy-blue !px-4 !bg-udmercy-blue"
      type="submit"
    >
      <h4 class="font-medium">Add FOAPA</h4>
      <img
        src="../../assets/add-icon.png"
        alt="add-icon"
        class="add-icon !w-3"
      />
    </button>
  </Form>
</template>

<script setup lang="ts">
import axios from "axios";
import { TYPE, useToast } from "vue-toastification";
import { Form, Field, ErrorMessage } from "vee-validate";
import { ref, reactive, onMounted } from "vue";
import { FoapaStuff } from "../../types/types";
type Foapa = FoapaStuff & { _id?: string };
import {
  isValidFundNumber,
  isValidAccountNumber,
  isValidFoapaNumber,
  // isValidFoapaAmount,
  isValidFoapaName,
  isValidActvNumber,
  isValidFoapaDescription,
  isValidProgramNumber,
  isValidOrgNumber,
} from "../../utils/validators";
import AutoComplete from "primevue/autocomplete";

const toast = useToast();
let props = defineProps<{ foapaDetails: FoapaStuff[] }>();
let changes_were_made = ref<boolean>();
const emits = defineEmits(["changes-were-made", "foapa-added"]);
let foapaDetails = ref<Foapa[]>([]);
const originalACCTs = ref<any[]>([]);
const originalORGs = ref<any[]>([]);
const originalPROG = ref<any[]>([]);
const originalFUND = ref<any[]>([]);

const organization_error_msg = ref<string>("");
const program_error_msg = ref<string>("");
const account_error_msg = ref<string>("");
const fund_error_msg = ref<string>("");

const ACCTs = ref<any[]>([]);
const ORGs = ref<any[]>([]);
const PROG = ref<any[]>([]);
const FUND = ref<any[]>([]);

let currentlyInputtedFOAPA = reactive<FoapaStuff>({
  fund: "",
  organization: "",
  account: "",
  program: "",
  activity: "",
  foapaName: "",
  // initialAmount: "",
  // currentAmount: "",
  // availableAmount: "",
  description: "",
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

    originalFUND.value = fund_numbers.map((fund) => fund.number);

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

function addFoapa(values, { resetForm }) {
  // currentlyInputtedFOAPA.currentAmount = currentlyInputtedFOAPA.initialAmount;
  // currentlyInputtedFOAPA.availableAmount = currentlyInputtedFOAPA.initialAmount;
  let addedFoapa = Object.assign({}, currentlyInputtedFOAPA);

  if (addedFoapa.fund.trim() === "") {
    toast("FUND value is missing", {
      type: TYPE.ERROR,
    });
    return;
  }

  if (addedFoapa.organization.trim() === "") {
    toast("ORG value is missing", {
      type: TYPE.ERROR,
    });
    return;
  }

  if (addedFoapa.account.trim() === "") {
    toast("ACCT value is missing", {
      type: TYPE.ERROR,
    });
    return;
  }

  if (addedFoapa.program.trim() === "") {
    toast("PROG value is missing", {
      type: TYPE.ERROR,
    });
    return;
  }

  toast("Saving FOAPA information...", {
    type: TYPE.INFO,
  });

  axios
    .post(`${import.meta.env.VITE_API_URL}/api/add-foapa-details`, {
      foapaDetails: addedFoapa,
    })
    .then(() => {
      resetForm();
      emits("foapa-added", addedFoapa);
      toast("Successfully saved FOAPA information", {
        type: TYPE.SUCCESS,
      });
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

async function deleteFoapa(foapaName, fund, show_confirm_dialog = true) {
  emits("changes-were-made");
  let idOfFoapa;
  if (show_confirm_dialog) {
    const confirm_deletion = confirm(
      "Are you sure you want to delete this FOAPA. Click 'yes' to confirm"
    );

    if (confirm_deletion) {
      let index = props.foapaDetails.findIndex(
        (foapa) => foapa.foapaName === foapaName && foapa.fund === fund
      );

      if (index > -1) {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/retrieve-foapa-details`
        );
        // console.log("INDEX: ", index, props.foapaDetails[index], "RES: ", res)
        for (let foapa of res.data) {
          if (
            foapa.foapaName === props.foapaDetails[index].foapaName &&
            foapa.fund === props.foapaDetails[index].fund &&
            foapa.account == props.foapaDetails[index].account &&
            foapa.activity == props.foapaDetails[index].activity &&
            foapa.program == props.foapaDetails[index].program &&
            foapa.organization == props.foapaDetails[index].organization
          )
            idOfFoapa = foapa._id;
        }
        props.foapaDetails.splice(index, 1);
        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/delete-foapa-detail`,
          {
            foapa_id: idOfFoapa,
          }
        );
      }
    }
  } else {
    let index = props.foapaDetails.findIndex(
      (foapa) => foapa.foapaName === foapaName && foapa.fund === fund
    );

    if (index > -1) {
      props.foapaDetails.splice(index, 1);
    }
  }
}

function editFoapa(foapa) {
  currentlyInputtedFOAPA.fund = foapa.fund;
  currentlyInputtedFOAPA.organization = foapa.organization;
  currentlyInputtedFOAPA.account = foapa.account;
  currentlyInputtedFOAPA.program = foapa.program;
  currentlyInputtedFOAPA.activity = foapa.activity;
  currentlyInputtedFOAPA.foapaName = foapa.foapaName;
  // currentlyInputtedFOAPA.initialAmount = foapa.currentAmount;
  currentlyInputtedFOAPA.description = foapa.description;
  deleteFoapa(foapa.foapaName, foapa.fund, false);
}

onMounted(() => {
  retrieveFoapaRegistry();
});
</script>

<style scoped>
@import url("../../assets/styles/manage-foapa.css");

.input-field-foapa-wrapper {
  height: 86px;
}
</style>
