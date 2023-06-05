<template>
  <div>
    <div class="foapa-numbers-label">
      <label for="foapa-numbers"
        >FOAPA [ FUND - ORG - ACCT - PROG - ACTV ]:</label
      >
    </div>
    <br />
    <div class="input-field-foapa-wrapper" style="text-align: center">
      <div class="input-FOAPA-field">
        <label for="foapa-name">FOAPA Name*</label>
        <input
          type="text"
          style="width: 150px"
          placeholder="Name"
          name="FOAPA Name"
          id="foapa-name"
          v-model="currentlyInputtedFOAPA.foapaName"
        />
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

        <input
          type="text"
          name="F input"
          id="f-input"
          placeholder="xxxxxx"
          v-model="currentlyInputtedFOAPA.fNumber"
        />
      </div>
      <h5>-</h5>

      <div class="input-FOAPA-field">
        <label for="foapa-name">ORG*</label>

        <input
          type="text"
          name="O input"
          id="o-input"
          placeholder="xxxx"
          v-model="currentlyInputtedFOAPA.oNumber"
        />
      </div>
      <h5>-</h5>
      <div class="input-FOAPA-field">
        <label for="foapa-name">ACCT*</label>

        <input
          type="text"
          name="A input"
          id="a-input"
          placeholder="xxxx"
          v-model="currentlyInputtedFOAPA.aNumber"
        />
      </div>
      <h5>-</h5>

      <div class="input-FOAPA-field">
        <label for="foapa-name">PROG*</label>

        <input
          type="text"
          name="P input"
          id="p-input"
          placeholder="xxxx"
          v-model="currentlyInputtedFOAPA.pNumber"
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
          v-model="currentlyInputtedFOAPA.a2Number"
        />
      </div>
      <button
        class="add-foapa-button"
        type="button"
        @click="addFoapa"
        style="width: auto"
      >
        <img
          src="../../assets/add-icon.png"
          alt="add-icon"
          style="width: 15px"
        />
      </button>
    </div>
    <br />
    <section class="" style="width: auto">
      <!-- <div v-for="(foapa, index) in foapaList" class="signup-page-foapa">
        <img
          src="../../assets/trash-icon.png"
          alt="Trash"
          class="delete-icon"
          @click="deleteFoapa(foapa.foapaName, foapa.fNumber)"
          style="width: 15px; margin-right: 15px; cursor: pointer"
        />
        <h3 style="margin-right: 15px; font-weight: 500">#{{ index + 1 }}</h3>
        <h3>{{ foapa.foapaName }} : {{ foapa.fNumber }}</h3>
        <h3>-</h3>
        <h3>{{ foapa.oNumber }}</h3>
        <h3>-</h3>
        <h3>{{ foapa.aNumber }}</h3>
        <h3>-</h3>
        <h3>{{ foapa.pNumber }}</h3>
        <h3 v-if="foapa.a2Number">-</h3>
        <h3 v-if="foapa.a2Number">{{ foapa.a2Number }}</h3>
        <h3 style="margin-right: 10px">;</h3>
        <h3>Initial Amount: ${{ foapa.initialAmount }}</h3>
      </div> -->
      <table
        style="
          width: 95%;
          border: 1px solid rgba(246, 246, 246, 0.44);
          padding: 13px 28px;
          border-spacing: 10px;
          box-shadow: 0 2px 2px #5353532b;
          border-radius: 5px;
        "
      >
        <tr style="text-align: left">
          <th>FOAPA Name</th>
          <th>Amount</th>
          <th>FUND</th>
          <th>ORG</th>
          <th>ACCT</th>
          <th>PROG</th>
          <th>ACTV</th>
          <th></th>
        </tr>
        <tr v-for="foapa in foapaList">
          <td>
            {{ foapa.foapaName }}
          </td>
          <td>
            <span v-if="foapa.initialAmount !== 'N/A'">$</span
            >{{ foapa.initialAmount }}
          </td>
          <td>{{ foapa.fNumber }}</td>
          <td>{{ foapa.oNumber }}</td>
          <td>{{ foapa.aNumber }}</td>
          <td>{{ foapa.pNumber }}</td>
          <td>{{ foapa.a2Number || "N/A" }}</td>
          <td>
            <img
              src="../../assets/trash-icon.png"
              alt="Trash"
              class="delete-icon"
              @click="deleteFoapa(foapa.foapaName, foapa.fNumber)"
              style="width: 15px; margin-left: 15px; cursor: pointer"
            />
          </td>
        </tr>
      </table>
    </section>
    <div class="continue-buttons" style="margin-top: 20px">
      <button
        class="signup-button"
        type="button"
        @click="regress"
        style="margin-top: 0px"
      >
        Go Back
      </button>
      <button
        class="signup-button"
        @click="$emit('finish')"
        style="margin-top: 0px"
      >
        Create Account
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { FoapaStuff } from "../../types/types";
import { reactive } from "vue";
let { foapaList } = defineProps<{
  foapaList: FoapaStuff[];
}>();

let currentlyInputtedFOAPA = reactive<FoapaStuff>({
  fNumber: "",
  oNumber: "",
  aNumber: "",
  pNumber: "",
  a2Number: "",
  foapaName: "",
  initialAmount: "",
  currentAmount: "",
});

const emits = defineEmits(["finish", "goBack"]);

function deleteFoapa(foapaName, fNumber) {
  let index = foapaList.findIndex(
    (foapa) => foapa.foapaName === foapaName && foapa.fNumber === fNumber
  );

  if (index > -1) {
    foapaList.splice(index, 1);
  }
}

function addFoapa() {
  const foapaFields = ["fNumber", "oNumber", "aNumber", "pNumber"];

  if (currentlyInputtedFOAPA.initialAmount === "") {
    currentlyInputtedFOAPA.initialAmount = "N/A";
    currentlyInputtedFOAPA.currentAmount = "N/A";
  }

  // Refactor later :*)
  for (let i = 0; i < foapaFields.length; i++) {
    if (currentlyInputtedFOAPA[foapaFields[i]] === "") {
      console.log(foapaFields[i]);
      alert("Some FOAPA information is missing, please try again.");
      break;
    }

    if (isNaN(currentlyInputtedFOAPA[foapaFields[i]])) {
      alert("FOAPA fields only accept numbers");
      break;
    }
    if (currentlyInputtedFOAPA.fNumber.length !== 6) {
      alert("FUND value can only accept 6 digits");
      break;
    }
    if (currentlyInputtedFOAPA.oNumber.length !== 4) {
      alert("ORG value can only accept 4 digits");
      break;
    }
    if (currentlyInputtedFOAPA.aNumber.length !== 4) {
      alert("ACCT value can only accept 4 digits");
      break;
    }
    if (currentlyInputtedFOAPA.pNumber.length !== 4) {
      alert("PROG value can only accept 4 digits");
      break;
    }

    if (i === foapaFields.length - 1) {
      let currentFoapa = Object.assign({}, currentlyInputtedFOAPA);
      foapaList.push(currentFoapa);
      currentlyInputtedFOAPA.foapaName =
        currentlyInputtedFOAPA.currentAmount =
        currentlyInputtedFOAPA.initialAmount =
        currentlyInputtedFOAPA.fNumber =
        currentlyInputtedFOAPA.oNumber =
        currentlyInputtedFOAPA.aNumber =
        currentlyInputtedFOAPA.pNumber =
        currentlyInputtedFOAPA.a2Number =
          "";
    }
  }
}

function regress() {
  emits("goBack");
}
</script>

<style scoped>
@import url("../../assets/styles/signup-page.css");
</style>
