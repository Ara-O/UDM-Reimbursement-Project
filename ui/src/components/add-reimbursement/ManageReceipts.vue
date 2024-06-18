<template>
    <section class="xl:w-auto mx-10 sm:mx-20 xl:ml-0 h-full mt-20 sm:mt-0 mb-32 sm:mb-0">
        <span class="flex items-center gap-6 mb-2">
            <h2 class="font-semibold my-0 text-[27px]">Manage Receipts</h2>
            <img src="../../assets/edit-icon.png" alt="Edit icon" class="w-7 md:block hidden">
        </span>

        <div>
            <h4 class="font-normal leading-7 w-auto max-w-[600px] text-sm text-gray-600">Proof of payments are
                necessary.
                These
                will be added to the
                end of the
                generated
                PDF. To
                automatically extract
                expenses from receipts. <b>Note: There is a file upload size limit of 10mb</b></h4>

            <input id="receipt" type="file" class="custom-file-input" ref="receiptRef" name="receipt"
                @change="receiptSize" accept="application/pdf, image/png, image/jpeg" multiple />
            <h3 class="font-normal text-sm inline" v-if="fileWasSelected">Uploading...</h3>
            <h4 class="font-normal text-sm">or</h4>
            <h3 class="cursor-pointer text-sm underline font-normal" @click="openCameraPopup">Click here to take a
                picture
            </h3>
        </div>
        <h3 class="text-[13px] mt-6 text-gray-700 font-normal">Added Receipts will show here</h3>
        <!-- Looping through all receipts -->
        <div class="mt-6 flex gap-10 w-auto max-w-[1100px] max-h-72 overflow-auto flex-wrap">
            <div class=" border border-solid border-gray-200 rounded-md flex items-center box-border w-auto px-5 gap-5 h-auto py-5 pr-10"
                v-for="(receipt, index) in props.claim.reimbursementReceipts">
                <img :src="(receipt.url as string)" class="rounded-md h-20 object-cover w-20" />
                <span>
                    <h3 class="mt-0 text-sm font-medium">Receipt #{{ index + 1 }}</h3>
                    <span class="flex gap-3">
                        <a :href="(receipt.url as string)" target="_blank"><button
                                class="bg-udmercy-red text-xs text-white rounded-full cursor-pointer border-none px-5 py-2">
                                View</button> </a>
                        <button @click="deleteReceipt(receipt.id)"
                            class="bg-udmercy-red text-xs text-white rounded-full cursor-pointer border-none px-5 py-2">Delete</button>
                    </span>
                </span>
            </div>
        </div>
        <section v-show="cameraPopupIsOpen">
            <div
                class="absolute bg-black bg-opacity-50 h-screen top-0 left-0 w-screen items-center flex justify-center">
                <div
                    class="bg-white shadow-md border-none h-min max-h-[85vh] px-6 overflow-auto w-[45%] max-w-xl py-3 rounded-md flex flex-col gap-3">
                    <div class="flex justify-between items-center my-3">
                        <h3 class="font-semibold text-md my-0">Receipt Preview</h3>
                        <img :src="CancelIcon" alt="Cancel icon" class="w-4 opacity-75 hover:opacity-100 cursor-pointer"
                            @click="closeCameraPopup">
                    </div>
                    <video autoplay id="video" ref="videoFeed" class="w-full max-w-2xl rounded-md"></video>
                    <button id="btn" class="bg-udmercy-blue text-white py-3 rounded-md border-none cursor-pointer"
                        @click="capturaReceiptPhoto">Take
                        picture</button>
                    <canvas id="canvas" ref="receiptCanvas" class="hidden"></canvas>

                    <h3 class="text-sm font-medium">Your captured image will show below</h3>
                    <div v-if="showCapturedImage">
                        <img :src="imagePreviewURL" alt="Captured image" class="w-full rounded-md">
                        <div class="flex gap-3 mt-4 flex-wrap mb-4">
                            <button
                                class="bg-udmercy-red text-white py-3 text-[13px] font-normal px-5 rounded-full border-none cursor-pointer"
                                @click="discardCapturedImage">
                                Discard image
                            </button>
                            <button
                                class="bg-udmercy-blue text-white font-normal text-[13px] py-3 px-5 rounded-full border-none cursor-pointer"
                                @click="addCapturedImageAsReceipt">
                                Save as a receipt/proof of payment
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <button type="button" @click="emits('move-to-next-section')"
            class=" bg-udmercy-blue mt-5 text-white border-none w-40 h-11 rounded-full cursor-pointer text-xs">Next
            Section</button>
    </section>
</template>

<script lang="ts" setup>
import axios from 'axios';
import CancelIcon from "../../assets/cross-icon.svg"
import { ref } from 'vue';
import { ReimbursementTicket } from '../../types/types';
import { TYPE, useToast } from 'vue-toastification';

const props = defineProps<{
    claim: ReimbursementTicket
}>()

const emits = defineEmits(['move-to-next-section'])

let fileWasSelected = ref<boolean>(false);
let cameraPopupIsOpen = ref<boolean>(false);
let showCapturedImage = ref<boolean>(false);
const receiptRef = ref(null);

const videoFeed = ref<HTMLVideoElement | null>(null)
const receiptCanvas = ref<HTMLCanvasElement | null>(null)
let imagePreviewURL = ref<string>("")
let capturedImagesBlob = ref<any>()

const toast = useToast()

function receiptSize(event) {
  const maxSize = 10 * 1024 * 1024; // 2 MB in bytes
  const files = event.target.files;

  for (let i = 0; i < files.length; i++) {
    if (files[i].size > maxSize) {
      //alert(`File "${files[i].name}" exceeds the 25 MB size limit.`);
      toast("File exceeds the 10 MB size limit.",{type:TYPE.ERROR});
      event.target.value = ''; // Clear the input
      return;
    }
  }

  // Call the receiptAdded function if file size is within the limit
  receiptAdded(event);
}

function openCameraPopup() {
    cameraPopupIsOpen.value = true

    let facingMode = { exact: "user" }; // Default to front camera
    const userAgent = navigator.userAgent.toLowerCase();

    if (/mobile|android|iphone|ipad/.test(userAgent)) {
        facingMode = { exact: "environment" }; // Use back camera for mobile devices
    }

    if (navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: facingMode
            },
        }).then(stream => {
            if (videoFeed.value)
                videoFeed.value.srcObject = stream
        }).catch((err) => {
            console.log(err)
            if (err.name === 'OverconstrainedError') {
                navigator.mediaDevices.getUserMedia({
                    video: true
                }).then(stream => {
                    if (videoFeed.value)
                        videoFeed.value.srcObject = stream;
                })
            } else {
                toast("There was an error accessing your camera. Please check your camera permissions and try again", {
                    type: TYPE.ERROR
                })
            }
        })
    }
}

function discardCapturedImage() {
    imagePreviewURL.value = ""
    capturedImagesBlob.value = ""
    showCapturedImage.value = false
}

function closeCameraPopup() {
    cameraPopupIsOpen.value = false
    if (videoFeed.value && videoFeed.value.srcObject) {
        let stream = videoFeed.value.srcObject;
        //@ts-ignore
        let tracks = stream.getTracks();

        tracks.forEach(track => {
            track.stop();
        });

        videoFeed.value.srcObject = null; // Clear the srcObject
    }
}
function capturaReceiptPhoto() {
    const width = videoFeed.value?.videoWidth
    const height = videoFeed.value?.videoHeight

    if (!receiptCanvas.value || !videoFeed.value) return

    const context = receiptCanvas.value.getContext('2d')
    receiptCanvas.value.width = width || 0
    receiptCanvas.value.height = height || 0

    context?.drawImage(videoFeed.value, 0, 0, width || 0, height || 0)

    const imageUrl = receiptCanvas.value.toDataURL('image/png')
    receiptCanvas.value.toBlob((img: any) => {
        capturedImagesBlob.value = img
    })

    imagePreviewURL.value = imageUrl
    showCapturedImage.value = true
}

function addCapturedImageAsReceipt() {
    toast("Saving image...", {
        type: TYPE.INFO
    })

    let formData = new FormData();
    formData.append("receipt", capturedImagesBlob.value)
    console.log(formData)

    // Send the FormData object to the server using axios
    let res = axios.post(
        `${import.meta.env.VITE_API_URL}/api/storeReceiptImages`,
        formData
    ).then((res) => {
        fileWasSelected.value = false;

        if (props.claim.reimbursementReceipts.length === 0) {
            props.claim.reimbursementReceipts = res.data;
        } else {
            props.claim.reimbursementReceipts.push(...res.data);
        }

        showCapturedImage.value = false
        capturedImagesBlob.value = "";
        imagePreviewURL.value = ""

        toast("Proof of payment saved successfully", {
            type: TYPE.SUCCESS
        })

    }).catch((err) => {
        console.log(err)
    })
}


async function receiptAdded(event) {
    event.fileWasSelected.value = true;
    // @ts-ignore
    const files = event.receiptRef.value.files;

    await storeReceiptImages();
    event.fileWasSelected.value = false;
}


async function storeReceiptImages() {
    let formData = new FormData();

    //@ts-ignore
    const files = receiptRef.value.files;
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        formData.append("receipt", file);
    }

    console.log(files)

    if (files.length > 0) {
        try {
            // Send the FormData object to the server using axios
            let res = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/storeReceiptImages`,
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

function deleteReceipt(id: string) {
    props.claim.reimbursementReceipts = props.claim.reimbursementReceipts.filter((receipt) => receipt.id !== id)
}
</script>

<style scoped></style>