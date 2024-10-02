<template>
  <article class="bg-white w-full max-w-[1000px] px-10 rounded-md py-9">
    <h3 class="mt-0">Quick Add</h3>
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
      >
        Upload a Receipt
      </button>
    </div>

    <!-- Receipt + Choices option -->
    <article
      class="flex justify-between min-h-96 mt-7"
      v-if="userIsTakingAPicture"
    >
      <div class="w-full">
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
          v-if="!videoFeedIsActive && receiptImageHasBeenCaptured"
          alt="Image preview url"
        />
        <button
          class="bg-udmercy-blue mt-3 cursor-pointer text-white border-none px-7 py-3 rounded-full"
          @click="takePicture"
        >
          Take Picture
        </button>
      </div>
      <div class="bg-pink-500 w-full">
        <h3>hi</h3>
      </div>
    </article>
  </article>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { TYPE, useToast } from "vue-toastification";

const videoFeed = ref<HTMLVideoElement | null>(null);
const toast = useToast();
const videoFeedIsActive = ref<boolean>(true);
const userIsTakingAPicture = ref<boolean>(false);
const receiptCanvas = ref<HTMLCanvasElement | null>(null);
const receiptImageHasBeenCaptured = ref<boolean>(false);
const imagePreviewURL = ref<string>("");

function onCaptureReceiptWithCamera() {
  let facingMode = { exact: "user" };
  const userAgent = navigator.userAgent.toLowerCase();

  if (/mobile|android|iphone|ipad/.test(userAgent)) {
    facingMode = { exact: "environment" };
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
  userIsTakingAPicture.value = true;
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

  //   receiptCanvas.value.toBlob((img: any) => {
  //     console.log("image", img);

  // capturedImagesBlob.value = img;
  //   });

  //   showCapturedImage.value = true;
}
</script>
