<template>
  <div>
    <div>
      <label for="foapa-numbers"
        >FOAPA [ FUND - ORG - ACCT - PROG - ACTV ]:</label
      >
    </div>
    <br />
    <div class="input-field-foapa-wrapper" style="text-align: center">
      <div class="input-FOAPA-field">
        <label for="foapa-name">FOAPA Name</label>
        <input
          type="text"
          style="width: 150px"
          placeholder="Name"
          name="FOAPA Name"
          id="foapa-name"
          v-model="userFoapaStuff.foapaName"
        />
      </div>
      <div class="input-FOAPA-field">
        <label for="foapa-name">Amount</label>
        <input
          type="text"
          style="width: 150px"
          placeholder="Amount"
          name="Amount"
          id="foapa-amount"
          v-model="userFoapaStuff.foapaAmount"
        />
      </div>
      <h5>:</h5>

      <div class="input-FOAPA-field">
        <label for="foapa-name">FUND</label>

        <input
          type="text"
          name="F input"
          id="f-input"
          placeholder="xxxxxx"
          v-model="userFoapaStuff.fNumber"
        />
      </div>
      <h5>-</h5>

      <div class="input-FOAPA-field">
        <label for="foapa-name">ORG</label>

        <input
          type="text"
          name="O input"
          id="o-input"
          placeholder="xxxx"
          v-model="userFoapaStuff.oNumber"
        />
      </div>
      <h5>-</h5>
      <div class="input-FOAPA-field">
        <label for="foapa-name">ACCT</label>

        <input
          type="text"
          name="A input"
          id="a-input"
          placeholder="xxxx"
          v-model="userFoapaStuff.aNumber"
        />
      </div>
      <h5>-</h5>

      <div class="input-FOAPA-field">
        <label for="foapa-name">PROG</label>

        <input
          type="text"
          name="P input"
          id="p-input"
          placeholder="xxxx"
          v-model="userFoapaStuff.pNumber"
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
          v-model="userFoapaStuff.a2Number"
        />
      </div>
      <button class="add-foapa-button" type="button" @click="addFoapa">
        <img
          src="../../assets/add-icon.png"
          alt="add-icon"
          style="width: 15px"
        />
      </button>
    </div>
    <br />
    <div
      v-for="(foapa, index) in foapaList"
      style="display: flex"
      class="added-foapa-number"
    >
      <h3 style="margin-right: 15px; font-weight: 500">#{{ index + 1 }}</h3>
      <h3>{{ foapa.foapaName }} : {{ foapa.fNumber }}</h3>
      <h3>-</h3>
      <h3>{{ foapa.oNumber }}</h3>
      <h3>-</h3>
      <h3>{{ foapa.aNumber }}</h3>
      <h3>-</h3>
      <h3>{{ foapa.pNumber }}</h3>
      <h3>-</h3>
      <h3>{{ foapa.a2Number }}, ${{ foapa.foapaAmount }}</h3>
    </div>
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

const { foapaList } = defineProps<{
  foapaList: FoapaStuff[];
}>();

let userFoapaStuff = reactive<FoapaStuff>({
  fNumber: "",
  oNumber: "",
  aNumber: "",
  pNumber: "",
  a2Number: "",
  foapaName: "",
  foapaAmount: "",
});

const emits = defineEmits(["finish", "goBack"]);

function addFoapa() {
  const foapaFields = ["fNumber", "oNumber", "aNumber", "pNumber", "a2Number"];
  for (let i = 0; i < foapaFields.length; i++) {
    if (userFoapaStuff[foapaFields[i]] === "") {
      alert("Some FOAPA information is missing, please try again.");
      break;
    }

    if (i === foapaFields.length - 1) {
      let currentFoapa = Object.assign({}, userFoapaStuff);
      foapaList.push(currentFoapa);
      userFoapaStuff.foapaName =
        userFoapaStuff.foapaAmount =
        userFoapaStuff.fNumber =
        userFoapaStuff.oNumber =
        userFoapaStuff.aNumber =
        userFoapaStuff.pNumber =
        userFoapaStuff.a2Number =
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
