<template>
  <div class="foapa-numbers-label">
    <label for="foapa-numbers"
      >FOAPA [ FUND - ORG - ACCT - PROG - ACTV ]:</label
    >
  </div>
  <br />

  <Form @submit="addFoapa">
    <div class="input-field-foapa-wrapper" style="text-align: center">
      <div class="input-FOAPA-field">
        <span class="foapa-title-span">
          <label for="foapa-name">Name*</label>
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
            :rules="isValidString"
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
          <label for="foapa-name">Amount</label>
          <img
            src="../../assets/user-help-icon.png"
            alt="Help"
            class="foapa-help-icon"
            title="Optional: Current balance of FOAPA number. Can be used to keep track of FOAPA spendings"
          />
        </span>
        <span class="input-FOAPA-field-span">
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
      </div>
      <h5>:</h5>

      <div class="input-FOAPA-field">
        <span class="foapa-title-span">
          <label for="foapa-name">FUND*</label>
          <img
            src="../../assets/user-help-icon.png"
            alt="Help"
            class="foapa-help-icon"
            title="Required: fund, 6 digits"
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
            title="Optional: Organization, 4 digits"
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
            title="Required: Account number, 4 digits"
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
            <option v-for="acctNo in accountNumbers" :value="acctNo.number">
              {{ acctNo.number }} - {{ acctNo.description }}
            </option>
          </datalist>
          <ErrorMessage name="acct-input" class="error-field" />
        </span>
      </div>
      <h5>-</h5>

      <div class="input-FOAPA-field">
        <span class="foapa-title-span">
          <label for="foapa-name">Program</label>
          <img
            src="../../assets/user-help-icon.png"
            alt="Help"
            class="foapa-help-icon"
            title="Optional: Program, 4 digits"
          />
        </span>
        <span class="input-FOAPA-field-span">
          <Field
            type="text"
            name="prog-input"
            id="prog-input"
            placeholder="xxxx"
            :rules="isValidFoapaNumber"
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
            title="Optional: Activity, 4 digits"
          />
        </span>
        <span class="input-FOAPA-field-span">
          <Field
            type="text"
            name="actv-input"
            :rules="isValidFoapaNumber"
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
      <tr style="text-align: left">
        <th>Name</th>
        <th>Amount</th>
        <th>FUND</th>
        <th>ORG</th>
        <th>ACCT</th>
        <th>PROG</th>
        <th>ACTV</th>
        <th></th>
      </tr>
      <tr v-for="foapa in props.foapaDetails">
        <td>
          {{ foapa.foapaName }}
        </td>
        <td>
          {{ foapa.initialAmount ? `$${foapa.initialAmount}` : "N/A" }}
        </td>
        <td>{{ foapa.fund }}</td>
        <td>{{ foapa.organization || "N/A" }}</td>
        <td>{{ foapa.account }}</td>
        <td>{{ foapa.program || "N/A" }}</td>
        <td>{{ foapa.activity || "N/A" }}</td>
        <td>
          <img
            src="../../assets/trash-icon.png"
            alt="Trash"
            class="delete-icon"
            @click="deleteFoapa(foapa.foapaName, foapa.fund)"
          />
        </td>
      </tr>
    </table>
  </section>
</template>

<script setup lang="ts">
import { Form, Field, ErrorMessage } from "vee-validate";
import { ref, reactive, onMounted } from "vue";
import { FoapaStuff } from "../../types/types";
import {
  isValidString,
  isValidFundNumber,
  isValidAccountNumber,
  isValidFoapaNumber,
  isValidFoapaAmount,
} from "../../utils/validators";
import axios from "axios";
let props = defineProps<{ foapaDetails: FoapaStuff[] }>();
let currentlyInputtedFOAPA = reactive<FoapaStuff>({
  fund: "",
  organization: "",
  account: "",
  program: "",
  activity: "",
  foapaName: "",
  initialAmount: "",
  currentAmount: "",
});

let accountNumbers = ref<{ number: string; description: string }[]>([]);

function retrieveAccountNumbers() {
  axios
    .get("http://localhost:8080/api/retrieveAccountNumbers")
    .then((res) => {
      accountNumbers.value = res.data.accountNumbers;
    })
    .catch((err) => {
      console.log(err);
    });
}

function addFoapa(values, { resetForm }) {
  resetForm();
  currentlyInputtedFOAPA.currentAmount = currentlyInputtedFOAPA.initialAmount;
  let addedFoapa = Object.assign({}, currentlyInputtedFOAPA);
  props.foapaDetails.push(addedFoapa);
}

function deleteFoapa(foapaName, fund) {
  let index = props.foapaDetails.findIndex(
    (foapa) => foapa.foapaName === foapaName && foapa.fund === fund
  );

  if (index > -1) {
    props.foapaDetails.splice(index, 1);
  }
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
