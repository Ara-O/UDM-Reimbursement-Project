<template>
  <section class="xl:w-auto mx-10 sm:mx-20 xl:ml-0">
    <span class="flex items-center gap-6 mb-2">
      <h2 class="font-semibold my-0 text-[27px]">
        Reimbursement Claim Information
      </h2>
      <img
        src="../../assets/edit-icon.png"
        alt="Edit icon"
        class="w-7 hidden md:block"
      />
    </span>

    <form @submit.prevent="moveToNextSection">
      <div class="flex gap-x-16 gap-y-3 flex-wrap">
        <span>
          <h4 class="font-normal text-sm">Title of Reimbursement *</h4>
          <input
            type="text"
            name="name"
            placeholder="Title of Reimbursement"
            v-model="props.claim.reimbursementName"
            required
            class="border-[0.5px] h-11 rounded-md border-gray-200 w-72 box-border pl-5 text-xs border-solid shadow-md"
          />
        </span>
        <span>
          <h4 class="font-normal text-sm">Reason for Travel/Expense</h4>
          <input
            type="text"
            name="reason-or-expense-input"
            placeholder="Reason for Travel/Expense"
            v-model="props.claim.reimbursementReason"
            class="border-[0.5px] h-11 rounded-md border-gray-200 w-72 box-border pl-5 text-xs border-solid shadow-md"
          />
        </span>
        <span>
          <h4 class="font-normal text-sm">Destination-City, State, Country</h4>
          <input
            type="text"
            name="destination-city-state-input"
            v-model="props.claim.destination"
            placeholder="Destination-City, State, Country"
            class="border-[0.5px] h-11 rounded-md border-gray-200 w-72 box-border pl-5 text-xs border-solid shadow-md"
          />
        </span>
      </div>
      <div class="mt-7 flex gap-4">
        <label for="check-if-udmpu-checkbox" class="text-sm font-normal"
          >Check if using UDMPU 11.6 voucher (please attach voucher/log)</label
        >
        <input
          type="checkbox"
          v-model="props.claim.UDMPUVoucher"
          id="check-if-udmpu-checkbox"
        />
      </div>
      <div class="text-sm mt-7">
        <span>
          <label for="pickup">Hold for pickup</label>
          <input
            type="radio"
            id="pickup"
            name="payment-type"
            value="Hold for Pickup"
            v-model="props.claim.paymentRetrievalMethod"
          />
        </span>
        <span class="ml-5">
          <label for="direct-deposit">Direct Deposit</label>
          <input
            type="radio"
            id="direct-deposit"
            name="payment-type"
            value="Direct Deposit"
            v-model="props.claim.paymentRetrievalMethod"
          />
        </span>
      </div>
      <button
        type="submit"
        class="mt-7 bg-udmercy-blue text-white border-none w-40 h-11 rounded-full cursor-pointer text-xs"
        style="display:flex; justify-content: space-around; align-items:center;"
        >
          Next Section
          <img src="../../assets/next-arrow.png" class="w-4">
      </button>
    </form>
  </section>
</template>

<script lang="ts" setup>
import { ReimbursementTicket } from "../../types/types";

const emits = defineEmits(["move-to-next-section"]);
const props = defineProps<{ claim: ReimbursementTicket }>();

function moveToNextSection() {
  emits("move-to-next-section");
}
</script>
