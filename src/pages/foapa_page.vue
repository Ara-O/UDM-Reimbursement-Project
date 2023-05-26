<template>
  <div class="foapa-list">
  <h2>Existing FOAPAs</h2>
  <ul>
    <li>FOAPA 1</li>
    <li>FOAPA 2</li>
    <li>FOAPA 3</li>
    <!-- More FOAPAs here -->
  </ul>
</div>

<div class="add-foapa-form">
  <h2>Add a New FOAPA</h2>
  <form>
    <label for="foapa-name">Name:</label>
    <input type="text" id="foapa-name" name="foapa-name">
    <br>
    <label for="foapa-description">Description:</label>
    <textarea id="foapa-description" name="foapa-description"></textarea>
    <br>
    <input type="submit" value="Add FOAPA">
  </form>
</div>
</template>

<script lang="ts" setup>
import axios from "axios";
import { onMounted, ref, reactive } from "vue";
import { useRouter } from "vue-router";

</script>
