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
      <p class="max-w-[75%] text-sm leading-8">
        Add notes about what areas you edited in order to approve this request.
        This will be shown to the faculty member.
      </p>
      <textarea
        placeholder="Add Notes Here"
        v-model="edit_notes"
        class="px-4 py-3 rounded-md border-gray-300 shadow-sm text-sm max-w-[1000px] h-52 border-solid border w-3/4"
      ></textarea>
    </div>
    <Button
      type="button"
      label="Approve Request with Edits"
      class="!bg-udmercy-blue !px-4 !py-3 max-h-[500px] !rounded-full mt-6 !border-none"
      @click="acceptRequestWithEdits"
    ></Button>
    <Button
      type="button"
      label="Save Request with Edits"
      class="!bg-udmercy-blue !px-4 ml-3 !py-3 max-h-[500px] !rounded-full mt-6 !border-none"
      @click="saveRequestWithEdits"
    ></Button>
  </section>
</template>

<script lang="ts" setup>
import axios from "axios";
import Button from "primevue/button";
import { onMounted, ref } from "vue";

const edit_notes = ref<string>("");

const props = defineProps(["oldReimbursement", "newReimbursement"]);

const emits = defineEmits([
  "approve-request-with-edits",
  "save-request-with-edits",
]);

async function acceptRequestWithEdits() {
  emits("approve-request-with-edits", edit_notes.value);
}

function saveRequestWithEdits() {
  emits("save-request-with-edits", edit_notes.value);
}
function compareObjects(obj1, obj2) {
  let changes: any = [];
  let foapaChanged = false;

  function compareValues(key, value1, value2) {
    if (Array.isArray(value1) && Array.isArray(value2)) {
      if (key === "foapaDetails") {
        if (value1.length !== value2.length) {
          foapaChanged = true;
          return;
        }

        let value1Map = new Map(value1.map((item) => [item._id, item]));
        let value2Map = new Map(value2.map((item) => [item._id, item]));

        if (value1.length !== value2.length) {
          foapaChanged = true;
          return;
        }

        value1.forEach((foapa) => {
          if (!value2Map.has(foapa._id)) {
            foapaChanged = true;
          }
        });

        value2.forEach((foapa) => {
          if (!value1Map.has(foapa._id)) {
            foapaChanged = true;
          } else {
            let oldFoapa = value1Map.get(foapa._id);
            for (let field in foapa) {
              if (field !== "_id" && foapa[field] !== oldFoapa[field]) {
                foapaChanged = true;
              }
            }
          }
        });
      } else if (JSON.stringify(value1) !== JSON.stringify(value2)) {
        changes.push(`Some ${key} details were changed`);
      }
    } else if (value1 !== value2) {
      changes.push(`${key} was changed from "${value1}" to "${value2}"`);
    }
  }

  for (let key in obj1) {
    if (key === "_id") continue; // Ignore _id
    if (!(key in obj2)) {
      changes.push(`${key} was removed`);
      continue;
    }
    compareValues(key, obj1[key], obj2[key]);
  }

  for (let key in obj2) {
    if (!(key in obj1)) {
      changes.push(`${key} was added`);
    }
  }

  if (foapaChanged) {
    changes.push("Your FOAPA details were changed");
  }

  return changes;
}

onMounted(() => {
  console.log(props["oldReimbursement"]);
  console.log(props["newReimbursement"]);

  console.log();

  const changes = compareObjects(
    props["newReimbursement"],
    props["oldReimbursement"]
  );

  const new_changes = changes.map((change) => {
    change = change.replace("reimbursementName", "Reimbursement name");
    change = change.replace("reimbursementReason", "Reimbursement reason");
    return change;
  });

  edit_notes.value = `The following changes were made:

${new_changes.join("\n\n")}
  `;
});
</script>
