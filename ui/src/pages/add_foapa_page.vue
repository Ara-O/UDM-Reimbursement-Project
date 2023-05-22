<template>
  <section class="add-foapa-page">
    <div>
      <img
        src="../assets/detroit-mercy-logo.png"
        class="udmercy-logo"
        alt="Detroit mercy logo"
      />
    </div>
    <div>
      <h3 class="add-foapa-title">Manage FOAPA</h3>
      <div>
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
            v-model="userFoapaStuff.foapaName"
          />
        </div>
        <div class="input-FOAPA-field">
          <label for="foapa-name">Amount*</label>
          <input
            type="text"
            style="width: 150px"
            placeholder="Amount"
            name="Amount"
            id="foapa-amount"
            v-model="userFoapaStuff.initialAmount"
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
            v-model="userFoapaStuff.fNumber"
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
            v-model="userFoapaStuff.oNumber"
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
            v-model="userFoapaStuff.aNumber"
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
        <button class="update-foapa-button" type="button" @click="addFoapa">
          <img
            src="../assets/add-icon.png"
            alt="add-icon"
            style="width: 15px"
          />
        </button>
      </div>
      <br />
      <div class="added-foapa-number" v-for="(foapa, index) in foapaList">
        <span>
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
          <h3 style="padding-left: 10px">
            -> Initial amount: ${{ foapa.initialAmount }}
          </h3>
          <h3 style="padding-left: 10px">
            -> Current amount: ${{ foapa.currentAmount }}
          </h3>
        </span>
        <!-- <h3>Initial amount:</h3> -->
        <!-- <img
          src="../assets/trash-icon.png"
          alt="Trash"
          class="delete-icon"
          @click="deleteFoapa(foapa.foapaName, foapa.fNumber)"
          style="width: 15px; margin-left: 15px; cursor: pointer"
          /> -->
      </div>
      <div style="display: flex; gap: 22px">
        <button class="add-foapa-button" @click="$router.push('/dashboard')">
          Discard Changes
        </button>
        <button class="add-foapa-button" @click="updateFoapa">
          Save FOAPAs
        </button>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import axios from "axios";
import { reactive, ref, onMounted } from "vue";
import { FoapaStuff } from "../types/types";
import router from "../router";

let foapaList = ref<FoapaStuff[]>([]);

let userFoapaStuff = reactive<FoapaStuff>({
  fNumber: "3323333",
  oNumber: "1111",
  aNumber: "4242",
  pNumber: "4324",
  a2Number: "4324",
  foapaName: "4644",
  initialAmount: "3566",
  currentAmount: "",
});

// function deleteFoapa(foapaName, fNumber) {
//   axios
//     .post("/api/deleteFoapaNumber")
//     .then(() => {
//       foapaList.value = foapaList.value.filter(
//         (foapa) => foapa.foapaName !== foapaName || foapa.fNumber !== fNumber
//       );
//     })
//     .catch((err) => {
//       console.log(err);
//       alert(err.response.data.message);
//     });
// }

function addFoapa() {
  //refactor- looks ugle
  const foapaFields = ["fNumber", "oNumber", "aNumber", "pNumber", "a2Number"];
  for (let i = 0; i < foapaFields.length; i++) {
    if (userFoapaStuff[foapaFields[i]] === "") {
      alert("Some FOAPA information is missing, please try again.");
      break;
    }

    if (isNaN(userFoapaStuff[foapaFields[i]])) {
      alert("FOAPA fields only accept numbers");
      break;
    }

    if (userFoapaStuff.fNumber.length !== 6) {
      alert("FUND value can only accept 6 digits");
      break;
    }
    if (userFoapaStuff.oNumber.length !== 4) {
      alert("ORG value can only accept 4 digits");
      break;
    }
    if (userFoapaStuff.aNumber.length !== 4) {
      alert("ACCT value can only accept 4 digits");
      break;
    }
    if (userFoapaStuff.pNumber.length !== 4) {
      alert("PROG value can only accept 4 digits");
      break;
    }

    if (i === foapaFields.length - 1) {
      let currentFoapa = reactive<FoapaStuff>({
        fNumber: userFoapaStuff.fNumber,
        oNumber: userFoapaStuff.oNumber,
        aNumber: userFoapaStuff.aNumber,
        pNumber: userFoapaStuff.pNumber,
        a2Number: userFoapaStuff.a2Number,
        foapaName: userFoapaStuff.foapaName,
        initialAmount: userFoapaStuff.initialAmount,
        currentAmount: userFoapaStuff.initialAmount,
      });

      foapaList.value.push(currentFoapa);

      userFoapaStuff.foapaName =
        userFoapaStuff.initialAmount =
        userFoapaStuff.currentAmount =
        userFoapaStuff.fNumber =
        userFoapaStuff.oNumber =
        userFoapaStuff.aNumber =
        userFoapaStuff.pNumber =
        userFoapaStuff.a2Number =
          "";
    }
  }
}

function updateFoapa() {
  axios
    .post("/api/updateFoapaDetails", {
      foapaData: foapaList.value,
    })
    .then((res) => {
      alert(res.data.message);
      router.push("/dashboard");
    })
    .catch((err) => {
      console.log(err);
      alert(err.response.data.message);
    });
}

function retrieveFoapaDetails() {
  //REFACTOR
  axios
    .get(`/api/retrieveFoapaDetails`)
    .then((res) => {
      res.data.forEach((foapa) => {
        let foapaEdited: FoapaStuff = {
          fNumber: "",
          oNumber: "",
          aNumber: "",
          pNumber: "",
          a2Number: "",
          foapaName: "",
          currentAmount: "",
          initialAmount: "",
        };

        foapaEdited.foapaName = foapa.foapaName;
        foapaEdited.initialAmount = foapa.initialAmount;
        foapaEdited.currentAmount = foapa.currentAmount;
        let foapaData = foapa.foapaNumber.split("-");
        foapaEdited.fNumber = foapaData[0];
        foapaEdited.oNumber = foapaData[1];
        foapaEdited.aNumber = foapaData[2];
        foapaEdited.pNumber = foapaData[3];
        foapaEdited.a2Number = foapaData[4];

        foapaList.value.push(foapaEdited);
      });
      //   let foapaData = (foapaList.value = res.data);
    })
    .catch((err) => {
      console.log(err);
      alert(err);
    });
}

onMounted(() => {
  retrieveFoapaDetails();
});
</script>

<style scoped>
@import url("../assets/styles/add-foapa-page.css");
</style>
