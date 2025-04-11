<template>
  <div class="activity">
    <!-- <img src="../../assets/exclamation-mark.png" alt="Error" class="activity-error" v-if="activityHasError" -->
    <!-- title="Deleted/Updated FOAPA number is in use. Please reassign a FOAPA number" /> -->
    <h3
      class="overflow-hidden text-ellipsis whitespace-nowrap"
      :title="expense.name"
    >
      {{
        expense.name !== "Other"
          ? expense.name
          : "Other : " + expense.additionalInformation
      }}
      {{
        expense.name === "Mileage" ? ": " + expense.additionalInformation : ""
      }}
    </h3>
    <h4
      class="overflow-hidden text-ellipsis whitespace-nowrap"
      :title="'' + expense.cost"
    >
      Date: {{ convertDateToMMDDYYYY(expense.date) }} || Cost: ${{
        expense.cost
      }}
    </h4>
    <div class="activity-options-wrapper">
      <button
        title="Edit activity"
        @click="$emit('editActivity', expense.id)"
        :disabled="view_only_mode === true"
        class="activity-option !bg-white border-none disabled:cursor-default"
      >
        <img
          src="../../assets/blue-pencil.png"
          class="edit-icon-button w-4 disabled:cursor-default"
          alt="Edit icon"
        />
      </button>
      <button
        title="Duplicate activity"
        @click="$emit('duplicateActivity', expense.id)"
        class="activity-option !bg-white border-none disabled:cursor-default"
        :disabled="view_only_mode === true"
      >
        <img
          src="../../assets/duplicate-blue.png"
          class="edit-icon-button w-5 disabled:cursor-default"
          alt="Duplicate icon"
        />
      </button>
      <button
        title="Delete activity"
        class="activity-option border-none disabled:bg-gray-500"
        :disabled="view_only_mode === true"
        @click="$emit('deleteActivity', expense.id)"
      >
        <img
          src="../../assets/trash-icon-white.png"
          alt="Trash icon"
          class="trash-icon"
        />
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Expense } from "../../types/types";

const props = defineProps<{
  expense: Expense;
  view_only_mode: Boolean;
}>();

defineEmits(["deleteActivity", "editActivity", "duplicateActivity"]);

function convertDateToMMDDYYYY(date: string) {
  const [year, month, day] = date.split("-"); // Split the string by the hyphen

  // Return the formatted date string
  return `${month}-${day}-${year}`;
}
</script>

<style scoped>
@import url("../../assets/styles/add-reimbursement-page.css");

.disabled-icons {
  filter: brightness(300) invert(0) saturate(0) !important;
}
</style>
