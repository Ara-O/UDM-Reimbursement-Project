<template>
  <section class="add-receipt-section">
    <h3 style="font-weight: 600">Add Receipt</h3>
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
            v-for="receipt in props.currentReimbursement.reimbursementReceipts"
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
  </section>
</template>

<script lang="ts" setup>
import { ReimbursementTicket } from "../../types/types";
import axios from "axios";
import { ref } from "vue";

let fileWasSelected = ref<boolean>(false);
const receiptRef = ref(null);
let props = defineProps<{ currentReimbursement: ReimbursementTicket }>();

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

      if (props.currentReimbursement.reimbursementReceipts.length === 0) {
        props.currentReimbursement.reimbursementReceipts = res.data;
      } else {
        props.currentReimbursement.reimbursementReceipts.push(...res.data);
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
