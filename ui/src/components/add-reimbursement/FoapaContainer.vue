<template>
    <div class="foapa">
        <h3 class="overflow-hidden text-ellipsis whitespace-nowrap" :title="foapa.foapaNumber">{{ foapa.foapaNumber }}</h3>
        <h4 class="overflow-hidden text-ellipsis whitespace-nowrap" :title="'' + foapa.assignedCost">
            Cost: ${{ foapa.assignedCost }}
        </h4>
        <div class="activity-options-wrapper">
            <div title="Delete activity" class="activity-option" @click="$emit('deleteActivity', foapa.foapaNumber)">
                <img src="../../assets/trash-icon-white.png" alt="Trash icon" class="trash-icon w-5" />
            </div>
        </div>
    </div>
</template>
  

<script lang="ts" setup>
import { FoapaInput } from "../../types/types";

const props = defineProps<{
    foapa: FoapaInput;
}>();

defineEmits(["deleteActivity"]);

</script>
  
<style scoped>
@import url("../../assets/styles/add-reimbursement-page.css");
</style>
  