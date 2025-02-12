<template>
  <section
    class="xl:w-auto mx-10 sm:mx-20 xl:ml-0 h-full mt-20 sm:mt-0 mb-32 sm:mb-0"
  >
    <span class="flex items-center gap-6 mb-2">
      <h2 class="font-semibold my-0 text-[27px]">Add Edit Notes</h2>
      <img
        src="../assets/edit-icon.png"
        alt="Edit icon"
        class="w-7 md:block hidden"
      />
    </span>

    <div>
      <p class="max-w-[75%] leading-8">
        Add notes about what areas you edited in order to approve this request.
        This will be shown to the faculty member.
      </p>
      <textarea
        placeholder="Add Notes Here"
        v-model="edit_notes"
        class="px-4 py-3 rounded-md border-gray-300 border-solid border-2 w-3/4 h-36"
      ></textarea>
    </div>
    <Button
      type="button"
      label="Approve Request with Edits"
      class="!bg-udmercy-blue mt-4 !border-none"
      @click="acceptRequestWithEdits"
    ></Button>
  </section>
</template>

<script lang="ts" setup>
import axios from "axios";
import Button from "primevue/button";
import { ref } from "vue";

const edit_notes = ref<string>("");

const emits = defineEmits(["approve-request-with-edits"]);

async function acceptRequestWithEdits() {
  emits("approve-request-with-edits", edit_notes.value);
}
</script>
