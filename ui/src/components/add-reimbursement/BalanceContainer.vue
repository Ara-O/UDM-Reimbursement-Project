<template>
  <div class="balance mt-0">
    <span class="flex items-center gap-2">
      <h5 class="font-medium text-gray-500">FOAPA usage breakdown</h5>
      <img
        :src="HelpIcon"
        alt="Help"
        class="w-4"
        title="If your 'Remaining Coverage' is greater than 0, this means you have not
        fully covered the cost of all expenses. If your 'Remaining Coverage' is
        less than 0, this means you have assigned more money than needed to cover
        your expenses. Remaining coverage of $0 is ideal"
      />
    </span>

    <div
      class="rounded-md box-border px-5 w-80 h-auto border border-solid border-gray-300 py-6"
    >
      <div class="flex justify-between text-gray-600 h-10">
        <h4 class="text-sm font-normal mt-0">Total cost of all expenses</h4>
        <h4 class="text-sm font-normal mt-0">
          ${{
            calculateTotalExpenseCost === 0
              ? 0
              : calculateTotalExpenseCost.toFixed(2)
          }}
        </h4>
      </div>
      <div class="flex justify-between text-gray-600 h-10">
        <h4 class="text-sm font-normal mt-0">FOAPA Coverage</h4>
        <h4 class="text-sm font-normal mt-0">
          - ${{ calculateTotalFoapaCost }}
        </h4>
      </div>
      <div class="border border-solid w-full text-gray-300 bg-gray-200"></div>
      <div class="flex justify-between text-gray-600 h-10">
        <h4 class="text-sm font-normal">Remaining Coverage</h4>
        <h4 class="text-sm font-normal">${{ calculateBalance.toFixed(2) }}</h4>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import HelpIcon from "../../assets/user-help-icon.png";
import { ReimbursementTicket } from "../../types/types";

const props = defineProps<{
  claim: ReimbursementTicket;
}>();

const calculateTotalExpenseCost = computed(() => {
  return props.claim.activities.reduce((prev, curr) => {
    return prev + Number(curr.cost);
  }, 0);
});

const calculateTotalFoapaCost = computed(() => {
  let sum = 0;

  props.claim.foapaDetails.forEach((claim) => {
    sum += Number(claim.cost) * 100;
  });

  sum /= 100;

  return sum;
});

const calculateBalance = computed(
  () => calculateTotalExpenseCost.value - calculateTotalFoapaCost.value
);

defineEmits(["deleteActivity"]);
</script>

<style scoped>
@import url("../../assets/styles/add-reimbursement-page.css");
</style>
