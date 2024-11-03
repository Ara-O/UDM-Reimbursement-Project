<template>
  <!-- <div class="foapa-numbers-label"> -->
  <!-- <label for="foapa-numbers"
      >FOAPA [ FUND - ORG - ACCT - PROG - ACTV ]:</label
    > -->
  <!-- </div>
  <br /> -->

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
            name="foapa-description"
            id="foapa-description"
            v-model="currentlyInputtedFOAPA.description"
          />
          <ErrorMessage name="foapa-description" class="error-field" />
        </span>
      </div>
      <!-- <div class="input-FOAPA-field">
        <span class="foapa-title-span">
          <label for="foapa-name">Amount</label>
          <img
            src="../../assets/user-help-icon.png"
            alt="Help"
            class="foapa-help-icon"
            title="Optional: Current balance of FOAPA number. Can be used to keep track of FOAPA spendings"
          />
        </span> -->
        <!-- <span class="input-FOAPA-field-span">
          <Field
            type="text"
            style="width: 95px"
            placeholder="Amount"
            name="foapa-amount"
            :rules="isValidFoapaAmount"
            id="foapa-amount"
            v-model="currentlyInputtedFOAPA.initialAmount"
          />
          <ErrorMessage name="foapa-amount" class="error-field" />
        </span> 
      </div> -->
      <h5>:</h5>

      <div class="input-FOAPA-field">
        <span class="foapa-title-span">
          <label for="foapa-name">FUND*</label>
          <img
            src="../../assets/user-help-icon.png"
            alt="Help"
            class="foapa-help-icon"
            title="Required: fund, 6 digits &#013;The fund is where the funds (financing) will come from within the University."
          />
        </span>
        <span class="input-FOAPA-field-span">
          <Field
            type="text"
            name="fund-input"
            :rules="isValidFundNumber"
            id="fund-input"
            placeholder="xxxxxx"
            v-model="currentlyInputtedFOAPA.fund"
          />
          <ErrorMessage name="fund-input" class="error-field" />
        </span>
      </div>
      <h5>-</h5>

      <div class="input-FOAPA-field">
        <span class="foapa-title-span">
          <label for="foapa-name">ORG</label>
          <img
            src="../../assets/user-help-icon.png"
            alt="Help"
            class="foapa-help-icon"
            title="Optional: Organization, 4 digits&#013;The organization is the department that affected by the transaction."
          />
        </span>
        <span class="input-FOAPA-field-span">
          <Field
            type="text"
            :rules="isValidFoapaNumber"
            name="org-input"
            id="org-input"
            placeholder="xxxx"
            v-model="currentlyInputtedFOAPA.organization"
          />
          <ErrorMessage name="org-input" class="error-field" />
        </span>
      </div>
      <h5>-</h5>
      <div class="input-FOAPA-field">
        <span class="foapa-title-span">
          <label for="foapa-name">ACCT*</label>
          <img
            src="../../assets/user-help-icon.png"
            alt="Help"
            class="foapa-help-icon"
            title="Required: Account number, 4 digits&#013;The classification of the Revenue or Expense"
          />
        </span>
        <span class="input-FOAPA-field-span">
          <Field
            type="text"
            name="acct-input"
            id="acct-input"
            :rules="isValidAccountNumber"
            list="account-no"
            placeholder="xxxx"
            v-model="currentlyInputtedFOAPA.account"
          />
          <datalist id="account-no">
            <option
              v-for="acctNo in accountNumbers"
              :value="String(acctNo.number).padStart(4, '0')"
            >
              {{ acctNo.number }} - {{ acctNo.description }}
            </option>
          </datalist>
          <ErrorMessage name="acct-input" class="error-field" />
        </span>
      </div>
      <h5>-</h5>

      <div class="input-FOAPA-field">
        <span class="foapa-title-span">
          <label for="foapa-name">Program*</label>
          <img
            src="../../assets/user-help-icon.png"
            alt="Help"
            class="w-4"
            title="Optional: Program, 4 digits&#013;Identification of use the use or purpose of funds."
          />
        </span>
        <span class="input-FOAPA-field-span">
          <Field
            type="text"
            name="prog-input"
            id="prog-input"
            placeholder="xxxx"
            :rules="isValidProgramNumber"
            v-model="currentlyInputtedFOAPA.program"
          />
          <ErrorMessage name="prog-input" class="error-field" />
        </span>
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
      <button class="add-foapa-button" type="submit" style="width: auto">
        <img src="../../assets/add-icon.png" alt="add-icon" class="add-icon" />
      </button>
    </div>
  </Form>
  <br />
  <section style="width: auto">
    <table class="foapa-table">
      <tbody>
        <tr style="text-align: left">
          <th>Name</th>
          <!-- <th>Amount</th> -->
          <th>FUND</th>
          <th>ORG</th>
          <th>ACCT</th>
          <th>PROG</th>
          <th>ACTV</th>
          <th></th>
          <th></th>
        </tr>
        <tr v-for="foapa in props.foapaDetails">
          <td class="flex items-center gap-3">
            {{ foapa.foapaName }}
            <img
              id="help"
              src="../../assets/user-help-icon.png"
              alt="Help"
              class="foapa-help-icon"
              :title="foapa.description"
            />
          </td>
          <!-- <td>
            {{ foapa.initialAmount ? `$${foapa.initialAmount}` : "N/A" }}
          </td> -->
          <td>{{ foapa.fund }}</td>
          <td>{{ foapa.organization || "N/A" }}</td>
          <td>{{ foapa.account }}</td>
          <td>{{ foapa.program }}</td>
          <td>{{ foapa.activity || "N/A" }}</td>
          <td>
            <img
              src="../../assets/trash-icon.png"
              alt="Trash"
              class="delete-icon"
              @click="deleteFoapa(foapa.foapaName, foapa.fund)"
            />
          </td>
          <td>
            <img
              src="../../assets/edit-icon-red.png"
              alt="Edit"
              class="delete-icon"
              @click="editFoapa(foapa)"
            />
          </td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<script setup lang="ts">
import axios from "axios";
import { TYPE, useToast } from "vue-toastification";
import { Form, Field, ErrorMessage } from "vee-validate";
import { ref, reactive, onMounted } from "vue";
import { FoapaStuff } from "../../types/types";
import {
  isValidFundNumber,
  isValidAccountNumber,
  isValidFoapaNumber,
  // isValidFoapaAmount,
  isValidFoapaName,
  isValidActvNumber,
  isValidFoapaDescription,
  isValidProgramNumber,
} from "../../utils/validators";
import AutoComplete from 'primevue/autocomplete';

const toast = useToast();
let props = defineProps<{ foapaDetails: FoapaStuff[] }>();
let changes_were_made = ref<boolean>();
const emits = defineEmits(["changes-were-made"]);

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

let accountNumbers = ref<{ number: string; description: string }[]>([]);

function retrieveAccountNumbers() {
  axios
    .get(`${import.meta.env.VITE_API_URL}/api/retrieve-account-numbers`)
    .then((res) => {
      accountNumbers.value = res.data.accountNumbers;
    })
    .catch((err) => {
      toast(
        err?.response?.data?.message ||
          "There was an error retrieving account numbers",
        {
          type: TYPE.ERROR,
        }
      );
    });
}

function addFoapa(values, { resetForm }) {
  resetForm();
  // currentlyInputtedFOAPA.currentAmount = currentlyInputtedFOAPA.initialAmount;
  // currentlyInputtedFOAPA.availableAmount = currentlyInputtedFOAPA.initialAmount;
  let addedFoapa = Object.assign({}, currentlyInputtedFOAPA);
  props.foapaDetails.push(addedFoapa);
  emits("changes-were-made");
}

function deleteFoapa(foapaName, fund, show_confirm_dialog = true) {
  emits("changes-were-made");
  if (show_confirm_dialog) {
    const confirm_deletion = confirm(
      "Are you sure you want to delete this FOAPA. Click 'yes' to confirm"
    );

    if (confirm_deletion) {
      let index = props.foapaDetails.findIndex(
        (foapa) => foapa.foapaName === foapaName && foapa.fund === fund
      );

      if (index > -1) {
        props.foapaDetails.splice(index, 1);
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
  retrieveAccountNumbers();
});
</script>

<style scoped>
@import url("../../assets/styles/manage-foapa.css");

.input-field-foapa-wrapper {
  height: 86px;
}
</style>
