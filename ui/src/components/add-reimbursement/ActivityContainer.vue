<template>
  <div class="activity">
    <!-- <img src="../../assets/exclamation-mark.png" alt="Error" class="activity-error" v-if="activityHasError" -->
    <!-- title="Deleted/Updated FOAPA number is in use. Please reassign a FOAPA number" /> -->
    <h3 class="overflow-hidden text-ellipsis whitespace-nowrap" :title="expense.name">{{ expense.name }}</h3>
    <h4 class="overflow-hidden text-ellipsis whitespace-nowrap" :title="'' + expense.cost">
      Date: {{ parseDate(expense.date) }} || Cost:
      ${{ expense.cost }}
    </h4>
    <div class="activity-options-wrapper">
      <div title="Delete activity" class="activity-option" @click="$emit('deleteActivity', expense.id)">
        <img src="../../assets/trash-icon-white.png" alt="Trash icon" class="trash-icon" />
      </div>
      <div title="Edit activity" @click="$emit('editActivity', expense.id)" class="activity-option">
        <img src="../../assets/edit-icon.png" class="edit-icon-button invert w-4" alt="Edit icon" />
      </div>
      <div title="Duplicate activity" @click="$emit('duplicateActivity', expense.id)" class="activity-option">
        <img src="../../assets/duplicate-icon.png" class="edit-icon-button invert w-5" alt="Edit icon" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Expense } from "../../types/types";

const props = defineProps<{
  expense: Expense;
}>();


function parseDate(dateString: string) {
  const dateParsed = new Date(dateString);
  const year = dateParsed.getFullYear();
  const month = (dateParsed.getMonth() + 1).toString().padStart(2, '0'); // months are 0-indexed
  const day = dateParsed.getDate().toString().padStart(2, '0');

  const formattedDate = `${month}/${day}/${year}`;
  return formattedDate;
}

defineEmits(["deleteActivity", "editActivity", "duplicateActivity"]);

</script>

<style scoped>
@import url("../../assets/styles/add-reimbursement-page.css");
</style>
