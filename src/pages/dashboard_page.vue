<template>
  <section class="dashboard-page">
    <section class="foapa-number-section">
      <h3>Foapa Numbers</h3>
      <br />
      <div class="foapa-number-wrapper">
        <div class="foapa-number">
          <h3>#1234-1234232-1234</h3>
          <img src="../assets/trash-icon.png" alt="Trash" />
        </div>
        <div class="foapa-number">
          <h3>#1234-1234232-1234</h3>
          <img src="../assets/trash-icon.png" alt="Trash" />
        </div>
        <div class="foapa-number">
          <h3>#1234-1234232-1234</h3>
          <img src="../assets/trash-icon.png" alt="Trash" />
        </div>
      </div>
    </section>

    <section class="reimbursement-section">
      <h3>Welcome Mina</h3>
      <br />
      <div class="reimbursement-search-input">
        <input
          type="text"
          class="reimbusement-search"
          placeholder="Search Reimbursement"
        />
        <div class="search-button">
          <img
            src="../assets/search-icon.png"
            alt="Search icon"
            class="search-icon"
          />
        </div>
      </div>
      <div class="search-filters">
        <div class="filter selected">
          <h3>Sort by Date</h3>
        </div>
        <div class="filter">
          <h3>Sort by Date</h3>
        </div>
        <div class="filter">
          <h3>Sort by Date</h3>
        </div>
      </div>
      <br />
      <h3 style="font-weight: 500; font-size: 14.5px">All Reimbursements</h3>
      <br />
      <div class="reimbursement-wrapper">
        <div class="reimbursement">
          <h3>University Conference</h3>
          <h4>Status: Accepted</h4>
          <h5>12/12/2032</h5>
          <div class="reimbursement-buttons">
            <button>Delete</button>
            <button>View</button>
          </div>
        </div>
        <div class="reimbursement">
          <h3>University Conference</h3>
          <h4>Status: Accepted</h4>
          <h5>12/12/2032</h5>
          <div class="reimbursement-buttons">
            <button>Delete</button>
            <button>View</button>
          </div>
        </div>
        <div class="reimbursement">
          <h3>University Conference</h3>
          <h4>Status: Accepted</h4>
          <h5>12/12/2032</h5>
          <div class="reimbursement-buttons">
            <button>Delete</button>
            <button>View</button>
          </div>
        </div>
      </div>
    </section>
    <section class="user-information-section">
      <h3>User Information</h3>
    </section>
    <!-- <h3>hi</h3>
    <button @click="closeConnection">Close server connection</button> -->
  </section>
</template>

<script lang="ts" setup>
import axios from "axios";

function closeConnection() {
  axios.get("/close").catch((err) => {
    console.log(err);
  });
}
</script>

<style scoped>
.dashboard-page {
  margin-top: 30px;
  display: grid;
  grid-template-columns: 25% 50% 25%;
  gap: 0px;
}

.foapa-number-section {
  display: flex;
  align-items: center;
  flex-direction: column;
}

.foapa-number-section h3,
.user-information-section h3,
.reimbursement-section h3 {
  font-weight: 500;
  font-size: 16px;
}

.foapa-number {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  padding: 10px;
  gap: 30px;
  width: 300px;
  height: 59px;
  border: 1px solid rgba(246, 246, 246, 0.44);
  box-shadow: 0px 2px 2px rgb(83 83 83 / 17%);
  border-radius: 5px;
}

.foapa-number h3 {
  font-size: 14.5px;
  font-weight: 400;
}
.foapa-number img {
  width: 15px;
  cursor: pointer;
}

.foapa-number-wrapper {
  display: flex;
  flex-direction: column;
  gap: 25px;
}
.reimbusement-search {
  width: 100%;
  padding-left: 30px;
  box-sizing: border-box;
  border-radius: 5px;
  height: 50px;
  border: 1px solid #f7f7f7;
  outline: none;
  box-shadow: 0px 2px 2px rgb(83 83 83 / 17%);
}

.reimbursement-search-input {
  display: flex;
  gap: 30px;
}

.search-button {
  background: var(--udmercy-blue);
  height: auto;
  border-radius: 5px;
  cursor: pointer;
  width: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.search-icon {
  width: 25px;
}

.search-filters {
  display: flex;
  gap: 25px;
}

.filter {
  background-color: var(--udmercy-blue);
  border-radius: 30px;
  color: white;
  margin-top: 20px;
}

.selected {
  background-color: var(--udmercy-red);
}

.filter h3 {
  font-weight: 300;
  font-size: 13px;
  padding: 0px 20px;
}

.reimbursement {
  width: 49%;
  padding: 0px 30px;
  height: 180px;
  box-sizing: border-box;
  color: white;
  background: #002d72;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);
  border-radius: 11px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  position: relative;
  padding-top: 35px;
  justify-content: flex-start;
  align-items: flex-start;
}

.reimbursement h3,
.reimbursement h4,
.reimbursement h5 {
  margin: 0px;
}

.reimbursement h4 {
  font-weight: 400;
  font-size: 15px;
}
.reimbursement h5 {
  font-weight: 300;
  font-size: 14px;
}

.reimbursement-buttons {
  display: flex;
  justify-content: flex-end;
  width: 100%;
  position: absolute;
  gap: 10px;
  bottom: 20px;
  right: 20px;
}

.reimbursement-buttons button {
  background-color: var(--udmercy-red);
  border-radius: 30px;
  display: flex;
  align-items: center;
  color: white;
  font-size: 12px;
  height: 40px;
  cursor: pointer;
  border: solid 1px var(--udmercy-red);
  padding: 8px 20px;
}

.reimbursement-wrapper {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  row-gap: 20px;
}
</style>
