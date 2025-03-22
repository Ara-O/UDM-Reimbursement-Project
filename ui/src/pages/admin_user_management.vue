<template>
  <main class="px-10 mt-10">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="font-medium text-xl">User Management</h1>
        <div class="flex gap-3 items-center">
          <InputText
            placeholder="Enter Faculty Name"
            class="w-[30rem]"
            style="
              .p-inputtext {
                padding-left: 20px;
                height: 35px;
                font-size: 13px !important;
              }
            "
          />
          <Select
            v-model="view"
            :options="views"
            default-value="Grid View"
            placeholder="Grid View"
            class="w-full md:w-40"
          >
            <template #dropdownicon>
              <i class="pi pi-th-large" v-if="view === 'Grid View'" />
              <i class="pi pi-list" v-if="view === 'List View'" />
              <i class="pi pi-table" v-if="view === 'Table View'" />
            </template>
          </Select>
          <Select
            v-model="filter"
            :options="filter_options"
            placeholder="Filter"
            class="w-full md:w-40"
          >
            <template #dropdownicon>
              <i class="pi pi-filter" />
            </template> </Select
          ><Select
            v-model="sort"
            :options="sort_options"
            placeholder="Sort"
            class="w-full md:w-40"
          >
            <template #dropdownicon>
              <i class="pi pi-sort-alt" />
            </template>
          </Select>
        </div>
      </div>
      <img
        :src="DetroitMercyLogo"
        class="w-20 object-contain"
        alt="Detroit Mercy Logo"
      />
    </div>
    <DataTable
      :value="faculty_member_list"
      striped-rows
      tableStyle="min-width: 50rem"
      class="mt-5"
    >
      <Column field="name" header="Name" sortable></Column>
      <Column field="email" header="Email" sortable></Column>
      <Column field="role" header="Role" sortable>
        <!-- <select name="" id="">
        <option value="hi">hi</option>
          </select> -->
        <template #body="{ data }">
          <select v-model="data.role">
            <option value="USER">User</option>
            <option value="FACULTY">Faculty</option>
            <option value="ADMIN">Admin</option>
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
              style="height: 30px"
              class="border-sm shadow-sm sm:!w-80 !w-full rounded-md !h-10 border !border-gray-100"
              :suggestions="tags"
              @complete="onComplete"
              />
        </template>
      </Column>
      <Column header="Save/Delete">
        <template #body="{ data }">
          <span
              class="underline cursor-pointer h-[16px]"
              @click="save_role_and_tag(data)"
              title="Save Role"
              ><img src="../assets/save.png" alt="Save Icon" class="w-5 ms-2 me-2"/></span>
            <span
            class="underline cursor-pointer h-[16px]"
            @click="delete_faculty(data)"
            title="Delete request"
            >
            <img src="../assets/trash-icon.png" alt="Delete Icon" class="w-4 ms-2 "
          /></span>
        </template>
      </Column>
    </DataTable>
  </main>
</template>

<script lang="ts" setup>
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import DetroitMercyLogo from "../assets/detroit-mercy-logo.png";
import InputText from "primevue/inputtext";
import Select from "primevue/select";
import { ref, onMounted } from "vue";
import axios from "axios";
import AutoComplete from "primevue/autocomplete";

const search_field = ref<string>("");
const views = ["Grid View", "Table View", "List View"];
const sort_options = [
  "Name (Ascending)",
  "Name (Descending)",
  "Cost (Ascending)",
  "Cost (Descending)",
  "None",
];
const filter_options = ["In Progress", "Submitted"];
const view = ref<string>("Grid View");
const filter = ref<string>("");
const sort = ref<string>("");
const tags = ref<string[]>([])
const originalTags = ref<string[]>([])



function onComplete(event) {
  const query = event.query.toLowerCase();

  console.log("query", query)

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
  }));
}

async function get_tags(){
  let res = await axios.get(
    `${import.meta.env.VITE_API_URL}/admin/retrieve-faculty-tags`
  );

  if (res.data.length !== 0) {
    originalTags.value = res.data.map((tag: any) => tag.tag);  // Populate tags array
  } else {
    originalTags.value = ["No Tags Exist"];  // Fallback value if no tags are found
  }

}

async function save_role_and_tag(faculty){
  try{
    console.log("Faculty",faculty)
    let res = await axios.post(`${import.meta.env.VITE_API_URL}/admin/save-role-and-tag`, faculty)
    console.log(res, "Role Saved")
  }
  catch(err){
    console.log(err)
  }
}

async function delete_faculty(faculty){
  try{
    let res = await axios.post(`${import.meta.env.VITE_API_URL}/admin/delete-faculty`, faculty)
    console.log(res, "Deleted")

    get_faculty()
  }
  catch (err) {
    console.log(err);
  }
}

onMounted(() =>{
  get_faculty()
  get_tags()
})
</script>

