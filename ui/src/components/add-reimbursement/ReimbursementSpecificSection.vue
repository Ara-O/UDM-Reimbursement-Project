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
  <div style="display: flex; column-gap: 40px; row-gap: 20px">
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
  <div style="display: flex; column-gap: 30px; row-gap: 20px">
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
</template>

<script setup lang="ts">
import { ReimbursementTicket } from "../../types/types";
import { toRefs, ref } from "vue";
let props = defineProps<{ currentReimbursement: ReimbursementTicket }>();

const { currentReimbursement } = toRefs(props);
</script>

<style scoped>
@import url("../../assets/styles/add-reimbursement-page.css");
</style>
