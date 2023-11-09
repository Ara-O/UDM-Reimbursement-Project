<template>
    <span class="flex items-center gap-6 mb-2">
        <h2 class="font-semibold my-0 text-[27px]">Manage Receipts</h2>
        <img src="../../assets/edit-icon.png" alt="Edit icon" class="w-7">
    </span>

    <div>
        <h4 class="font-normal leading-7 w-auto max-w-[600px] text-sm text-gray-600">Proof of payments are necessary. These
            will be added to the
            end of the
            generated
            PDF. To
            automatically extract
            expenses from receipts, go to the ‘add or view’ expenses</h4>

        <input type="file" id="receipt" class="custom-file-input" ref="receiptRef" name="receipt" @change="receiptAdded"
            accept="image/png, image/jpeg" multiple />
        <h3 class="font-normal text-sm inline" v-if="fileWasSelected">Uploading...</h3>
    </div>
    <h3 class="text-[13px] mt-6 text-gray-700 font-normal">Added Receipts will show here</h3>
    <!-- Looping through all receipts -->
    <div class="mt-6 flex gap-10 w-auto max-w-[1000px] overflow-auto flex-wrap">
        <div class="shadow border border-solid border-gray-100 rounded-md flex items-center box-border w-auto px-5 gap-5 h-auto py-5 pr-10"
            v-for="(receipt, index) in props.claim.reimbursementReceipts">
            <img :src="(receipt.url as string)" class="rounded-md h-20 object-contain w-20" />
            <span>
                <h3 class="mt-0 text-sm font-medium">Receipt #{{ index + 1 }}</h3>
                <span class="flex gap-3">
                    <a :href="(receipt.url as string)" target="_blank"><button
                            class="bg-udmercy-red text-xs text-white rounded-full border-none px-5 py-2"> View</button> </a>
                    <button class="bg-udmercy-red text-xs text-white rounded-full border-none px-5 py-2">Delete</button>
                </span>
            </span>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { ReimbursementTicket } from '../../types/types';
import axios from 'axios';

const props = defineProps<{
    claim: ReimbursementTicket
}>()

let fileWasSelected = ref<boolean>(false);
const receiptRef = ref(null);


async function receiptAdded() {
    fileWasSelected.value = true;
    // @ts-ignore
    const files = receiptRef.value.files;

    await storeReceiptImages();
    fileWasSelected.value = false;
}


async function storeReceiptImages() {
    let formData = new FormData();

    //@ts-ignore
    const files = receiptRef.value.files;
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        formData.append("receipt", file);
    }

    if (files.length > 0) {
        try {
            // Send the FormData object to the server using axios
            let res = await axios.post(
                "https://udm-reimbursement-project.onrender.com/api/storeReceiptImages",
                formData
            );
            fileWasSelected.value = false;

            if (props.claim.reimbursementReceipts.length === 0) {
                props.claim.reimbursementReceipts = res.data;
            } else {
                props.claim.reimbursementReceipts.push(...res.data);
            }
        } catch (err) {
            alert(err)
            console.log(err);
        }
    } else {
        return [];
    }
}
</script>

<style scoped>
.custom-file-input::-webkit-file-upload-button {
    visibility: hidden;
}

.custom-file-input {
    color: transparent;
    width: 153px;
}
</style>