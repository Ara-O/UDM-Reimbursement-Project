<template>
    <span class="flex items-center gap-6 mb-2">
        <h2 class="font-semibold my-0 text-[27px]">Next Steps</h2>
        <img src="../../assets/edit-icon.png" alt="Edit icon" class="w-7">
    </span>

    <div>
        <h3 class="text-sm font-medium">Follow these Steps:</h3>

        <span class="flex gap-5">
            <button @click="saveReimbursement"
                class="bg-udmercy-blue text-white border-none w-auto px-5 h-11 rounded-full cursor-pointer text-xs ">Save
                for
                later</button>
            <button @click="createPdf"
                class="bg-udmercy-blue text-white border-none w-auto px-5 h-11 rounded-full cursor-pointer text-xs ">
                Preview
                Reimbursement Request</button>
            <button @click="submitTicket"
                class="bg-udmercy-blue text-white border-none w-auto px-5 h-11 rounded-full cursor-pointer text-xs ">Submit
                Reimbursement Request</button>

        </span>
        <br>
        <span class="flex gap-5">
            <button @click="saveAsTemplate"
                class="bg-udmercy-blue text-white border-none w-auto px-5 h-11 rounded-full cursor-pointer text-xs ">Save
                as
                Template</button>
            <button @click="discardChanges"
                class="bg-udmercy-blue text-white border-none w-auto px-5 h-11 rounded-full cursor-pointer text-xs ">Discard
                Changes</button>
        </span>
        <h5 class="font-normal" v-if="currentlyCreatingPDF">Generating PDF, please wait...</h5>
    </div>
    <confirmation-popup v-if="showConfirmationPopup" left-button-text="Discard Changes" right-button-text="Cancel"
        :cancel-function="returnToDashboard" :continue-function="cancelConfirmationPopup">
        <template #message>
            Are you sure you want to discard the changes you made to this reimbursement claim?
        </template>
    </confirmation-popup>
</template>

<script lang="ts" setup>
import axios from 'axios';
import parseDate from '../../utils/parseDate';
import { ReimbursementTicket } from '../../types/types';
import { onMounted, ref } from 'vue';
import ConfirmationPopup from '../utilities/ConfirmationPopup.vue';
import { useRoute, useRouter } from 'vue-router';
import { TYPE, useToast } from 'vue-toastification';

const toast = useToast()

const props = defineProps<{
    claim: ReimbursementTicket
}>()
const route = useRoute()
const router = useRouter();
const emits = defineEmits(["onClaimSaved"])

let currentlyCreatingPDF = ref<boolean>(false);
let userIsEditingReimbursement = ref<boolean>(false);
let showConfirmationPopup = ref<boolean>(false)

function returnToDashboard() {
    router.push("/dashboard")
}

function cancelConfirmationPopup() {
    showConfirmationPopup.value = false
}

function downloadPDF(pdfData: string) {
    const linkSource = pdfData;
    let iframe =
        "<iframe width='100%' height='100%' src='" + linkSource + "'></iframe>";
    let x = window.open();
    if (x != null) {
        x.document.open();
        x.document.write(iframe);
        x.document.close();

        // Remove padding from the iframe content
        x.document.querySelector("style") ||
            x.document.head.appendChild(x.document.createElement("style"));
        // @ts-ignore
        x.document.querySelector("style").textContent += `
  body, iframe {
    margin: 0;
    padding: 0;
    overflow: hidden
  }
`;
    }
}

async function saveAsTemplate() {
    try {
        toast("Saving reimbursement claim as template...", {
            type: TYPE.INFO
        })
        await axios.post(`${import.meta.env.VITE_API_URL}/api/saveAsTemplate`, props.claim)
        toast("Reimbursement saved as a template successfully.", {
            type: TYPE.SUCCESS
        })
    } catch (error) {
        toast("An unexpected error occured when saving your claim as a template. Please try again later", {
            type: TYPE.ERROR
        })
    }
}

async function submitTicket() {
    try {
        props.claim.reimbursementStatus = "Submitted";

        await axios.post(
            `${import.meta.env.VITE_API_URL}/api/updateReimbursement`,
            {
                reimbursementTicket: props.claim,
            }
        );

        // router.push("/dashboard");
        toast("Reimbursement claim submitted successfully", {
            type: TYPE.SUCCESS
        });
    } catch (error) {
        toast("An error occured while submitting your reimbursement claim. Please try again later", {
            type: TYPE.INFO
        })
    }
}


function getAllActivitiesAmount(): number {
    let sum: number = 0;
    props.claim.activities.forEach((activity) => {
        sum += Number(activity.cost);
    });
    return sum;
}

function createPdf() {
    toast("Creating your reimbursement claim PDF. Please wait...", {
        type: TYPE.INFO
    })

    axios
        .get(
            `${import.meta.env.VITE_API_URL}/api/retrieveAccountInformation`
        )
        .then((response) => {
            props.claim.totalCost = getAllActivitiesAmount();

            const totalCoveredFoapaCost = props.claim.foapaDetails.reduce((acc, curr,) =>
                acc += Number(curr.cost)
                , 0)


            if (totalCoveredFoapaCost > props.claim.totalCost) {
                toast("Warning: The amount of money you are retrieving from your FOAPAs is more than the amount of money you are trying to get reimbursed for. Please double check your FOAPA coverages and make sure they match.", {
                    type: TYPE.WARNING,
                    timeout: false
                })

            } else if (totalCoveredFoapaCost < props.claim.totalCost) {
                toast("Warning: The amount of money you are retrieving from your FOAPAs is less than the amount of money you are trying to get reimbursed for. Please double check your FOAPA coverages and make sure they match.", {
                    type: TYPE.WARNING,
                    timeout: false
                })
            }

            axios
                .get(`${import.meta.env.VITE_API_URL}/api/generatePdf`, {
                    params: {
                        reimbursementData: props.claim,
                        userInfo: response.data,
                    },
                })
                .then((res) => {
                    downloadPDF(res.data);
                    currentlyCreatingPDF.value = false;
                })
                .catch((err) => {
                    toast("There was an error generating your PDF. Please try again later", {
                        type: TYPE.ERROR
                    })
                });
        }).catch((err) => {
            toast("There was an error generating your PDF. Please try again later", {
                type: TYPE.ERROR
            })
        });
}


async function updateReimbursement() {
    props.claim.totalCost = getAllActivitiesAmount();
    props.claim.reimbursementDate = parseDate(
        new Date().toISOString()
    );

    await axios.post(
        `${import.meta.env.VITE_API_URL}/api/updateReimbursement`,
        {
            reimbursementTicket: props.claim,
        }
    );

    toast("Reimbursement claim updated successfully.", {
        type: TYPE.SUCCESS
    })
    router.push("/dashboard")
}

async function addReimbursement() {
    try {
        props.claim.totalCost = getAllActivitiesAmount();
        props.claim.reimbursementDate = parseDate(
            new Date().toISOString()
        );

        await axios.post(
            `${import.meta.env.VITE_API_URL}/api/addReimbursement`,
            {
                reimbursementTicket: props.claim,
            }
        );

        toast("Reimbursement claim saved successfully.", {
            type: TYPE.SUCCESS
        })
        router.push("/dashboard")
    } catch (error) {
        toast("There was an error saving this reimbursement claim. Please try again later", {
            type: TYPE.ERROR
        })
    }
}

async function saveReimbursement() {
    try {
        if (props.claim.reimbursementName.trim() === "") {
            toast("Please add a title to this reimbursement claim", {
                type: TYPE.ERROR
            });

            return;
        }

        toast("Saving reimbursement claim...", {
            type: TYPE.INFO
        })

        props.claim.reimbursementStatus = "In Progress";

        emits("onClaimSaved")

        if (userIsEditingReimbursement.value) {
            await updateReimbursement();
        } else {
            await addReimbursement();
        }


    } catch (err) {
        toast("There was an error saving this reimbursement claim. Please try again", {
            type: TYPE.ERROR
        })
    }
}

function discardChanges() {
    showConfirmationPopup.value = true
    emits("onClaimSaved")

}

onMounted(() => {
    if (route.query.reimbursementId) {
        userIsEditingReimbursement.value = true;
    }
})

</script>