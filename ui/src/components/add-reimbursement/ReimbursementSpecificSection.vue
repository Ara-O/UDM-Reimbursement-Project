<template>
  <div class="reimbursement-title">
    <input
      class="reimbursement-title-text"
      v-model="currentReimbursement.reimbursementName"
      placeholder="Reimbursement Title"
    />
    <img
      src="../../assets/edit-icon.png"
      class="edit-icon-button"
      alt="Edit icon"
    />
  </div>
  <h3 style="margin-top: 0px">Reimbursement Ticket Information</h3>
  <div style="display: flex; column-gap: 40px; row-gap: 20px; flex-wrap: wrap">
    <span>
      <h3 style="font-size: 14.5px">Reason for Travel/Expense:</h3>
      <input
        name="expenseReason"
        v-model="currentReimbursement.reimbursementReason"
        class="input-field"
      />
    </span>
    <span>
      <h3 style="font-size: 14.5px">Destination-City,State,Country:</h3>
      <input
        name="expenseReason"
        v-model="currentReimbursement.destination"
        class="input-field"
      />
    </span>
  </div>
  <br />
  <div style="display: flex; column-gap: 30px; row-gap: 20px; flex-wrap: wrap">
    <span style="display: flex; gap: 3px">
      <input
        type="radio"
        value="Hold for Pickup"
        id="hold-for-pickup"
        v-model="currentReimbursement.paymentRetrievalMethod"
      />
      <label for="hold-for-pickup" style="font-size: 14px"
        >Hold for Pickup</label
      >
    </span>
    <span style="display: flex; gap: 7px">
      <input
        type="radio"
        value="Direct Deposit"
        id="direct-deposit"
        v-model="currentReimbursement.paymentRetrievalMethod"
      />
      <label for="direct-deposit" style="font-size: 14px">Direct Deposit</label>
    </span>
    <span style="display: flex; gap: 7px">
      <input
        type="checkbox"
        id="udmpu-voucher"
        v-model="currentReimbursement.UDMPUVoucher"
      />
      <label for="udmpu-voucher" style="font-size: 14px"
        >Check if using UDMPU 11.6 voucher (please attach voucher/log)</label
      >
    </span>
  </div>
  <section class="upload-receipts-section">
    <h3 class="upload-receipts-here">Upload all receipts here</h3>
    <div style="display: flex; flex-wrap: wrap; column-gap: 20px">
      <div style="display: flex; align-items: center">
        <div style="display: flex; flex-direction: column">
          <input
            type="file"
            id="receipt"
            class="custom-file-input"
            ref="receiptRef"
            name="receipt"
            @change="receiptAdded"
            accept="image/png, image/jpeg"
            multiple
          />
          <h3 v-if="fileWasSelected" style="font-size: 13px">File chosen</h3>
        </div>
        <button
          class="save-uploaded-receipts-button"
          @click="storeReceiptImages"
        >
          Save uploaded receipts
        </button>
      </div>
      <div style="display: flex; gap: 30px; align-items: flex-start">
        <a
          :href="(receipt as string)"
          target="_blank"
          style="display: flex; gap: 30px"
          v-for="receipt in currentReimbursement.reimbursementReceipts"
        >
          <img
            :src="(receipt as string)"
            style="
              width: 40px;
              aspect-ratio: 1/1;
              border-radius: 5px;
              cursor: pointer;
            "
          />
        </a>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ReimbursementTicket } from "../../types/types";
import { toRefs, ref } from "vue";
import axios from "axios";
let props = defineProps<{ currentReimbursement: ReimbursementTicket }>();

const { currentReimbursement } = toRefs(props);
let fileWasSelected = ref<boolean>(false);
const receiptRef = ref(null);

function receiptAdded() {
  fileWasSelected.value = true;
  console.log(receiptRef.value);
  // @ts-ignore
  const files = receiptRef.value.files;
  console.log(files);
}

async function storeReceiptImages() {
  let formData = new FormData();

  //@ts-ignore
  const files = receiptRef.value.files;
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    formData.append("receipt", file);
  }

  if (files.length > 0) {
    try {
      // Send the FormData object to the server using axios
      let res = await axios.post(
        "http://localhost:8080/api/storeReceiptImages",
        formData
      );
      fileWasSelected.value = false;

      if (currentReimbursement.value.reimbursementReceipts.length === 0) {
        currentReimbursement.value.reimbursementReceipts = res.data;
      } else {
        currentReimbursement.value.reimbursementReceipts.push(...res.data);
      }
    } catch (err) {
      console.log(err);
    }
  } else {
    return [];
  }
}
</script>

<style scoped>
@import url("../../assets/styles/add-reimbursement-page.css");
</style>
