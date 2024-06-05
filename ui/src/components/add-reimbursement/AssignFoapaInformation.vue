<template>
    <span class="flex items-center gap-6 mb-2">
        <h2 class="font-semibold my-0 text-[27px]">Assign FOAPA Information</h2>
        <img src="../../assets/edit-icon.png" alt="Edit icon" class="w-7">
    </span>

    <form @submit.prevent="addFoapa">
        <div class="flex gap-14">
            <span>
                <h4 class="font-normal text-sm">Select FOAPA</h4>
                <select name="foapa" id="foapa" v-model="assignedFoapa.foapaNumber"
                    class=" border-[0.5px] h-11 rounded-md bg-white border-gray-200 w-72 box-border px-5 text-xs border-solid shadow-md"
                    required>
                    <!-- <option disabled selected value="">Select FOAPA</option> -->
                    <option :value="formatUserFoapa(foapa)" v-for="foapa in userFoapas">
                        {{ formatUserFoapa(foapa) }}
                    </option>
                </select>
            </span>
            <span>
                <h4 class="font-normal text-sm">Quantity to use from FOAPA</h4>
                <input type="text" name="quantity-assigned" placeholder="Desired Amount" v-model="assignedFoapa.cost"
                    class="border-[0.5px] h-11 rounded-md border-gray-200 w-72 box-border px-5 text-xs border-solid shadow-md"
                    required>
            </span>
        </div>

        <div class="flex gap-5">
            <button type="submit"
                class="bg-udmercy-blue mt-10 text-white border-none w-40 h-11 rounded-full cursor-pointer text-xs">
                Add FOAPA
            </button>
            <button type="button" @click="moveToNextSection"
                class="bg-udmercy-blue mt-10 text-white border-none w-40 h-11 rounded-full cursor-pointer text-xs">
                Next Section
            </button>
        </div>
    </form>

    <!-- ALL FOAPA SECTION -->
    <div class="flex gap-28">
        <div class="w-[330px]">
            <h4 class="underline mb-5 font-semibold text-lg text-gray-800">All FOAPA</h4>
            <div class=" overflow-auto flex flex-col gap-10 flex-wrap custom-scroll-bar max-w-[1075px] w-auto">
                <div v-if="props.claim.activities.length === 0">
                    <h5 class="mt-0 font-medium text-gray-500">Added FOAPA numbers will be listed</h5>
                </div>

            </div>
            <div class="flex gap-3 flex-col max-h-72 overflow-auto">
                <foapa-container :foapa="foapa" v-for=" foapa in props.claim.foapaDetails"
                    @delete-activity="deleteFOAPA">
                </foapa-container>
            </div>
        </div>
        <!-- BALANCE SECTION -->
        <div>
            <h4 class="underline font-semibold mb-0 text-lg text-gray-800">Balance</h4>
            <div class="overflow-auto flex flex-col gap-10 flex-wrap custom-scroll-bar max-w-[1075px] w-auto">
                <div class="flex gap-3 flex-col max-h-72 overflow-auto">
                    <balance-container :claim="props.claim">
                    </balance-container>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import FoapaContainer from "./FoapaContainer.vue";
import { ReimbursementTicket, FoapaStuff, FoapaInput } from "../../types/types";
import BalanceContainer from "./BalanceContainer.vue";
let props = defineProps<{
    claim: ReimbursementTicket
}>();

let foapa = ref<FoapaStuff>({
    fund: "ur mom",
    organization: "string",
    account: "string",
    program: "string",
    activity: "string",
    foapaName: "string",
    initialAmount: "string",
    currentAmount: "string",
    description: "string,"
})

let assignedFoapa = ref<FoapaInput>({
    foapaNumber: "",
    cost: ""
})

let userFoapas = ref<FoapaStuff[]>()
let selectedFoapa = ref<FoapaStuff>()
const emits = defineEmits(["move-to-next-section"])

const exampleFOAPA = ref({
    name: "XXXXXX-XXXX-XXXX-XXXX-XXXX",
    cost: 1000,
})

function moveToNextSection() {
    if (assignedFoapa.value.foapaNumber !== "" || assignedFoapa.value.cost !== "") {
        let moveon = confirm("Warning: You are moving to next section without adding your currently inputted FOAPA. Click 'OK' to discard the inputted FOAPA and move to the next section, or click 'Cancel' to return")
        if (moveon) {
            emits('move-to-next-section')
        }

        return
    }

    emits('move-to-next-section')
}

function addFoapa() {
    props.claim.foapaDetails.push(JSON.parse(JSON.stringify(assignedFoapa.value)));
    assignedFoapa.value = {
        foapaNumber: "",
        cost: ""
    }
}

function retrieveFoapaDetails() {
    axios
        .get(
            `${import.meta.env.VITE_API_URL}/api/retrieveFoapaDetails`
        )
        .then((res) => {
            userFoapas.value = res.data
        })
        .catch((err) => {
            console.log(err);
        });
}

onMounted(() => {
    retrieveFoapaDetails();
});
let selectedFoapaAmount = ref<number>();
let userFoapaNumbers = ref<FoapaStuff[]>([]);
function formatUserFoapa(foapa: FoapaStuff) {
    return `${foapa.fund}-${foapa.organization || "XXXX"}-${foapa.account}-${foapa.program || "XXXX"
        }-${foapa.activity || "XXXX"}`;
}

function deleteFOAPA(id: string) {
    props.claim.foapaDetails = props.claim.foapaDetails.filter((foapaTrash) => foapaTrash.foapaNumber !== id)
}
</script>