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
        <label for="foapa-name">Name*</label>
        <span>
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
        <label for="foapa-name">Amount</label>
        <input
          type="text"
          style="width: 95px"
          placeholder="Amount"
          name="Amount"
          id="foapa-amount"
          v-model="currentlyInputtedFOAPA.initialAmount"
        />
      </div>
      <h5>:</h5>

      <div class="input-FOAPA-field">
        <label for="foapa-name">FUND*</label>
        <span>
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
        <label for="foapa-name">ORG</label>

        <input
          type="text"
          name="O input"
          id="o-input"
          placeholder="xxxx"
          v-model="currentlyInputtedFOAPA.organization"
        />
      </div>
      <h5>-</h5>
      <div class="input-FOAPA-field">
        <label for="foapa-name">ACCT*</label>

        <span>
          <Field
            type="text"
            name="acct-input"
            id="acct-input"
            :rules="isValidAccountNumber"
            list="account-no"
            placeholder="xxxx"
            v-model="currentlyInputtedFOAPA.account"
          />
          <ErrorMessage name="acct-input" class="error-field" />
        </span>
        <datalist id="account-no">
          <option v-for="acctNo in accountNumbers" :value="acctNo.number">
            {{ acctNo.number }} - {{ acctNo.description }}
          </option>
        </datalist>
      </div>
      <h5>-</h5>

      <div class="input-FOAPA-field">
        <label for="foapa-name">PROG</label>

        <input
          type="text"
          name="P input"
          id="p-input"
          placeholder="xxxx"
          v-model="currentlyInputtedFOAPA.program"
        />
      </div>
      <h5>-</h5>
      <div class="input-FOAPA-field">
        <label for="foapa-name">ACTV</label>

        <input
          type="text"
          name="A2 input"
          id="a2-input"
          placeholder="xxxx"
          v-model="currentlyInputtedFOAPA.activity"
        />
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
      <tr v-for="foapa in props.foapaList">
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
  isValidNumber,
} from "../../utils/validators";
import axios from "axios";
let props = defineProps<{ foapaList: FoapaStuff[] }>();
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

function addFoapa() {
  let addedFoapa = Object.assign({}, currentlyInputtedFOAPA);
  props.foapaList.push(addedFoapa);
}

function deleteFoapa(foapaName, fund) {
  let index = props.foapaList.findIndex(
    (foapa) => foapa.foapaName === foapaName && foapa.fund === fund
  );

  if (index > -1) {
    props.foapaList.splice(index, 1);
  }
}

onMounted(() => {
  retrieveAccountNumbers();
});
</script>

<style scoped>
@import url("../../assets/styles/manage-foapa.css");
</style>
