<template>
  <section
    class="xl:w-auto mx-10 sm:mx-20 xl:ml-0 h-full mt-20 sm:mt-0 mb-32 sm:mb-0"
  >
    <span class="flex items-center gap-6 mb-2">
      <h2 class="font-semibold my-0 text-[27px]">Manage Receipts</h2>
      <img
        src="../../assets/edit-icon.png"
        alt="Edit icon"
        class="w-7 md:block hidden"
      />
    </span>

    <div>
      <h4
        class="font-normal leading-7 w-auto max-w-[600px] text-sm text-gray-600"
      >
        Proof of payments are necessary. These will be added to the end of the
        generated PDF. To automatically extract expenses from receipts.
        <b>Note: There is a file upload size limit of 10mb</b>
      </h4>

      <button
        type="button"
        @click="() => open()"
        :disabled="view_only_mode === true"
      >
        Upload file
      </button>
      <h3 class="font-normal text-sm inline" v-if="fileWasSelected">
        Uploading...
      </h3>
      <h4 class="font-normal text-sm">or</h4>
      <button
        :disabled="view_only_mode === true"
        class="cursor-pointer bg-white border-none text-sm underline font-normal"
        @click="openCameraPopup"
      >
        Click here to take a picture
      </button>
    </div>
    <h3 class="text-[13px] mt-6 text-gray-700 font-normal">
      Added Receipts will show here
    </h3>
    <!-- Looping through all receipts -->
    <div class="mt-6 flex gap-10 w-auto max-w-[1100px] flex-wrap">
      <div
        class="bg-udmercy-blue border border-solid border-gray-200 text-white rounded-md flex items-center box-border w-auto px-5 gap-5 h-auto py-5 pr-10"
        v-for="(receipt, index) in props.claim.reimbursementReceipts"
      >
        <img
          :src="(receipt.url as string)"
          class="rounded-md h-20 object-cover w-20"
        />
        <span>
          <h3 class="mt-0 text-sm font-medium" v-if="receipt.type === 'pdf'">
            Receipt {{ receipt.name }} - Page {{ receipt.index }}
          </h3>
          <h3 class="mt-0 text-sm font-medium" v-else>
            Receipt {{ receipt.name }}
          </h3>
          <span class="flex gap-3">
            <a
              :href="(receipt.url as string)"
              target="_blank"
              style="text-decoration: none"
              ><button
                class="bg-white text-xs text-black rounded-full cursor-pointer border-none px-3.5 py-2 flex items-center gap-1 mt-1"
              >
                <img
                  src="../../assets/expand-view.png"
                  alt="View Receipt"
                  class="trash-icon w-4"
                  title="View Receipt"
                />
              </button>
            </a>
            <button
              @click="deleteReceipt(receipt.id)"
              :disabled="view_only_mode === true"
              class="bg-udmercy-red disabled:bg-gray-500 text-xs text-white rounded-full cursor-pointer border-none px-4 py-1 mt-1"
            >
              <img
                src="../../assets/trash-icon-white.png"
                alt="Trash icon"
                class="trash-icon w-3 mt-1"
              />
            </button>
          </span>
        </span>
      </div>
    </div>
    <section v-show="cameraPopupIsOpen">
      <div
        class="absolute bg-black bg-opacity-50 h-screen top-0 left-0 w-screen items-center flex justify-center"
      >
        <div
          class="bg-white shadow-md border-none h-min max-h-[85vh] px-6 overflow-auto md:w-[45%] max-w-xl py-3 rounded-md flex flex-col gap-3"
        >
          <div class="flex justify-between items-center my-3">
            <h3 class="font-semibold text-md my-0">Receipt Preview</h3>
            <img
              :src="CancelIcon"
              alt="Cancel icon"
              class="w-4 opacity-75 hover:opacity-100 cursor-pointer"
              @click="closeCameraPopup"
            />
          </div>
          <p class="leading-8 text-sm mt-0 font-medium">
            Make sure you enable camera permissions. After taking a picture,
            make sure to scroll to find a preview of the picture.
          </p>
          <video
            autoplay
            id="video"
            ref="videoFeed"
            class="w-full max-w-2xl rounded-md"
          ></video>
          <button
            id="btn"
            class="bg-udmercy-blue text-white py-3 rounded-md border-none cursor-pointer"
            @click="capturaReceiptPhoto"
          >
            Take picture
          </button>
          <canvas id="canvas" ref="receiptCanvas" class="hidden"></canvas>

          <h3 class="text-sm font-medium">
            Your captured image will show below
          </h3>
          <div v-if="showCapturedImage">
            <img
              :src="imagePreviewURL"
              alt="Captured image"
              class="w-full rounded-md"
            />
            <div class="flex gap-3 mt-4 flex-wrap mb-4">
              <button
                class="bg-udmercy-red text-white py-3 text-[13px] font-normal px-5 rounded-full border-none cursor-pointer"
                @click="discardCapturedImage"
              >
                Discard image
              </button>
              <button
                class="bg-udmercy-blue text-white font-normal text-[13px] py-3 px-5 rounded-full border-none cursor-pointer"
                @click="addCapturedImageAsReceipt"
              >
                Save as a receipt/proof of payment
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <span class="flex gap-4 mt-6">
      <div class="flex gap-8 items-center">
        <button
          type="button"
          @click="moveToPreviousSection"
          class="mt-6 bg-udmercy-blue text-white border-none w-40 h-11 rounded-full cursor-pointer text-xs flex justify-center items-center gap-3"
        >
          <img src="../../assets/next-arrow.png" class="w-3 rotate-180" />
          Previous Section
        </button>
        <button
          type="button"
          @click="emits('move-to-next-section')"
          class="mt-6 bg-udmercy-blue text-white border-none w-40 h-11 rounded-full cursor-pointer text-xs flex justify-center items-center gap-5"
        >
          Next Section
          <img src="../../assets/next-arrow.png" class="w-3" />
        </button>
      </div>
    </span>
  </section>
</template>

<script lang="ts" setup>
import axios from "axios";
import CancelIcon from "../../assets/cross-icon.svg";
import * as PDFJS from "pdfjs-dist/build/pdf.min.mjs";
import { ref } from "vue";
import { useFileDialog } from "@vueuse/core";
import { ReimbursementTicket } from "../../types/types";
import { TYPE, useToast } from "vue-toastification";

const props = defineProps<{
  claim: ReimbursementTicket;
  view_only_mode: Boolean;
}>();

const emits = defineEmits(["move-to-next-section", "move-to-previous-section"]);

let fileWasSelected = ref<boolean>(false);
let cameraPopupIsOpen = ref<boolean>(false);
let showCapturedImage = ref<boolean>(false);
const receiptRef = ref(null);

const videoFeed = ref<HTMLVideoElement | null>(null);
const receiptCanvas = ref<HTMLCanvasElement | null>(null);
let imagePreviewURL = ref<string>("");
let capturedImagesBlob = ref<any>();

const toast = useToast();

const {
  files,
  open,
  reset,
  onChange: onUploadReceipt,
} = useFileDialog({
  accept: "image/*, application/pdf",
  directory: false,
  multiple: true,
});

onUploadReceipt((files) => {
  checkReceiptSize(files);
});

function checkReceiptSize(files) {
  const maxSize = 10 * 1024 * 1024;

  for (let i = 0; i < files.length; i++) {
    if (files[i].size > maxSize) {
      toast("File exceeds the 10 MB size limit.", { type: TYPE.ERROR });
      return;
    }

    //Check if file is a pdf
    if (files[i].type === "application/pdf") {
      convertPDFtoImages(files[i]);
    } else {
      receiptAdded([files[i]]);
    }
  }
}

function moveToPreviousSection() {
  emits("move-to-previous-section");
}

async function convertPDFtoImages(file_data: any) {
  fileWasSelected.value = true;

  try {
    PDFJS.GlobalWorkerOptions.workerSrc =
      "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.6.82/pdf.worker.mjs";

    // Upload pdf
    let formDataPDF = new FormData();

    //@ts-ignore
    formDataPDF.append("receipt", file_data);

    //Updates pdf to imagekit
    let resp = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/upload-pdf`,
      formDataPDF
    );

    const pdfRes = resp.data;

    const imagesList: any[] = [];
    const canvas = document.createElement("canvas");
    canvas.setAttribute("className", "canv");
    const pdf = await PDFJS.getDocument(pdfRes.url).promise;

    for (let i = 1; i <= pdf.numPages; i++) {
      var page = await pdf.getPage(i);
      var viewport = page.getViewport({ scale: 1.5 });
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      var render_context = {
        canvasContext: canvas.getContext("2d"),
        viewport: viewport,
      };
      await page.render(render_context).promise;
      let img: any = canvas.toDataURL("image/png");
      imagesList.push(img);
    }

    const blobArr: any = [];

    //Loops through all the pages
    for (let i = 0; i < imagesList.length; i++) {
      const byteCharacters = atob(imagesList[i].split(",")[1]);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      // So the backend can recognize that this is a PDF
      blobArr.push(new Blob([byteArray], { type: "image/pdf" }));
    }

    const formData = new FormData();

    for (let i = 0; i < blobArr.length; i++) {
      formData.append("receipt", blobArr[i]);
    }

    let res = axios
      .post(
        `${import.meta.env.VITE_API_URL}/api/store-receipt-images`,
        formData
      )
      .then((res) => {
        fileWasSelected.value = false;

        if (props.claim.reimbursementReceipts.length === 0) {
          props.claim.reimbursementReceipts = res.data;
        } else {
          props.claim.reimbursementReceipts.push(...res.data);
        }

        fileWasSelected.value = false;
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (err) {
    console.log(err);
    toast("An unexpected error has occured", {
      type: TYPE.ERROR,
    });
  }
}

function openCameraPopup() {
  cameraPopupIsOpen.value = true;

  let facingMode = { exact: "user" }; // Default to front camera
  const userAgent = navigator.userAgent.toLowerCase();

  if (/mobile|android|iphone|ipad/.test(userAgent)) {
    facingMode = { exact: "environment" }; // Use back camera for mobile devices
  }

  if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices
      .getUserMedia({
        video: {
          facingMode: facingMode,
        },
      })
      .then((stream) => {
        if (videoFeed.value) videoFeed.value.srcObject = stream;
      })
      .catch((err) => {
        console.log(err);
        if (err.name === "OverconstrainedError") {
          navigator.mediaDevices
            .getUserMedia({
              video: true,
            })
            .then((stream) => {
              if (videoFeed.value) videoFeed.value.srcObject = stream;
            });
        } else {
          toast(
            "There was an error accessing your camera. Please check your camera permissions and try again",
            {
              type: TYPE.ERROR,
            }
          );
        }
      });
  }
}

function discardCapturedImage() {
  imagePreviewURL.value = "";
  capturedImagesBlob.value = "";
  showCapturedImage.value = false;
}

function closeCameraPopup() {
  cameraPopupIsOpen.value = false;
  if (videoFeed.value && videoFeed.value.srcObject) {
    let stream = videoFeed.value.srcObject;
    //@ts-ignore
    let tracks = stream.getTracks();

    tracks.forEach((track) => {
      track.stop();
    });

    videoFeed.value.srcObject = null; // Clear the srcObject
  }
}
function capturaReceiptPhoto() {
  const width = videoFeed.value?.videoWidth;
  const height = videoFeed.value?.videoHeight;

  if (!receiptCanvas.value || !videoFeed.value) return;

  const context = receiptCanvas.value.getContext("2d");
  receiptCanvas.value.width = width || 0;
  receiptCanvas.value.height = height || 0;

  context?.drawImage(videoFeed.value, 0, 0, width || 0, height || 0);

  const imageUrl = receiptCanvas.value.toDataURL("image/png");
  receiptCanvas.value.toBlob((img: any) => {
    capturedImagesBlob.value = img;
  });

  imagePreviewURL.value = imageUrl;
  showCapturedImage.value = true;
}

function addCapturedImageAsReceipt() {
  toast("Saving image...", {
    type: TYPE.INFO,
  });

  let formData = new FormData();
  formData.append("receipt", capturedImagesBlob.value);
  // console.log(formData);

  // Send the FormData object to the server using axios
  let res = axios
    .post(`${import.meta.env.VITE_API_URL}/api/store-receipt-images`, formData)
    .then((res) => {
      fileWasSelected.value = false;

      if (props.claim.reimbursementReceipts.length === 0) {
        props.claim.reimbursementReceipts = res.data;
      } else {
        props.claim.reimbursementReceipts.push(...res.data);
      }

      showCapturedImage.value = false;
      capturedImagesBlob.value = "";
      imagePreviewURL.value = "";

      toast("Proof of payment saved successfully", {
        type: TYPE.SUCCESS,
      });
    })
    .catch((err) => {
      console.log(err);
    });
}

async function receiptAdded(files) {
  try {
    fileWasSelected.value = true;
    // @ts-ignore
    // const files = receiptRef.value.files;

    await storeReceiptImage(files);
    fileWasSelected.value = false;
  } catch (err) {
    console.log(err);
  }
}

async function storeReceiptImage(files) {
  let formData = new FormData();

  //@ts-ignore
  // const files = receiptRef.value.files;
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    formData.append("receipt", file);
  }

  if (files.length > 0) {
    try {
      // Send the FormData object to the server using axios
      let res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/store-receipt-images`,
        formData
      );

      // console.log(res);

      fileWasSelected.value = false;

      if (props.claim.reimbursementReceipts.length === 0) {
        props.claim.reimbursementReceipts = res.data;
      } else {
        props.claim.reimbursementReceipts.push(...res.data);
      }
    } catch (err) {
      alert(err);
      console.log(err);
    }
  } else {
    return [];
  }
}

function deleteReceipt(id: string) {
  props.claim.reimbursementReceipts = props.claim.reimbursementReceipts.filter(
    (receipt) => receipt.id !== id
  );
}
</script>

<style scoped></style>
