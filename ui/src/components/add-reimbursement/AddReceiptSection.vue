<template>
  <section class="add-receipt-section">
    <h3 style="font-weight: 600">Add Receipt</h3>
    <section class="upload-receipts-section">
      <h3 class="upload-receipts-here">Upload all receipts here</h3>
      <div style="display: flex; align-items: center; height: 40px">
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
        <h3 v-if="fileWasSelected" style="font-size: 13px">Uploading...</h3>
      </div>
      <br />
      <div class="receipt-preview">
        <h4
          v-if="props.currentReimbursement.reimbursementReceipts.length === 0"
          style="font-size: 13px; font-weight: 500; margin-top: 0px"
        >
          No Receipt has been uploaded
        </h4>
        <div
          class="receipt"
          v-for="(receipt, index) in props.currentReimbursement
            .reimbursementReceipts"
        >
          <img :src="(receipt.url as string)" />
          <span>
            <h3>Receipt #{{ index + 1 }}</h3>
            <span>
              <a :href="(receipt.url as string)" target="_blank">View </a>
              <button @click="deleteReceipt(receipt.id)">Delete</button>
            </span>
          </span>
        </div>
      </div>
      <h3
        style="margin-top: 0px; font-weight: 400; font-size: 14px"
        v-if="deletingReceipt"
      >
        Deleting..
      </h3>
      <br />
      <!-- <button
        class="save-uploaded-receipts-button"
        @click="storeReceiptImages"
        v-if="props.currentReimbursement.reimbursementReceipts.length !== 0"
      >
        Save uploaded receipts
      </button> -->
    </section>
  </section>
</template>

<script lang="ts" setup>
import { useRoute } from "vue-router";
import { Activity, ReimbursementTicket } from "../../types/types";
import axios from "axios";
import { ref } from "vue";

let fileWasSelected = ref<boolean>(false);
let deletingReceipt = ref<boolean>(false);
const receiptRef = ref(null);
const route = useRoute();
let props = defineProps<{ currentReimbursement: ReimbursementTicket }>();

async function receiptAdded() {
  fileWasSelected.value = true;
  console.log(receiptRef.value);
  // @ts-ignore
  const files = receiptRef.value.files;
  await storeReceiptImages();
  fileWasSelected.value = false;
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
        "https://udm-reimbursement-project.onrender.com/api/storeReceiptImages",
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

async function deleteReceipt(receiptId: String) {
  console.log(receiptId);

  try {
    deletingReceipt.value = true;
    let res = await axios.post(
      "https://udm-reimbursement-project.onrender.com/api/deleteReceiptImage",
      {
        receiptId,
        reimbursementId: route.query.reimbursementId,
      }
    );
    props.currentReimbursement.reimbursementReceipts =
      props.currentReimbursement.reimbursementReceipts.filter(
        (receipt) => receipt.id != receiptId
      );
    console.log(res);
    deletingReceipt.value = false;
  } catch (err) {
    console.log(err);
    deletingReceipt.value = false;
  }
}
</script>

<style scoped>
@import url("../../assets/styles/add-reimbursement-page.css");
</style>
