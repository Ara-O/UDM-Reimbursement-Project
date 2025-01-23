<template>
  <section
    class="grid lg:grid-cols-[400px_auto] grid-cols-[auto] h-screen overflow-auto"
  >
    <dashboard-left-panel class="my-0 hidden lg:block"></dashboard-left-panel>
    <dashboard-right-panel class="my-0"></dashboard-right-panel>
    <feedback-icon></feedback-icon>
  </section>
  <article class="block lg:hidden">
    <side-navigation-bar></side-navigation-bar>
  </article>
</template>

<script lang="ts" setup>
import DashboardLeftPanel from "../components/dashboard/DashboardLeftPanel.vue";
import DashboardRightPanel from "../components/dashboard/DashboardRightPanel.vue";
import FeedbackIcon from "../components/dashboard/FeedbackPill.vue";
import SideNavigationBar from "../components/dashboard/SideNavigationBar.vue";
import axios from "axios";
import "../assets/styles/dashboard-page.css";
import { onMounted, ref, computed, watch, provide } from "vue";
import { useRouter } from "vue-router";
import { TYPE, useToast } from "vue-toastification";
import {
  FoapaStuff,
  ReimbursementTicket,
  UserInformationSummary,
} from "../types/types";

const router = useRouter();

const toast = useToast();

// Providers

const user_information_data = ref<null | UserInformationSummary>(null);
provide("user_information_data", user_information_data);

const foapa_data = ref<FoapaStuff[]>([]);
provide("foapa_data", foapa_data);

const reimbursement_data = ref<ReimbursementTicket[]>([]);
provide("reimbursement_data", { reimbursement_data, reloadReimbursementData });

async function retrieveDashboardData() {
  try {
    let res = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/retrieve-dashboard-data`
    );

    const dashboard_data = res.data;

    user_information_data.value = {
      first_name: dashboard_data.firstName,
      full_name: dashboard_data.firstName + " " + dashboard_data.lastName,
      email_address: dashboard_data.workEmail,
      role: dashboard_data?.role || "FACULTY",
    };

    foapa_data.value = dashboard_data.foapaDetails;

    reimbursement_data.value = dashboard_data.reimbursementTickets;

    // console.log(dashboard_data)
  } catch (err) {
    toast(
      "There was an error fetching your dashboard data. Please log-in again",
      {
        type: TYPE.ERROR,
      }
    );
    localStorage.setItem("token", "");
    router.push("/");
    console.log(err);
  }
}

async function reloadReimbursementData() {
  try {
    let res = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/retrieve-dashboard-data`
    );

    const dashboard_data = res.data;

    reimbursement_data.value = dashboard_data.reimbursementTickets;
  } catch (err) {
    toast("There was an error when updating your dashboard data", {
      type: TYPE.ERROR,
    });
  }
}
onMounted(() => {
  if (
    localStorage.getItem("token") === null ||
    localStorage.getItem("token") === ""
  ) {
    router.push("/");
  } else {
    retrieveDashboardData();
  }
});
</script>

<style>
.image-container {
  text-align: center;
  margin-top: 20px;
}

.udmercy-logo {
  width: 60px;
  /* Adjust the width to your desired size */
  height: auto;
  /* Maintain the aspect ratio */
}

.table {
  width: 100%;
}

.p-datatable .p-datatable-thead > tr > th {
  background-color: #002d72;
  color: white;
}

.table,
.td,
.th,
.tr {
  border: solid 1px black;
  padding: 8px 14px;
  font-size: 13.5px;
}

.p-datatable .p-datatable-thead > tr > th {
  background-color: #002d72;
  color: white;
  padding: 10px 25px;
  font-size: 14px;
}

.border-solid {
  border-style: none;
}

.p-datatable-column-header-content {
  gap: 15px !important;
  justify-content: center;
}

.p-datatable-sortable-column:not(.p-datatable-column-sorted):hover {
  background-color: #002d72 !important;
  color: white !important;
}

.p-datatable.p-component.p-datatable-gridlines.border.border-collapse.border-solid.border-black {
  border: 1px solid #002d72;
}

.p-datatable.p-datatable-gridlines:has(.p-datatable-thead):has(
    .p-datatable-tbody
  )
  .p-datatable-tbody
  > tr
  > td {
  border-width: 0 0 1px 1px;
  text-align: center;
}

.p-datatable.p-datatable-gridlines:has(.p-datatable-thead):has(
    .p-datatable-tbody
  )
  .p-datatable-tbody
  > tr
  > td {
  border-width: 0 0 1px 1px;
  font-size: 14px;
}

.p-row-even,
.p-row-odd {
  height: 40px;
}

.p-datatable-table {
  border: solid 2px #002967;
  border-collapse: collapse;
}

td {
  text-align: center;
}

.select-dropdown {
  -moz-appearance: none;
  /* Firefox */
  -webkit-appearance: none;
  /* Safari and Chrome */
  appearance: none;
}
</style>
