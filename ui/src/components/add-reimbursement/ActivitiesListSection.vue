<template>
  <h3 style="margin-top: 0px" class="all-activities-text">All Expenses</h3>
  <span class="activities-list">
    <ActivityContainer
      v-for="activity in props.currentReimbursement.activities"
      :activity="activity"
      @edit-activity="editActivity"
      @delete-activity="deleteActivity"
    />
  </span>
  <div class="cta-buttons">
    <button class="add-actvities-button" @click="saveReimbursement">
      Save Reimbursement Request
    </button>
    <button class="add-actvities-button" @click="createPdf">
      Preview Reimbursement Request
    </button>
    <button class="add-actvities-button" @click="submitTicket">
      Submit Reimbursement Request
    </button>
    <button class="add-actvities-button" @click="router.push('/dashboard')">
      Discard Changes
    </button>
    <h5
      style="font-weight: 400; margin-top: 2px; text-align: center"
      v-show="currentlyCreatingPDF"
    >
      Creating PDF, please wait, this may take a few seconds...
    </h5>
  </div>
</template>

<script lang="ts" setup>
import axios from "axios";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { ReimbursementTicket } from "../../types/types";
import parseDate from "../../utils/parseDate";
import ActivityContainer from "./ActivityContainer.vue";

let currentlyCreatingPDF = ref<boolean>(false);
const router = useRouter();
let props = defineProps<{
  currentReimbursement: ReimbursementTicket;
  userIsEditingReimbursement: Boolean;
}>();

let emits = defineEmits(["userIsEditingActivity", "userIsDeletingActivity"]);

function getAllActivitiesAmount(): number {
  let sum: number = 0;
  props.currentReimbursement.activities.forEach((activity) => {
    sum += Number(activity.cost);
  });
  return sum;
}

async function updateReimbursement() {
  if (props.currentReimbursement.reimbursementName.trim() === "") {
    alert("Reimbursement Title Missing");
    return;
  }

  props.currentReimbursement.totalCost = getAllActivitiesAmount();
  props.currentReimbursement.reimbursementDate = parseDate(
    new Date().toISOString()
  );

  await axios.post("http://localhost:8080/api/updateReimbursement", {
    reimbursementTicket: props.currentReimbursement,
  });
  alert("Reimbursement ticket saved successfully");
  router.push("/dashboard");
}

async function addReimbursement() {
  try {
    if (props.currentReimbursement.reimbursementName.trim() !== "") {
      props.currentReimbursement.totalCost = getAllActivitiesAmount();
      props.currentReimbursement.reimbursementDate = parseDate(
        new Date().toISOString()
      );

      await axios.post("http://localhost:8080/api/addReimbursement", {
        reimbursementTicket: props.currentReimbursement,
      });

      router.push("/dashboard");

      alert("Reimbursement saved successfully");
    } else {
      alert("Reimbursement Title Missing");
    }
  } catch (error) {
    console.log(error);
  }
}

function editActivity(activityId: number) {
  emits("userIsEditingActivity", activityId);
}

async function saveReimbursement() {
  props.currentReimbursement.reimbursementStatus = "In Progress";

  if (props.userIsEditingReimbursement === true) {
    updateReimbursement();
  } else {
    addReimbursement();
  }
}

function downloadPDF(pdfData: string) {
  const linkSource = pdfData;
  let iframe =
    "<iframe width='100%' height='100%' src='" + linkSource + "'></iframe>";
  let x = window.open();
  if (x != null) {
    x.document.open();
    x.document.write(iframe);
    x.document.close();

    // Remove padding from the iframe content
    x.document.querySelector("style") ||
      x.document.head.appendChild(x.document.createElement("style"));
    // @ts-ignore
    x.document.querySelector("style").textContent += `
  body, iframe {
    margin: 0;
    padding: 0;
    overflow: hidden
  }
`;
  }
}

async function submitTicket() {
  try {
    props.currentReimbursement.reimbursementStatus = "Submitted";

    await axios.post("http://localhost:8080/api/updateReimbursement", {
      reimbursementTicket: props.currentReimbursement,
    });

    router.push("/dashboard");
    alert("Reimbursement ticket submitted successfully");
  } catch (error) {
    console.log(error);
  }
}

function previewPDF(pdfData: string) {
  // TODO: Preview PDF
}

function createPdf() {
  if (props.currentReimbursement.activities.length === 0) {
    return alert("A minimum of one activity is needed to preview a ticket");
  }

  currentlyCreatingPDF.value = true;
  //Send user information

  for (let i = 0; i < props.currentReimbursement.activities.length; i++) {
    if (props.currentReimbursement.activities[i].activityReceipt === "") {
      alert("Warning: An activity without a receipt was added");
      break;
    }
  }

  axios
    .get(`http://localhost:8080/api/retrieveAccountInformation`)
    .then((response) => {
      props.currentReimbursement.totalCost = getAllActivitiesAmount();
      axios
        .get("http://localhost:8080/api/generatePdf", {
          params: {
            reimbursementData: props.currentReimbursement,
            userInfo: response.data,
          },
        })
        .then((res) => {
          downloadPDF(res.data);
          currentlyCreatingPDF.value = false;
        })
        .catch((err) => {
          console.log(err);
        });
    });
}

function deleteActivity(activityId: string) {
  console.log(activityId);
  props.currentReimbursement.activities =
    props.currentReimbursement.activities.filter(
      (activity) => activity.activityId != activityId
    );
}
</script>

<style scoped>
@import url("../../assets/styles/add-reimbursement-page.css");
</style>
