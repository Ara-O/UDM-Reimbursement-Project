<template>
    <span class="flex items-center gap-6 mb-2">
        <h2 class="font-semibold my-0 text-[27px]">Add or View Expenses</h2>
        <img src="../../assets/edit-icon.png" alt="Edit icon" class="w-7">
    </span>
    <h4 class="font-medium text-gray-600 mb-1 text-sm">Or try our experimental <u class="cursor-pointer">Quick Add</u>
        feature</h4>

    <form @submit.prevent="addExpense">
        <div class="flex gap-14">
            <span>
                <h4 class="font-normal text-sm">Expense Name</h4>
                <input type="text" list="default-list" name="expense-name" placeholder="Expense Name" v-model="expense.name"
                    class="border-[0.5px] h-11 rounded-md border-gray-200 w-72 box-border pl-5 text-xs border-solid shadow-md"
                    required>
                <datalist id="default-list">
                    <option :value="expense" v-for="expense in defaultExpenses">
                        {{ expense }}
                    </option>
                </datalist>
            </span>
            <span>
                <h4 class="font-normal text-sm">Expense Cost</h4>
                <input type="text" name="expense-cost" placeholder="$ Expense Cost" v-model="expense.cost"
                    class="border-[0.5px] h-11 rounded-md border-gray-200 w-72 box-border pl-5 text-xs border-solid shadow-md"
                    required>
            </span>
        </div>
        <div>
            <span>
                <h4 class="font-normal text-sm">Activity Date</h4>
                <input type="date" name="activity-date" placeholder="Activity Date" v-model="expense.date"
                    class="border-[0.5px] h-11 rounded-md border-gray-200 w-72 box-border px-5 text-xs border-solid shadow-md"
                    required>
            </span>
        </div>
        <h4 class="text-[13px] font-light text-gray-700 leading-7 w-auto max-w-[40rem]"> By adding an activity; I hereby
            certify that this claim is correct and reimbursable under published travel expense Policies & Procedures of UDM
        </h4>

        <div class="flex gap-5">
            <button type="submit"
                class=" bg-udmercy-blue text-white border-none w-40 h-11 rounded-full cursor-pointer text-xs">Add
                Expense</button>
            <button class=" bg-udmercy-blue text-white border-none w-40 h-11 rounded-full cursor-pointer text-xs">Next
                Section</button>
        </div>
    </form>

    <h4 class="underline font-semibold text-lg text-gray-800">All Expenses</h4>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { ReimbursementTicket, Expense } from '../../types/types';
import { generateRandomStringId } from '../../utils/generateRandomId';

const props = defineProps<{
    claim: ReimbursementTicket
}>()

let expense = ref<Expense>({
    name: "Lunch",
    cost: 120,
    date: "2023-12-12",
    id: generateRandomStringId(24)
})

const defaultExpenses = [
    "Air/Train",
    "Breakfast",
    "Business Guest Meals",
    "Dinner",
    "Lodging",
    "Lunch",
    "Mileage",
    "Other",
    "Parking",
    "Registration",
    "Taxi/Bus/Car Rental",
];

function addExpense() {
    props.claim.activities.push(expense.value)
}


</script>