<template>
    <span class="flex items-center gap-6 mb-2">
        <h2 class="font-semibold my-0 text-[27px]">Guest Information</h2>
        <img src="../../assets/edit-icon.png" alt="Edit icon" class="w-7">
    </span>
    <h4 class="font-normal leading-7 w-auto max-w-[600px] text-sm text-gray-600">Optional: This is for filling out the
        portion of the reimbursement related
        to getting reimbursed for guests
    </h4>
    <form @submit.prevent="addGuestInformation">
        <div class="flex gap-x-14 gap-y-3 max-w-[1000px] w-auto flex-wrap">
            <span>
                <h4 class="font-normal text-sm">Employee's First Name</h4>
                <input type="text" name="employer-first-name" placeholder="Employee's First Name"
                    v-model="guestInfo.employeeFirstName"
                    class="border-[0.5px] h-11 rounded-md border-gray-200 w-72 box-border px-5 text-xs border-solid shadow-md"
                    required>
            </span>
            <span>
                <h4 class="font-normal text-sm">Employee's Last Name</h4>
                <input type="text" name="employer-last-name" placeholder="Employee's Last Name"
                    v-model="guestInfo.employeeLastName"
                    class="border-[0.5px] h-11 rounded-md border-gray-200 w-72 box-border px-5 text-xs border-solid shadow-md"
                    required>
            </span>
            <span>
                <h4 class="font-normal text-sm">Guest's First Name</h4>
                <input type="text" name="guest-first-name" placeholder="Guest's First Name"
                    v-model="guestInfo.guestFirstName"
                    class="border-[0.5px] h-11 rounded-md border-gray-200 w-72 box-border px-5 text-xs border-solid shadow-md"
                    required>
            </span>
            <span>
                <h4 class="font-normal text-sm">Guest's Last Name</h4>
                <input type="text" name="guest-last-name" placeholder="Guest's Last Name" v-model="guestInfo.guestLastName"
                    class="border-[0.5px] h-11 rounded-md border-gray-200 w-72 box-border px-5 text-xs border-solid shadow-md"
                    required>
            </span>
            <span>
                <h4 class="font-normal text-sm">Association</h4>
                <input type="text" name="association" placeholder="Association" v-model="guestInfo.guestAssociation"
                    class="border-[0.5px] h-11 rounded-md border-gray-200 w-72 box-border px-5 text-xs border-solid shadow-md"
                    required>
            </span>
        </div>

        <div class="flex gap-8">
            <button type="submit"
                class=" bg-udmercy-blue mt-10 text-white border-none w-40 h-11 rounded-full cursor-pointer text-xs">Add
                Information</button>
            <button type="button" @click="emits('move-to-next-section')"
                class=" bg-udmercy-blue mt-10 text-white border-none w-40 h-11 rounded-full cursor-pointer text-xs">Next
                Section</button>
        </div>
    </form>

    <table class="border border-solid border-collapse mt-10 ">
        <tr>
            <th>Employee Name</th>
            <th>Guest Name</th>
            <th>Association</th>
        </tr>
        <tr v-for="guest in props.claim.guestInformation">
            <td>{{ guest.employeeFirstName + " " + guest.employeeLastName }} </td>
            <td>{{ guest.guestFirstName + " " + guest.guestLastName }} </td>
            <td>{{ guest.guestAssociation }} </td>
            <td>
                <img src="../../assets/edit-icon-red.png" alt="Edit icon" class="w-3 cursor-pointer">
                <img src="../../assets/trash-icon.png" alt="Delete icon" @click="deleteGuest(guest)"
                    class="w-3 ml-4 cursor-pointer">
            </td>
        </tr>
    </table>
</template>

<!-- TODO: MAKE USER NOT BE ABLE TO ADD DUPLICATE, ALSO EDIT -->
<script lang="ts" setup>
import { ReimbursementTicket, GuestInfo } from '../../types/types';
import { ref } from 'vue';
import { objectsAreEqual } from "../../utils/objectsAreEqual"

const emits = defineEmits(["move-to-next-section"])
const props = defineProps<{
    claim: ReimbursementTicket
}>()

let guestInfo = ref<GuestInfo>({
    employeeFirstName: "Bob",
    employeeLastName: "Bobbington",
    guestFirstName: "Jacque",
    guestLastName: "Jacqueson",
    guestAssociation: "Child"
})

function addGuestInformation() {
    if (!props.claim.guestInformation) {
        props.claim.guestInformation = []
    }

    if (props.claim?.guestInformation.length === 4) {
        alert("Maximum guests: 4");
        return
    }

    props.claim.guestInformation.push(JSON.parse(JSON.stringify(guestInfo.value)))
}

function deleteGuest(guest: GuestInfo) {
    props.claim.guestInformation = props.claim.guestInformation.filter((currGuest) => {
        return !objectsAreEqual(guest, currGuest)

    })
}

</script>

<style scoped>
th,
td {
    border: solid 1px rgb(104, 104, 104);
    padding: 7px 20px;
}

th {
    font-size: 14px;
    font-weight: 500;
}

td {
    font-size: 13px;
}
</style>