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
      <div class="add-foapa-title-descriptions">
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
          <td>{{ foapa.currentAmount }}</td>
          <td>{{ foapa.fNumber }}</td>
          <td>{{ foapa.oNumber }}</td>
          <td>{{ foapa.aNumber }}</td>
          <td>{{ foapa.pNumber }}</td>
          <td>{{ foapa.a2Number || "N/A" }}</td>
          <td>
            <img
              src="../assets/trash-icon.png"
              alt="Trash"
              class="delete-icon"
              @click="deleteFoapa(foapa)"
              style="width: 15px; margin-left: 15px; cursor: pointer"
            />
          </td>
        </tr>
      </table>
      <!-- <div class="added-foapa-number" v-for="(foapa, index) in foapaList">
        <span>
          <h3 style="margin-right: 15px; font-weight: 500">#{{ index + 1 }}</h3>
          <h3>: </h3>
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
        - <h3>Initial amount:</h3> -->
      <!-- 
      </div> -->
      <div class="add-foapa-button-wrapper">
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
import { useRouter } from "vue-router";

const router = useRouter();
let foapaList = ref<FoapaStuff[]>([]);

let userFoapaStuff = reactive<FoapaStuff>({
  fNumber: "",
  oNumber: "",
  aNumber: "",
  pNumber: "",
  a2Number: "",
  foapaName: "",
  initialAmount: "",
  currentAmount: "",
});

function deleteFoapa(foapaParameter) {
  console.log(foapaParameter);
  foapaList.value = foapaList.value.filter(
    (foapa) =>
      foapa.fNumber !== foapaParameter.fNumber ||
      foapa.foapaName !== foapaParameter.foapaName ||
      foapa.oNumber !== foapaParameter.oNumber ||
      foapa.aNumber !== foapaParameter.aNumber ||
      foapa.pNumber !== foapaParameter.pNumber ||
      (foapa.a2Number || "") !== (foapaParameter.a2Number || "")
  );
}

function addFoapa() {
  //refactor- looks ugle
  const foapaFields = ["fNumber", "oNumber", "aNumber", "pNumber"];
  for (let i = 0; i < foapaFields.length; i++) {
    if (userFoapaStuff[foapaFields[i]] === "") {
      console.log(foapaFields[i]);
      alert("Some FOAPA information is missing, please try again.");
      break;
    }

    if (isNaN(userFoapaStuff[foapaFields[i]])) {
      alert("FOAPA fields only accept numbers");
      break;
    }

    if (isNaN(Number(userFoapaStuff.a2Number))) {
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

    if (
      userFoapaStuff.a2Number.length > 0 &&
      userFoapaStuff.a2Number.length !== 4
    ) {
      alert("ACTV value can only accept 4 digits");
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

      let duplicate = foapaList.value.filter(
        (foapa) =>
          foapa.foapaName === currentFoapa.foapaName &&
          foapa.fNumber === currentFoapa.fNumber &&
          foapa.oNumber === currentFoapa.oNumber &&
          foapa.aNumber === currentFoapa.aNumber &&
          foapa.pNumber === currentFoapa.pNumber &&
          (foapa.a2Number || "" === currentFoapa.a2Number || "")
      );

      console.log(duplicate);
      if (duplicate.length > 0) {
        alert("That FOAPA number already exists");
      } else {
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
}

function updateFoapa() {
  axios
    .post("https://reimbursement-project.onrender.com/api/updateFoapaDetails", {
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
    .get(`https://reimbursement-project.onrender.com/api/retrieveFoapaDetails`)
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
