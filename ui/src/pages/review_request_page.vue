<template>
  <main
    class="h-screen flex flex-col gap-12 px-20 md:flex-row items-center justify-center"
  >
    <img :src="DetroitMercyLogo" alt="Logo" class="w-40" />
    <div>
      <h1 class="text-2xl font-semibold">Review Request</h1>
      <p class="mt-0 max-w-3xl text-[14.5px] leading-7">
        You were forwarded this reimbursement request for approval. Please
        indicate whether you have approved or denied the request attached in
        your email. If you have any questions or concerns, please email Jim
        Adair - adairja@udmercy.edu
      </p>
      <p
        class="underline text-[14.5px] cursor-pointer text-udmercy-blue"
        @click="viewPdf"
      >
        Click here to view the reimbursement request
      </p>
      <input
        type="text"
        v-model="approver_name"
        class="mt-2 block border-gray-300 px-5 w-96 h-9 text-sm border border-solid rounded-md"
        placeholder="Please enter your full name as signature"
      />
      <textarea
        placeholder="Attach any message/information"
        class="w-96 h-28 mt-5 text-sm border-gray-300 pl-4 border border-solid rounded-md p-2.5"
        v-model="attached_message"
      ></textarea>
      <div class="mt-6 flex gap-3">
        <button
          @click="reviewerAnswer('Denied')"
          class="bg-udmercy-red text-white cursor-pointer border-0 px-7 h-11 rounded-full"
        >
          Deny Request
        </button>
        <button
          class="bg-udmercy-blue text-white cursor-pointer border-0 px-7 h-11 rounded-full"
          @click="reviewerAnswer('Approved')"
        >
          Approve Request
        </button>
      </div>
    </div>
  </main>
</template>

<script lang="ts" setup>
import DetroitMercyLogo from "../assets/detroit-mercy-logo.png";
import { onMounted, ref } from "vue";
import axios from "axios";
import { useRoute } from "vue-router";
import router from "../router";
import { useToast, TYPE } from "vue-toastification";

const attached_message = ref<string>("");
const approver_name = ref<string>("");
const route = useRoute();
const toast = useToast();
const currentReimbursement = ref<any>({});

async function reviewerAnswer(answer) {
  try {
    toast("Submitting...", {
      type: TYPE.INFO,
    });

    await axios.post(
      `${import.meta.env.VITE_API_URL}/api/review-reimbursement-request`,
      {
        reimbursement_id: route.params.id,
        status: answer,
        name: approver_name.value,
        message: attached_message.value,
      }
    );

    toast.clear();
    toast("Review Submitted. Thank you!", {
      type: TYPE.INFO,
    });

    router.push("/");
  } catch (err) {
    console.log(err);
  }
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

async function viewPdf() {
  try {
    toast.clear();
    toast("Loading... Please wait...", {
      type: TYPE.INFO,
    });

    let res = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/generate-pdf`,
      {
        reimbursementTicket: currentReimbursement.value,
      }
    );

    downloadPDF(res.data);

    toast.clear();
  } catch (err: any) {
    console.log(err);
    toast.clear();
    toast(
      err?.response?.data?.message ||
        "There was an error previewing this PDF. Please try again later",
      {
        type: TYPE.ERROR,
      }
    );
  }
}

onMounted(async () => {
  // Check for if it is still pending, if it is pending then continue
  // if not, tell the user that the request has been rescinded and there is no longer need
  try {
    const id = route.params.id;

    if (id === null || id === "") {
      alert(
        "This request was not found. Please contact Jim Adair (adairja@udmercy.edu) if there was an issue"
      );
      router.push("/");
      return;
    }

    let res = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/check-reimbursement-approval-status`,
      { id: id }
    );

    let needs_approval = res.data.needs_approval;

    if (needs_approval === false) {
      alert(
        "This reimbursement request no longer needs your approval. You can close out of this page"
      );
      router.push("/");
    }

    const reimbursement_info = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/retrieve-ticket-information`,
      {
        params: {
          reimbursementId: route.params.id,
        },
      }
    );

    currentReimbursement.value = reimbursement_info.data;
  } catch (err) {
    console.log(err);
  }
});
</script>
