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
                <input type="text" list="default-list" name="expense-name" placeholder="Expense Name"
                    v-model="expense.name"
                    class="border-[0.5px] h-11 rounded-md border-gray-200 w-72 box-border px-5 text-xs border-solid shadow-md"
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
                    class="border-[0.5px] h-11 rounded-md border-gray-200 w-72 box-border px-5 text-xs border-solid shadow-md"
                    required>
            </span>
        </div>
        <div class="flex gap-14">
            <span>
                <h4 class="font-normal text-sm">Activity Date</h4>
                <input type="date" name="activity-date" placeholder="Activity Date" v-model="expense.date"
                    class="border-[0.5px] h-11 rounded-md border-gray-200 w-72 box-border px-5 text-xs border-solid shadow-md"
                    required>
            </span>
            <span v-if="expense.name === 'Other'">
                <h4 class="font-normal text-sm">Additional Information</h4>
                <input type="text" name="additional-information" placeholder="Other..."
                    v-model="expense.additionalInformation"
                    class="border-[0.5px] h-11 rounded-md border-gray-200 w-72 box-border px-5 text-xs border-solid shadow-md"
                    required>
            </span>
        </div>
        <h4 class="text-[13px] font-light text-gray-700 leading-7 w-auto max-w-[40rem]"> By adding an activity; I hereby
            certify that this claim is correct and reimbursable under published travel expense Policies & Procedures of
            UDM
        </h4>

        <div class="flex gap-5">
            <button type="submit"
                class=" bg-udmercy-blue text-white border-none w-40 h-11 rounded-full cursor-pointer text-xs">Add
                Expense</button>
            <button type="button" @click="emits('move-to-next-section')"
                class="bg-udmercy-blue text-white border-none w-40 h-11 rounded-full cursor-pointer text-xs">Next
                Section</button>
        </div>
    </form>

    <!-- ALL EXPENSES SECTION -->
    <h4 class="underline font-semibold text-lg text-gray-800">All Expenses</h4>
    <div class="h-56 overflow-auto flex gap-10 flex-wrap custom-scroll-bar max-w-[1075px] w-auto">
        <div v-if="props.claim.activities.length === 0">
            <h5 class="mt-0 font-medium text-gray-500">Added expenses will be listed
                here. They will look like the one shown below</h5>
            <activity-container :expense="exampleExpense"></activity-container>
        </div>

        <activity-container :expense="expense" v-for=" expense in props.claim.activities"
            @delete-activity="deleteExpense" @edit-activity="editExpense"
            @duplicate-activity="duplicateExpense"></activity-container>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { ReimbursementTicket, Expense } from '../../types/types';
import ActivityContainer from './ActivityContainer.vue';
import { generateRandomStringId } from '../../utils/generateRandomId';

const props = defineProps<{
    claim: ReimbursementTicket
}>()

console.log(props.claim)

const emits = defineEmits(["move-to-next-section"])

const exampleExpense = ref({
    name: "Example",
    cost: 0,
    date: "2023-12-12",
    id: generateRandomStringId(24)
})

let expense = ref<Expense>({
    name: "",
    cost: 0,
    date: "",
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
    // Pushing a duplicate of the inputted expense to the main reimbursement data
    props.claim.activities.push(JSON.parse(JSON.stringify(expense.value)))
    expense.value = {
        name: "",
        cost: 0,
        date: "",
        id: generateRandomStringId(24)
    }
}

function deleteExpense(id: string) {
    props.claim.activities = props.claim.activities.filter((activity) => activity.id !== id)
}

function editExpense(id: string) {
    let activityToEdit = props.claim.activities.filter((activity) => activity.id === id)

    if (activityToEdit.length === 0) return;

    expense.value = activityToEdit[0]
    deleteExpense(activityToEdit[0].id)
}

function duplicateExpense(id: string) {
    let activityToDuplicate = props.claim.activities.filter((activity) => activity.id === id)

    if (activityToDuplicate.length === 0) return;

    let clone = JSON.parse(JSON.stringify(activityToDuplicate[0]))
    delete clone?._id
    clone.id = generateRandomStringId(24)
    expense.value = clone;
}

</script>

<style scoped>
.custom-scroll-bar::-webkit-scrollbar {
    width: 6px;
}

/* Track */
.custom-scroll-bar::-webkit-scrollbar-track {
    background: #f1f1f1;
}

/* Handle */
.custom-scroll-bar::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: #acacac;
}
</style>