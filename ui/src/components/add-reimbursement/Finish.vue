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
            <button
                class="bg-udmercy-blue text-white border-none w-auto px-5 h-11 rounded-full cursor-pointer text-xs ">Discard
                Changes</button>
        </span>

        <h5 class="font-normal" v-if="currentlyCreatingPDF">Generating PDF, please wait...</h5>
    </div>
</template>

<script lang="ts" setup>
import { ReimbursementTicket } from '../../types/types';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import parseDate from '../../utils/parseDate';

const props = defineProps<{
    claim: ReimbursementTicket
}>()
const route = useRoute()
const router = useRouter();

let currentlyCreatingPDF = ref<boolean>(false);
let userIsEditingReimbursement = ref<boolean>(false);

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
        alert("Reimbursement ticket submitted successfully");
    } catch (error) {
        console.log(error);
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
    currentlyCreatingPDF.value = true;
    console.log("aaa")
    axios
        .get(
            `${import.meta.env.VITE_API_URL}/api/retrieveAccountInformation`
        )
        .then((response) => {
            props.claim.totalCost = getAllActivitiesAmount();
            axios
                .get(`${import.meta.env.VITE_API_URL}/api/generatePdf`, {
                    params: {
                        reimbursementData: props.claim,
                        userInfo: response.data,
                    },
                })
                .then((res) => {
                    console.log(res)
                    downloadPDF(res.data);
                    currentlyCreatingPDF.value = false;
                })
                .catch((err) => {
                    console.log(err);
                });
        }).catch((err) => {
            console.log(err)
        });
}


async function updateReimbursement() {
    if (props.claim.reimbursementName.trim() === "") {
        alert("Reimbursement Title Missing");
        router.push("/dashboard")
        return;
    }

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


    alert('Claim updated')
    router.push("/dashboard")
}

async function addReimbursement() {
    try {
        if (props.claim.reimbursementName.trim() == "") {
            alert("Reimbursement Name Missing");
            return;
        }

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

        alert('Claim saved')
        router.push("/dashboard")

    } catch (error) {
        console.log(error);
    }
}

async function saveReimbursement() {
    props.claim.reimbursementStatus = "In Progress";

    if (userIsEditingReimbursement.value) {
        updateReimbursement();
    } else {
        addReimbursement();
    }
}

onMounted(() => {
    if (route.query.reimbursementId) {
        userIsEditingReimbursement.value = true;
    }
})

</script>