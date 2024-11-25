<template>
    <h3 class="text-base font-semibold mt-5">User Information</h3>
    <div class="flex items-center justify-start gap-5 mt-7">
        <img :src="DetroitMercyLogo" alt="Detroit Mercy Logo" class="w-16" />
        <span class="flex flex-col gap-1">
            <skeleton v-if="!user_information_has_loaded" height="20px"></skeleton>
            <p title="Mina Maleki"
                class="text-sm my-0 h-5 font-semibold max-w-32 whitespace-nowrap overflow-hidden text-ellipsis" v-else>
                {{ user_information_data?.full_name || "Error" }}
            </p>
            <skeleton v-if="!user_information_has_loaded" height="20px" width="60px"></skeleton>
            <p class="text-nm my-0 font-medium h-5" v-else>{{ user_information_data?.email_address || "Error" }}</p>
            <router-link to="/account" class="underline my-0 text-xs text-black">Manage account</router-link>
        </span>
    </div>
</template>

<script lang="ts" setup>
import { inject, ref, watch } from "vue";
import DetroitMercyLogo from "../../assets/detroit-mercy-logo.png";
import Skeleton from "primevue/skeleton";
import { UserInformationSummary } from "../../types/types";

const user_information_has_loaded = ref<boolean>(false);

const user_information_data = inject<null | UserInformationSummary>("user_information_data")

watch(user_information_data as object, (newValue) => {
    user_information_has_loaded.value = true;
    console.log('Value changed:', newValue);
});


</script>
