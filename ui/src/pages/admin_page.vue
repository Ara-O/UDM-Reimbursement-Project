<template>
  <main class="px-12 py-10">
    <div class="flex items-center gap-10">
      <img :src="DetroitMercyLogo" alt="Detroit Mercy Logo" class="w-44" />

      <div>
        <header class="mb-8">
          <h1 class="text-xl font-semibold">Welcome Admin,</h1>
        </header>

        <!-- Summary Section -->
        <section>
          <h2 class="text-lg ml-0 font-semibold m-4 text-gray-800">Overview</h2>
          <summary-section
            :pending-requests="filtered_pending_requests"
          ></summary-section>
        </section>
      </div>

      <!-- Top Right Icons -->
      <img
        :src="NotificationIcon"
        alt="Notification Icon"
        class="absolute top-[3.75rem] cursor-pointer right-16 w-5"
      />
    </div>

    <!-- Naviagation Menu -->
    <div class="mt-10 flex gap-6">
      <p class="text-sm underline cursor-pointer">
        View All Submitted Requests History
      </p>
      <p class="text-sm underline cursor-pointer">View Feedback</p>
      <p
        class="cursor-pointer text-sm underline"
        @click="user_management_popup_is_visible = true"
      >
        User Management
      </p>
    </div>
    <!-- Pending Requests Section -->
    <section class="mt-10">
      <h2 class="text-lg font-semibold mb-4">Manage Pending Requests</h2>

      <input
        v-model="search_field"
        class="max-w-[50%] py-3 px-5 border-gray-300 border border-solid rounded-md w-full mt-2"
        placeholder="Search through pending requests"
      />
      <div class="mt-4 flex gap-3 flex-wrap">
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

      <!-- Cards Section -->
      <div class="flex mt-6">
        <div>
          <!-- GRID VIEW -->
          <div class="flex gap-3 flex-wrap">
            <reimbursement-card-grid-admin
              v-for="request in filtered_pending_requests"
              v-if="filtered_pending_requests.length !== 0"
              :request="request"
              @reload-requests-list="populate_submitted_tickets"
            ></reimbursement-card-grid-admin>
            <h3 v-else class="text-sm mt-0 text-gray-400 font-medium">
              No pending requests
            </h3>
          </div>
        </div>
      </div>
    </section>
    <ConfirmDialog></ConfirmDialog>

    <!-- User management dialog -->
    <Dialog
      v-model:visible="user_management_popup_is_visible"
      modal
      header="User Management"
    >
      <p class="text-sm">Search for faculty member</p>

      <InputText
        placeholder="Enter Faculty Name"
        class="mt-2 w-96"
        style="
          .p-inputtext {
            padding-left: 20px;
            height: 45px;
            font-size: 13px !important;
          }
        "
      />

      <DataTable
        :value="faculty_list"
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
            <select name="" id="">
              <option value="" :selected="data.role === 'user'">User</option>
              <option value="" :selected="data.role === 'faculty'">
                Faculty
              </option>
              <option value="" :selected="data.role === 'admin'">Admin</option>
            </select>
          </template>
        </Column>
      </DataTable>
    </Dialog>
  </main>
</template>

<script setup lang="ts">
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import ColumnGroup from "primevue/columngroup"; // optional
import Row from "primevue/row";
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import Select from "primevue/select";
import Skeleton from "primevue/skeleton";
import NotificationIcon from "../assets/notification-icon.png";
import { ref, watch } from "vue";
import {
  ReimbursementTicket,
  TicketAndFaculty,
  UserInformationSummary,
} from "../types/types";
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "vue-toastification";
import ReimbursementCardGridAdmin from "../components/dashboard/ReimbursementCardGridAdmin.vue";
import axios from "axios";
import SummarySection from "../components/admin/SummarySection.vue";
import DetroitMercyLogo from "../assets/detroit-mercy-logo.png";
import ConfirmDialog from "primevue/confirmdialog";
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
const pending_requests = ref<ReimbursementTicket[]>([]);

const filtered_pending_requests = ref<TicketAndFaculty[]>([]);

const confirm = useConfirm();
const toast = useToast();
const user_management_popup_is_visible = ref<boolean>(false);
populate_submitted_tickets();

const faculty_list = [
  {
    name: "Bobby",
    email: "something",
    role: "faculty",
  },
  {
    name: "George",
    email: "something",
    role: "faculty",
  },
];
// watch(pending_requests, (newValue) => {
//   filtered_pending_requests.value = newValue
// }, {
//   immediate: true
// }) I really just be testing someting

async function populate_submitted_tickets() {
  let res = await axios.get(
    `${import.meta.env.VITE_API_URL}/api/retrieve-submitted-requests`
  );

  filtered_pending_requests.value = res.data;
}
</script>

<style scoped>
/* Tailwind CSS styles are applied directly via classes. */
</style>
