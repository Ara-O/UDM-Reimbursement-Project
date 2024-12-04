<template>
  <div class="px-12 py-10">
    <header class="mb-8">
      <h1 class="text-2xl font-semibold">Admin Dashboard</h1>
    </header>

    <!-- Pending Requests Section -->
    <section>
      <h2 class="text-lg font-semibold mb-4">Pending Requests</h2>

      <InputText id="over_label" v-model="search_field" class="max-w-[90%] w-full mt-2" style=".p-inputtext {
    width: 100%;
    padding-left: 25px;
    height: 50px;
    font-size: 14px !important;
  }
  " placeholder="Search through pending requests" />
      <div class="mt-4 flex gap-3 flex-wrap">
        <Select v-model="view" :options="views" default-value="Grid View" placeholder="Grid View"
          class="w-full md:w-40">
          <template #dropdownicon>
            <i class="pi pi-th-large" v-if="view === 'Grid View'" />
            <i class="pi pi-list" v-if="view === 'List View'" />
            <i class="pi pi-table" v-if="view === 'Table View'" />

          </template>
        </Select>
        <Select v-model="filter" :options="filter_options" placeholder="Filter" class="w-full md:w-40">
          <template #dropdownicon>
            <i class="pi pi-filter" />
          </template>
        </Select><Select v-model="sort" :options="sort_options" placeholder="Sort" class="w-full md:w-40">
          <template #dropdownicon>
            <i class="pi pi-sort-alt" />
          </template>
        </Select>
      </div>
      <!-- Cards Section -->
      <div class="flex mt-6">
        <div>
          <!-- GRID VIEW -->
          <!-- <div class="flex gap-3 flex-wrap" v-if="view === 'Grid View'"> -->
          <div class="flex gap-3 flex-wrap">
            <reimbursement-card-grid-admin v-for="request in filtered_pending_requests"
              :request="request"></reimbursement-card-grid-admin>
          </div>

          <!-- LIST VIEW -->
          <!-- <div class="reimbursement-wrapper-list" v-if="view === 'List View'"> -->
          <!-- <reimbursement-card-list v-for="request in filtered_reimbursement_data" :request="request"
                         @user-duplicated-a-request="userDuplicatedARequest"
                        @user-wants-to-delete-request="confirmDelete"></reimbursement-card-list>
                    <skeleton height="11rem" width="24rem" v-else></skeleton>
                </div> -->


        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import InputText from 'primevue/inputtext';
import Select from 'primevue/select';
import Skeleton from 'primevue/skeleton';
import { ref, watch } from 'vue';
import { ReimbursementTicket, UserInformationSummary } from '../types/types';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'vue-toastification';
import ReimbursementCardGridAdmin from '../components/dashboard/ReimbursementCardGridAdmin.vue';

const search_field = ref<string>("")
const views = ["Grid View", "Table View", "List View"]
const sort_options = ["Name (Ascending)", "Name (Descending)", "Cost (Ascending)", "Cost (Descending)", "None"]
const filter_options = ["In Progress", "Submitted"]
const view = ref<string>("Grid View")
const filter = ref<string>("")
const sort = ref<string>("")
const pending_requests = ref<ReimbursementTicket[]>([])


const filtered_pending_requests = ref<ReimbursementTicket[]>([{
  _id: "vew",
  reimbursementName: "baka",
  reimbursementReason: "something",
  destination: "",
  paymentRetrievalMethod: "Hold for Pickup",
  UDMPUVoucher: false,
  guestInformation: [],
  totalCost: 300,
  reimbursementReceipts: [],
  reimbursementStatus: "In progress",
  reimbursementDate: "12/12/2020",
  activities: [],
  foapaDetails: [],
  knowFoapa: false
}])

const confirm = useConfirm()
const toast = useToast()

// watch(pending_requests, (newValue) => {
//   filtered_pending_requests.value = newValue
// }, {
//   immediate: true
// })

import axios from 'axios';

    async function populate_submitted_tickets(){
      let res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/retrieve-submitted-requests`
      );

      return res
    }

</script>

<style scoped>
/* Tailwind CSS styles are applied directly via classes. */
</style>