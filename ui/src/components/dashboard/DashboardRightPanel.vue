<template>
    <section class="box-border px-7 py-5">
        <div class="flex items-center gap-1">
            <h3 class="text-base font-semibold">Welcome</h3>
            <Skeleton width="100px" height="20px" class="ml-1" v-if="!user_information_has_loaded"></Skeleton>
            <h3 class="text-base font-semibold max-w-64 overflow-hidden text-ellipsis text-nowrap" v-else>
                {{ user_information_data?.first_name }}</h3>
        </div>

        <InputText id="over_label" v-model="search_field" class="max-w-[90%] mt-2"
            placeholder="Search through your reimbursement requests" />

        <div class="mt-4 flex gap-3">
            <Select v-model="view" :options="['Grid View', 'List View', 'Table View']" default-value="Grid View"
                placeholder="Grid View" class="w-full md:w-56">
                <template #dropdownicon>
                    <i class="pi pi-table" />
                </template>
            </Select>
            <Select v-model="filter" :options="['Name', 'Cost', 'Status']" placeholder="Filter" class="w-full md:w-56">
                <template #dropdownicon>
                    <i class="pi pi-filter" />
                </template>
            </Select><Select v-model="sort" :options="['Name', 'Cost', 'Status']" placeholder="Sort"
                class="w-full md:w-56">
                <template #dropdownicon>
                    <i class="pi pi-sort-alt" />
                </template>
            </Select>
        </div>

        <!-- Reimbursement list -->
        <!-- <section class="mt-6 flex items-center" v-if="!reimbursement_has_loaded">
            <img :src="NoReimbursementClaimIcon" alt="No reimbursement requests added" class="w-40 opacity-15">
            <p class="leading-8 text-gray-400">You have not added any reimbursement requests.
                <span>
                    <p class="inline text-udmercy-blue underline"> Click here to add one</p>
                </span>
            </p>
        </section> -->

        <section v-if="reimbursement_has_loaded">
            <span class="flex items-center gap-3 cursor-pointer" @click="goToReimbursementRequestPage">
                <p class="inline text-udmercy-blue underline text-[15px] font-medium"> Add a reimbursement request</p>
                <img :src="AddIcon" alt="Add Icon" class="w-3.5">
            </span>
            <div>
                <!-- GRID VIEW -->
                <div class="flex gap-3 flex-wrap" v-if="view === 'Grid View'">
                    <reimbursement-card-grid v-for="request in filtered_reimbursement_data" :request="request"
                        v-if="reimbursement_has_loaded"
                        @user-wants-to-delete-request="confirmDelete"></reimbursement-card-grid>
                    <skeleton height="11rem" width="24rem" v-else></skeleton>
                </div>

                <!-- LIST VIEW -->
                <div class="reimbursement-wrapper-list" v-if="view === 'List View'">
                    <reimbursement-card-list v-for="request in filtered_reimbursement_data" :request="request"
                        v-if="reimbursement_has_loaded"
                        @user-wants-to-delete-request="confirmDelete"></reimbursement-card-list>
                    <skeleton height="11rem" width="24rem" v-else></skeleton>
                </div>

                <!-- TABLE VIEW -->

            </div>
        </section>
        <ConfirmDialog></ConfirmDialog>
    </section>
</template>

<script lang="ts" setup>
import InputText from 'primevue/inputtext';
import axios from "axios"
import Skeleton from 'primevue/skeleton';
import Select from 'primevue/select';
import NoReimbursementClaimIcon from "../../assets/no-reimbursement-added.png"
import AddIcon from "../../assets/add-icon-blue.png"
import ReimbursementCardGrid from './ReimbursementCardGrid.vue';
import ReimbursementCardList from './ReimbursementCardList.vue';
import ConfirmDialog from 'primevue/confirmdialog';
import { inject, ref, watch } from 'vue';
import { ReimbursementTicket, UserInformationSummary } from '../../types/types';
import { useRouter } from 'vue-router';
import { useConfirm } from 'primevue/useconfirm';
import { TYPE, useToast } from 'vue-toastification';

const router = useRouter()
const search_field = ref<string>("")
const view = ref<string>("Grid View")
const filter = ref<string>("")
const sort = ref<string>("")
const user_information_has_loaded = ref<boolean>(true)
const reimbursement_has_loaded = ref<boolean>(true)
const user_information_data = inject<null | UserInformationSummary>("user_information_data")
const { reimbursement_data, reloadReimbursementData } = inject<any>("reimbursement_data")
const filtered_reimbursement_data = ref<ReimbursementTicket[]>([])
const confirm = useConfirm()
const toast = useToast()

watch(user_information_data as object, (newalue) => {
    user_information_has_loaded.value = true;
});

watch(reimbursement_data, (newValue) => {
    filtered_reimbursement_data.value = newValue
})

watch(search_field, (searchValue) => {
    filtered_reimbursement_data.value = reimbursement_data.value.filter((request) => request.reimbursementName
        .toLowerCase()
        .includes(searchValue.toLowerCase()))
})

function confirmDelete(id) {
    confirm.require({
        message: 'Are you sure you want to delete this reimbursement request?',
        header: 'Danger Zone',
        rejectLabel: 'Cancel',
        rejectProps: {
            label: 'Cancel',
            severity: 'secondary',
            outlined: true
        },
        acceptProps: {
            class: '!bg-udmercy-red hover:!bg-udmercy-red !border-udmercy-red hover:!border-udmercy-red',
            label: 'Delete',
            severity: 'danger'
        },
        accept: () => {
            const toastID = toast("Deleting reimbursement claim...", {
                type: TYPE.INFO,
            });

            axios
                .post(`${import.meta.env.VITE_API_URL}/api/delete-reimbursement`, {
                    id: id,
                })
                .then(() => {
                    reloadReimbursementData();
                    toast("Reimbursement claim deleted successfully", {
                        type: TYPE.SUCCESS,
                    });
                    toast.dismiss(toastID)
                })
                .catch((err) => {
                    alert(
                        err?.response?.data?.message ||
                        "An error occured, please try again later"
                    );
                });
        },
        reject: () => {
        }
    });
}

function goToReimbursementRequestPage() {
    router.push("/add-reimbursement")
}
</script>