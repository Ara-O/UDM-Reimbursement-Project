<template>
    <div class="foapa relative">
        <h3 class="overflow-hidden text-ellipsis whitespace-nowrap" :title="foapa.foapaNumber">{{ foapa.foapaNumber }}</h3>
        <h4 class="overflow-hidden text-ellipsis !text-[14px] whitespace-nowrap" :title="'' + foapa.cost">
            Cost: ${{ foapa.cost }}
        </h4>
        <div title="Delete activity" class="activity-option absolute right-10 bottom-5"
            @click="$emit('deleteActivity', foapa.foapaNumber)">
            <img src="../../assets/trash-icon-white.png" alt="Trash icon" class="trash-icon w-3.5" />
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
  