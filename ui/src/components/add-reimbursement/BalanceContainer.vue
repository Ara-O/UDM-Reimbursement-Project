<template>
    <div class="balance mt-0">
        <h4 class="overflow-hidden text-ellipsis whitespace-wrap !mt-0 font-medium text-gray-500 flex gap-3 flex-col max-h-68 overflow-auto">
            Total Cost of All Expenses:
            FOAPA Coverage: 
            -----------------------
            Amount Left:
        </h4>
    </div>
</template>

<script lang="ts" setup>
import { FoapaInput } from "../../types/types";

//const props = defineProps<{
  //  balance: FoapaInput;
//}>();

defineEmits(["deleteActivity"]);

</script>
  
<style scoped>
@import url("../../assets/styles/add-reimbursement-page.css");
</style>