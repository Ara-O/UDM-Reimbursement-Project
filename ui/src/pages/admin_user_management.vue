<template>
  <main class="px-10 mt-10">
    <router-link
      to="/admin"
      class="text-gray-500 hover:underline no-underline text-sm"
    >
      <span class="flex items-center gap-4">
        <img :src="BackArrow" alt="Back arrow" class="w-3" />
        <p>Return to Admin Dashboard</p>
      </span>
    </router-link>
    <div class="flex items-center gap-10 justify-between">
      <div class="w-full">
        <h1 class="font-semibold text-xl">User Management</h1>
        <div class="flex gap-3 w-full items-center mt-3 relative">
          <InputText
            placeholder="Enter Faculty Name"
            class="w-full !border-gray-200 !h-12 !pl-5 !text-sm"
            style=""
            v-model="search_field"
          />
          <img
            :src="SearchIcon"
            alt="Search icon"
            class="invert opacity-20 w-7 absolute right-4"
          />
        </div>
      </div>
      <img
        :src="DetroitMercyLogo"
        class="w-28 object-contain"
        alt="Detroit Mercy Logo"
      />
    </div>
    <DataTable
      :value="fileteredFaculty"
      striped-rows
      tableStyle="min-width: 50rem"
      class="mt-5"
    >
      <Column field="name" header="Name" sortable></Column>
      <Column field="email" header="Email" sortable></Column>
      <Column field="role" header="Role" sortable>
        <template #body="{ data }">
          <select
            v-model="data.role"
            @change="() => roleChanged(data)"
            class="bg-transparent border-none"
            :disabled="data.email === user_email"
          >
            <option value="FACULTY">Faculty</option>
            <option value="ADMIN">Admin</option>
            <option value="CHAIR">Chair</option>
          </select>
        </template>
      </Column>
      <Column field="tag" header="Tag" sortable>
        <template #body="{ data }">
          <AutoComplete
            placeholder="Enter Tag"
            dropdown
            v-model="data.tag"
            empty-search-message="No Existing Tags"
            style="height: 30px; box-shadow: none !important"
            class="sm:!w-80 !w-full rounded-md !h-10 border !border-gray-100"
            :suggestions="tags"
            @complete="onComplete"
          />
        </template>
      </Column>
      <Column header="Save/Delete">
        <template #body="{ data }">
          <span
            class="underline cursor-pointer h-[16px]"
            @click="showUpdateConfirmPopup(data)"
            title="Save Role"
            ><img :src="SaveIcon2" alt="Save Icon" class="w-4 ms-2 me-2"
          /></span>
          <span
            class="underline cursor-pointer h-[16px]"
            @click="showDeleteConfirmPopup(data)"
            title="Delete request"
          >
            <img
              src="../assets/trash-icon.png"
              alt="Delete Icon"
              class="w-4 ml-4"
          /></span>
        </template>
      </Column>
    </DataTable>
  </main>

  <Dialog
    :dismissable-mask="true"
    v-model:visible="confirmUserSavingPopupIsVisible"
    modal
    header="Account Update Verification"
    :style="{ width: '25rem' }"
  >
    <h3
      class="text-surface-500 dark:text-surface-400 font-normal mt-1 text-sm leading-7 block mb-5"
    >
      Are you sure you want to change this user's account information?
    </h3>
    <div class="flex">
      <Button
        type="button"
        label="No, Cancel"
        severity="secondary"
        @click="cancelConfirmPopup"
      ></Button>
      <Button
        type="button"
        label="Yes, I am sure"
        @click="save_role_and_tag"
        class="!bg-udmercy-blue ml-4 !border-none"
      ></Button>
    </div>
  </Dialog>

  <Dialog
    :dismissable-mask="true"
    v-model:visible="confirmUserDeletePopupIsVisible"
    modal
    header="Account Update Verification"
    :style="{ width: '25rem' }"
  >
    <h3
      class="text-surface-500 dark:text-surface-400 font-normal mt-1 text-sm leading-7 block mb-5"
    >
      Are you sure you want to delete this user's account?
    </h3>
    <div class="flex">
      <Button
        type="button"
        label="No, Cancel"
        severity="secondary"
        @click="cancelConfirmPopup"
      ></Button>
      <Button
        type="button"
        label="Yes, I am sure"
        @click="delete_faculty"
        class="!bg-udmercy-blue ml-4 !border-none"
      ></Button>
    </div>
  </Dialog>
</template>

<script lang="ts" setup>
import DataTable from "primevue/datatable";
import SaveIcon2 from "../assets/save-icon-2.png";
import Column from "primevue/column";
import Dialog from "primevue/dialog";
import SearchIcon from "../assets/search-icon.png";
import DetroitMercyLogo from "../assets/detroit-mercy-logo.png";
import InputText from "primevue/inputtext";
import { ref, onMounted, computed } from "vue";
import BackArrow from "../assets/left-arrow.png";
import Button from "primevue/button";
import axios from "axios";
import AutoComplete from "primevue/autocomplete";
import { TYPE, useToast } from "vue-toastification";

const confirmUserSavingPopupIsVisible = ref<boolean>(false);
const search_field = ref<string>("");

const tags = ref<string[]>([]);
const originalTags = ref<string[]>([]);
const accountBeingUpdated = ref<any>({});
const confirmUserDeletePopupIsVisible = ref<boolean>(false);
const user_email = ref<string>("");

function roleChanged(data) {
  if (data.role === "CHAIR") {
    if (data.tag === "") {
      data.tag = `${data.department} Chair`;
    }
  }
}

const fileteredFaculty = computed(() => {
  if (search_field.value === "") {
    return faculty_member_list.value; // Return all faculties if search field is empty
  }

  // Filter the faculties based on the name (case-insensitive search)
  return faculty_member_list.value.filter((faculty) =>
    faculty.name.toLowerCase().includes(search_field.value.toLowerCase())
  );
});

function showUpdateConfirmPopup(data) {
  accountBeingUpdated.value = data;
  confirmUserSavingPopupIsVisible.value = true;
}

/**
 * Shows the confirmation popup for deleting a user account. If the account
 * that is attempting to be deleted is the current user's account, an error
 * toast is shown and the popup is not shown.
 *
 * @param {object} data The user account data to be deleted.
 */
function showDeleteConfirmPopup(data) {
  if (data.email === user_email.value) {
    toast("You cannot delete your own account!!", {
      type: TYPE.ERROR,
    });

    return;
  }
  accountBeingUpdated.value = data;
  confirmUserDeletePopupIsVisible.value = true;
}

function cancelConfirmPopup() {
  confirmUserDeletePopupIsVisible.value = false;
  confirmUserSavingPopupIsVisible.value = false;
  accountBeingUpdated.value = {};
}

function onComplete(event) {
  const query = event.query.toLowerCase();

  if (!event.query.trim().length) {
    tags.value = [...originalTags.value]; // Assuming originalTags holds the original unfiltered list of tags
  } else {
    tags.value = originalTags.value.filter((tag) => {
      return tag.toLowerCase().includes(query);
    });
  }
}

interface Faculties {
  id: string;
  name: string;
  email: string;
  role: string;
  tag: string;
}
const faculty_member_list = ref<Faculties[]>([]);

/**
 * Fetches the list of all faculty members from the server and populates
 * the `faculty_member_list` with their details.
 *
 * The function makes an asynchronous GET request to the API endpoint
 * for retrieving all faculty data. The response data is then mapped to 
 * an array of objects containing each faculty member's id, full name, 
 * email, role, tag, and department, which is stored in `faculty_member_list`.
 *
 * @returns {Promise<void>} A promise that resolves when the data fetching
 * and processing is complete.
 */

async function get_faculty() {
  let res = await axios.get(
    `${import.meta.env.VITE_API_URL}/admin/retrieve-all-faculty`
  );

  faculty_member_list.value = res.data.map((faculty: any) => ({
    id: faculty._id,
    name: faculty.firstName + " " + faculty.lastName,
    email: faculty.workEmail,
    role: faculty.role,
    tag: faculty.tag,
    department: faculty.department,
  }));
}

async function get_tags() {
  let res = await axios.get(
    `${import.meta.env.VITE_API_URL}/admin/retrieve-faculty-tags`
  );

  if (res.data.length !== 0) {
    originalTags.value = res.data.map((tag: any) => tag.tag); // Populate tags array
  } else {
    originalTags.value = ["No Tags Exist"]; // Fallback value if no tags are found
  }
}

const toast = useToast();

/**
 * Makes a POST request to save the updated role and tag of a faculty member.
 *
 * If the currently logged in user is trying to change their own admin status,
 * a toast error is shown. Otherwise, the request is made and, if successful,
 * a toast info message is shown. If the request fails, an error toast message
 * is shown.
 *
 * After the request is made (successfully or not), the account being updated
 * is reset to an empty object and the confirmation popup is closed.
 */
async function save_role_and_tag() {
  const faculty = accountBeingUpdated.value;
  try {
    console.log("Faculty", faculty);

    if(faculty.email === user_email.value && faculty.role !== "ADMIN")
      toast("You cannot change your own admin status!", {type: TYPE.ERROR,});
    else{
      let res = await axios.post(
        `${import.meta.env.VITE_API_URL}/admin/save-role-and-tag`,
        faculty
      );

      toast("User account information saved", {
        type: TYPE.INFO,
      });
      console.log(res, "Role Saved");
    }
  } catch (err) {
    toast("An unexpected error occured when updating this user", {
      type: TYPE.ERROR,
    });
    console.log(err);
  } finally {
    accountBeingUpdated.value = {};
    confirmUserSavingPopupIsVisible.value = false;
  }
}

/**
 * Makes a POST request to delete the currently selected faculty member.
 *
 * If the request is successful, the currently selected faculty is reset to an
 * empty object and the confirmation popup is closed. If the request fails, an
 * error toast message is shown. The currently selected faculty is reset to an
 * empty object and the confirmation popup is closed in any case.
 */
async function delete_faculty() {
  try {
    const faculty = accountBeingUpdated.value;

    let res = await axios.post(
      `${import.meta.env.VITE_API_URL}/admin/delete-faculty`,
      faculty
    );
    console.log(res, "Deleted");

    get_faculty();
  } catch (err) {
    toast("An unexpected error occured when deleting this user", {
      type: TYPE.ERROR,
    });
    console.log(err);
  } finally {
    accountBeingUpdated.value = {};
    confirmUserSavingPopupIsVisible.value = false;
  }
}

onMounted(async () => {
  let res = await axios
    .get(`${import.meta.env.VITE_API_URL}/api/retrieve-account-information`)
    .then((response) => {
      user_email.value = response.data.workEmail;
      console.log(response);
    });

  get_faculty();
  get_tags();
});
</script>
