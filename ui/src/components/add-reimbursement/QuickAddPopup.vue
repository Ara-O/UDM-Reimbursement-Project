<template>
  <article
    class="bg-white relative w-full max-w-[1000px] px-10 rounded-md py-9"
  >
    <h3 class="mt-0">Quick Add</h3>
    <img
      :src="CancelIcon"
      alt="Cancel icon"
      class="w-4 absolute top-10 cursor-pointer right-10"
      @click="closeQuickAddPopup"
    />
    <h4 class="font-normal text-sm leading-7">
      Welcome to our Quick-add feature! It is in the experimental phase so any
      feedback will be useful.
    </h4>
    <div class="flex gap-3">
      <button
        class="bg-udmercy-blue cursor-pointer text-white border-none px-7 py-3 rounded-full"
        @click="onCaptureReceiptWithCamera"
      >
        Capture Receipt with Camera
      </button>
      <button
        class="bg-udmercy-blue cursor-pointer text-white border-none px-7 py-3 rounded-full"
        @click="onCaptureReceiptWithCamera"
      >
        Upload a file
      </button>
      <!-- <input type="file" @change="onFileChange" accept="image/*" /> -->
    </div>

    <!-- Receipt + Choices option -->
    <article
      class="flex justify-between min-h-96 gap-5 mt-7"
      v-if="userIsUploadingAFile || userIsTakingAPicture"
    >
      <!-- LEFT SECTION -->
      <div class="left-section">
        <!-- LEFT SECTION WHEN USER IS UPLOADING A FILE -->
        <article v-if="userIsUploadingAFile">
          <img :src="imagePreviewURL" class="w-52" alt="Image preview url" />
        </article>

        <!-- LEFT SECTION WHEN USER IS LTAKING A PICTURE -->
        <article class="w-full" v-if="userIsTakingAPicture">
          <video
            autoplay
            id="video"
            ref="videoFeed"
            class="w-full max-w-2xl rounded-md"
            v-if="videoFeedIsActive"
          ></video>
          <canvas id="canvas" ref="receiptCanvas" class="hidden"></canvas>
          <img
            :src="imagePreviewURL"
            class="w-full"
            v-if="!videoFeedIsActive && receiptImageHasBeenCaptured"
            alt="Image preview url"
          />
          <button
            class="bg-udmercy-blue mt-3 cursor-pointer text-white border-none px-7 py-3 rounded-full"
            @click="takePicture"
            v-if="!receiptImageHasBeenCaptured"
          >
            Take Picture
          </button>
          <button
            class="bg-udmercy-blue mt-3 cursor-pointer text-white border-none px-7 py-3 rounded-full"
            v-if="receiptImageHasBeenCaptured"
            @click="restartImageCaptureProcess"
          >
            Restart
          </button>
          <button
            v-if="receiptImageHasBeenCaptured"
            class="bg-udmercy-blue mt-3 ml-3 cursor-pointer text-white border-none px-7 py-3 rounded-full"
          >
            Scan for Events
          </button>
        </article>
      </div>

      <!-- RIGHT SECTION -->
      <div class="w-full">
        <h3 class="text-sm font-medium">Waiting for receipt...</h3>
        <!-- <div id="potentialCosts">

        </div>
        <div id="potentialDates">

        </div> -->

        <section class="container">
          <div class="expenseSection">
            <div class="labelItem"><label for="expense">Expense</label></div>
            <div class="inputItem">
              <input
                type="text"
                name="expense"
                id="expense"
                placeholder="Expense Name"
                class="textBox"
              />
            </div>
          </div>
          <div class="costSection">
            <div class="labelItem"><label for="cost">Cost</label></div>
            <div class="inputItem">
              <input
                type="text"
                name="cost"
                id="cost"
                placeholder="Cost"
                class="textBox"
              />
            </div>
          </div>
          <div class="dateSection">
            <div class="labelItem"><label for="date">Date</label></div>
            <div class="inputItem">
              <input
                type="text"
                name="date"
                id="date"
                placeholder="Date: xx/xx/xxxx"
                class="textBox"
              />
            </div>
          </div>
        </section>
      </div>
    </article>
  </article>
</template>

<script lang="ts" setup>
import axios from "axios";
import { ref } from "vue";
import CancelIcon from "../../assets/cross-icon.svg";
import { TYPE, useToast } from "vue-toastification";

const videoFeed = ref<HTMLVideoElement | null>(null);
const toast = useToast();
const videoFeedIsActive = ref<boolean>(true);
const userIsTakingAPicture = ref<boolean>(false);
const userIsUploadingAFile = ref<boolean>(false);
const receiptCanvas = ref<HTMLCanvasElement | null>(null);
const receiptImageHasBeenCaptured = ref<boolean>(false);
const imagePreviewURL = ref<string>("");
const uploadedImageURL = ref<string>("");
let stream;

const emits = defineEmits(["closeQuickAddPopup"]);

function onFileChange(e: any) {
  const file = e.target.files[0]; // Get the selected file
  userIsUploadingAFile.value = true;
  videoFeedIsActive.value = false;
  receiptImageHasBeenCaptured.value = false;
  if (file) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      imagePreviewURL.value = e.target.result; // Set the image URL for preview
    };
    reader.readAsDataURL(file); // Read the file as a base64 URL
  }

  if (stream) {
    const tracks = stream.getTracks();
    tracks.forEach((track) => track.stop());
    if (videoFeed.value) videoFeed.value.srcObject = null;
  }

  quickAddExpense();
}

function closeQuickAddPopup() {
  if (stream) {
    const tracks = stream.getTracks();
    tracks.forEach((track) => track.stop());
    if (videoFeed.value) videoFeed.value.srcObject = null;
  }

  userIsTakingAPicture.value = false;
  videoFeedIsActive.value = false;
  emits("closeQuickAddPopup");
}

function onCaptureReceiptWithCamera() {
  userIsUploadingAFile.value = false;
  let videoParams;

  const userAgent = navigator.userAgent.toLowerCase();

  if (/mobile|android|iphone|ipad/.test(userAgent)) {
    // console.log("working with mobile");
    videoParams = { facingMode: { exact: "environment" } };
  } else {
    videoParams = true;
  }

  if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices
      .getUserMedia({
        video: videoParams,
      })
      .then((mediaStream) => {
        stream = mediaStream;
        if (videoFeed.value) videoFeed.value.srcObject = mediaStream;
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
  videoFeedIsActive.value = true;
  userIsTakingAPicture.value = true;
}

function restartImageCaptureProcess() {
  userIsTakingAPicture.value = true;
  videoFeedIsActive.value = true;
  receiptImageHasBeenCaptured.value = false;
  onCaptureReceiptWithCamera();
}

function takePicture() {
  const width = videoFeed.value?.videoWidth;
  const height = videoFeed.value?.videoHeight;

  if (!receiptCanvas.value || !videoFeed.value) return;

  const context = receiptCanvas.value.getContext("2d");
  receiptCanvas.value.width = width || 0;
  receiptCanvas.value.height = height || 0;

  context?.drawImage(videoFeed.value, 0, 0, width || 0, height || 0);

  const imageUrl = receiptCanvas.value.toDataURL("image/png");
  imagePreviewURL.value = imageUrl;

  videoFeedIsActive.value = false;
  receiptImageHasBeenCaptured.value = true;

  if (stream) {
    const tracks = stream.getTracks();
    tracks.forEach((track) => track.stop());
    if (videoFeed.value) videoFeed.value.srcObject = null;
  }
}

async function quickAddExpense() {
  console.log("hello");
  let extractResponse = await axios.get(
    `${import.meta.env.VITE_API_URL}/api/extract-text`
  );
  let receiptText = extractResponse.data;

  //console.log(receiptText)

  console.log("___________________");

  let numberedLines: { text: string; number: string; type: string }[] = [];
  for (let line in receiptText) {
    if (/\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}/.test(receiptText[line]))
      numberedLines.push({
        text: receiptText[line],
        number: receiptText[line].match(/\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}/),
        type: "date",
      });
    else if (/\d/.test(receiptText[line]))
      numberedLines.push({
        text: receiptText[line],
        number: receiptText[line].match(/\d+/g),
        type: "cost",
      });
  }

  const costElement = document.querySelector("#potentialCosts");
  const dateElement = document.querySelector("#potentialDates");

  for (let line in numberedLines) {
    let p = document.createElement("p");

    if (numberedLines[line].type == "cost") {
      p.textContent =
        numberedLines[line].text + " | " + numberedLines[line].number;
      costElement?.appendChild(p);
    } else if (numberedLines[line].type == "date") {
      p.textContent =
        numberedLines[line].text + " | " + numberedLines[line].number;
      dateElement?.appendChild(p);
    }
  }
}
</script>

<style>
@tailwind base;
@tailwind components;
@tailwind utilities;

.container {
  display: grid;
  grid-auto-flow: row;
}

.expenseSection {
  grid-column: 1;
  grid-row: auto;
}

.costSection {
  grid-column: 2;
  grid-row: auto;
}

.dateSection {
  grid-column: 3;
  grid-row: auto;
}

.textBox {
  @apply border-[0.5px] h-11 rounded-md border-gray-200 w-auto box-border px-5 text-xs border-solid shadow-md;
}
</style>
