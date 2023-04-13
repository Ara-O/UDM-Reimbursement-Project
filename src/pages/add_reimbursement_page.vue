<template>
  <section class="add-reimbursement-section">
    <section class="all-activities-section">
      <h3>All Activities</h3>
      <div class="activity">
        <h3>First Breakfast</h3>
        <h4>Date: 11/11/2022</h4>
        <div class="delete-option">
          <img
            src="../assets/trash-icon-white.png"
            alt="Trash icon"
            class="trash-icon"
          />
        </div>
      </div>
      <br />
      <button class="go-back-button">Go Back</button>
    </section>
    <section class="reimbursement-section">
      <h3 class="reimbursement-title">Reimbursement #1</h3>
      <div style="display: flex; align-items: center; gap: 20px; height: 20px">
        <img
          src="../assets/user-help-icon.png"
          alt="Help icon"
          class="help-icon"
        />
        <h4 style="font-weight: 400; font-size: 14px">
          Choose from one of the default options below or select other to create
          another type of expense
        </h4>
      </div>
      <h4 style="font-weight: 500">Expenses</h4>
      <div class="expenses-section">
        <div v-for="expense in expensesDefaults" class="expense">
          {{ expense }}
        </div>
      </div>
      <br />
      <div class="cost-and-other-section">
        <span>
          <h3>Other:</h3>
          <input
            type="text"
            placeholder="Select Expense name"
            class="input-field"
          />
        </span>
        <br />
        <span>
          <h3>Cost:</h3>
          <input type="text" placeholder="$ Cost" class="input-field" />
        </span>
      </div>
      <br />
      <h3 class="selected-option">Selected: Air/Train</h3>
      <div class="foapa-and-date-section">
        <div>
          <h3>FOAPA Number to use:</h3>
          <input
            type="text"
            placeholder="Select FOAPA to pay for activity with"
            class="input-field"
          />
        </div>
        <div>
          <h3>Date Of Activity:</h3>
          <input
            type="text"
            placeholder="Date of Activity"
            class="input-field"
          />
        </div>
      </div>

      <div class="add-receipt">
        <div class="add-receipt-text">Add Receipt:</div>
        <input
          type="file"
          id="avatar"
          name="avatar"
          accept="image/png, image/jpeg"
        />
      </div>
      <h5 class="terms-and-conditions">
        By adding an activity; I hereby certify that this claim is correct and
        reimbursable under published travel expense Policies & Procedures of UDM
      </h5>
      <br />
      <button class="add-reimbursement-button">Add Reimbursement</button>
    </section>
  </section>
</template>

<script lang="ts" setup>
const expensesDefaults = [
  "Lodging",
  "Breakfast",
  "Lunch",
  "Dinner",
  "Other",
  "Business Guest Meals",
  "Air/Train",
  "Parking",
  "Mileage",
  "Taxi/Bus/Car Rental",
  "Parking",
  "Registration",
];
</script>
<style scoped>
.add-reimbursement-section {
  display: grid;
  height: 100vh;
  gap: 50px;
  grid-template-columns: 25% 70%;
}

.all-activities-section {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.all-activities-section h3 {
  font-weight: 600;
}

.go-back-button {
  background-color: var(--udmercy-red);
  border-radius: 30px;
  display: flex;
  align-items: center;
  color: white;
  font-size: 12px;
  height: 40px;
  width: auto;
  cursor: pointer;
  border: solid 1px var(--udmercy-red);
  padding: 8px 20px;
}

.reimbursement-section {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.reimbursement-title {
  font-size: 25px;
}

.help-icon {
  width: 20px;
}

.expenses-section {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  /* heheh */
  width: 69vw;
}

.expenses-section div {
  background-color: var(--udmercy-blue);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 300;
  cursor: pointer;
  width: auto;
  border-radius: 7px;
  height: 43px;
  padding: 0px 25px;
  transition: all 250ms ease-in;
}

.expenses-section div:hover {
  background-color: #001d48;
}

.input-field {
  padding-left: 20px;
  width: 300px;
  height: 45px;
  background: #ffffff;
  border: 1px solid #f7f7f7;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.17);
  border-radius: 5px;
}

.cost-and-other-section {
  display: flex;
  gap: 20px;
}

.cost-and-other-section h3 {
  font-weight: 500;
  font-size: 14px;
}

.selected-option {
  font-weight: 400;
  font-size: 14.5px;
}

.foapa-and-date-section {
  display: flex;
  gap: 40px;
}

.foapa-and-date-section h3 {
  font-size: 14.5px;
  font-weight: 500;
}

.add-receipt-text {
  font-size: 14.5px;
}

.add-receipt {
  display: flex;
  gap: 20px;
  margin-top: 40px;
}

.terms-and-conditions {
  font-weight: 300;
  color: gray;
  width: 500px;
  font-size: 13px;
  line-height: 25px;
}

.add-reimbursement-button {
  background-color: var(--udmercy-red);
  border-radius: 30px;
  display: flex;
  align-items: center;
  color: white;
  font-size: 12px;
  height: 45px;
  justify-content: center;
  width: 250px;
  cursor: pointer;
  border: solid 1px var(--udmercy-red);
  padding: 8px 20px;
}

.activity {
  background: var(--udmercy-blue);
  color: white;
  width: 300px;
  height: 120px;
  border-radius: 20px;
  box-sizing: border-box;
  padding-left: 30px;
  padding-top: 10px;
  padding-bottom: 10px;
  position: relative;
}

.activity h3 {
  font-weight: 500;
  font-size: 15px;
}

.activity h4 {
  font-weight: 300;
  font-size: 12px;
}
.delete-option {
  position: absolute;
  background-color: var(--udmercy-red);
  right: 30px;
  bottom: 30px;
  padding: 14px 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
}

.activity .delete-option .trash-icon {
  filter: brightness(1);
  width: 15px;
}
</style>
