<template>
  <div class="reimbursement-title">
    <input
      class="reimbursement-title-text"
      v-model="currentReimbursement.reimbursementName"
      placeholder="Reimbursement Title"
    />
    <img
      src="../../assets/edit-icon.png"
      class="edit-icon-button"
      alt="Edit icon"
    />
  </div>
  <h3 style="margin-top: 0px">Reimbursement Ticket Information</h3>
  <div class="expenses-fields-wrapper">
    <span>
      <h3 style="font-size: 14.5px">Reason for Travel/Expense:</h3>
      <input
        name="expenseReason"
        v-model="currentReimbursement.reimbursementReason"
        class="input-field"
      />
    </span>
    <span>
      <h3 style="font-size: 14.5px">Destination-City,State,Country:</h3>
      <input
        name="expenseReason"
        v-model="currentReimbursement.destination"
        class="input-field"
      />
    </span>
  </div>
  <br />
  <div>
    <div class="reimbursement-additional-info-wrapper">
      <span style="display: flex; gap: 3px">
        <input
          type="radio"
          value="Hold for Pickup"
          id="hold-for-pickup"
          v-model="currentReimbursement.paymentRetrievalMethod"
        />
        <label for="hold-for-pickup" style="font-size: 14px"
          >Hold for Pickup</label
        >
      </span>
      <span style="display: flex; gap: 7px">
        <input
          type="radio"
          value="Direct Deposit"
          id="direct-deposit"
          v-model="currentReimbursement.paymentRetrievalMethod"
        />
        <label for="direct-deposit" style="font-size: 14px"
          >Direct Deposit</label
        >
      </span>
    </div>
    <br />
    <span>
      <input
        type="checkbox"
        id="udmpu-voucher"
        v-model="currentReimbursement.UDMPUVoucher"
      />
      <label for="udmpu-voucher" style="font-size: 14px"
        >Check if using UDMPU 11.6 voucher (please attach voucher/log)</label
      >
    </span>
    <br />
    <br />
    <div>
      <span>
        <input
          type="checkbox"
          id="guest-checkbox"
          v-model="currentReimbursement.guest"
        />
        <label for="guest-checkbox" style="font-size: 14px"
          >Check if adding Guest</label
        >
      </span>

      <div class="additional-fields" v-if="currentReimbursement.guest">
        <div class="input-field-wrapper">
          <div class="row1">
            <input
              type="text"
              v-model="currentReimbursement.employeeFirstName"
              placeholder="Employee First Name"
              class="input-field"
            />
            <input
              type="text"
              v-model="currentReimbursement.employeeLastName"
              placeholder="Employee Last Name"
              class="input-field"
            />
          </div>
          <div class="row2">
            <input
              type="text"
              v-model="currentReimbursement.guestFirstName"
              placeholder="Guest Name"
              class="input-field"
            />
            <input
              type="text"
              v-model="currentReimbursement.guestLastName"
              placeholder="Guest Last Name"
              class="input-field"
            />
            <input
              type="text"
              v-model="currentReimbursement.guestAssociation"
              placeholder="Guest Association"
              class="input-field"
            />
            <button
              class="add-guest-button"
              @click="addGuest"
              style="width: auto"
            >
              <img
                src="../../assets/add-icon.png"
                alt="add-icon"
                class="add-icon"
              />
            </button>
          </div>
          <div
            v-for="(guestData, index) in guestList"
            :key="index"
            class="past-guest-info"
          >
            <div class="input-field-wrapper">
              <div class="row1">
                <input
                  type="text"
                  v-model="guestData[index]"
                  class="input-field"
                  placeholder="Employee First Name"
                />
                <input
                  type="text"
                  v-model="guestData[index]"
                  class="input-field"
                  placeholder="Employee Last Name"
                />
              </div>
              <div class="row2">
                <input
                  type="text"
                  v-model="guestData[index]"
                  class="input-field"
                  placeholder="Guest Name"
                />
                <input
                  type="text"
                  v-model="guestData[index]"
                  class="input-field"
                  placeholder="Guest Last Name"
                />
                <input
                  type="text"
                  v-model="guestData[index]"
                  class="input-field"
                  placeholder="Guest Association"
                />
                <button class="delete-guest-button">
                  <img
                    src="../../assets/trash-icon.png"
                    alt="Trash"
                    class="delete-icon"
                    @click="
                      deleteGuest(
                        guestData.employeeFirstName,
                        guestData.employeeLastName,
                        guestData.guestFirstName,
                        guestData.guestLastName,
                        guestData.guestAssociation
                      )
                    "
                  />
                </button>
                <button class="edit-guest-button">
                  <img
                    src="../../assets/edit-icon-red.png"
                    alt="Edit"
                    class="delete-icon"
                    @click="editGuest(guestData)"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ReimbursementTicket } from "../../types/types";
import { toRefs, ref, Ref } from "vue";
let props = defineProps<{ currentReimbursement: ReimbursementTicket }>();
const currentReimbursement = toRefs(props).currentReimbursement;

const guestList: Ref<string[]> = ref([]);
const guestData = ref({
  employeeFirstName: "",
  employeeLastName: "",
  guestFirstName: "",
  guestLastName: "",
  guestAssociation: "",
});

const addGuest = () => {
  guestList.value.push(JSON.stringify({ ...currentReimbursement.value }));
  guestData.value = {
    employeeFirstName: "",
    employeeLastName: "",
    guestFirstName: "",
    guestLastName: "",
    guestAssociation: "",
  };
};

const deleteGuest = (
  employeeFirstName,
  employeeLastName,
  guestFirstName,
  guestLastName,
  guestAssociation
) => {
  // TODO
};

const editGuest = (guest) => {
  // TODO
};
</script>

<style scoped>
@import url("../../assets/styles/add-reimbursement-page.css");
</style>
