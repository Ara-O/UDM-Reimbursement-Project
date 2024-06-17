<template>
    <main class="signup-page">
        <section class="left-section">
            <div class="udmercy-logo-wrapper">
                <img src="../assets/detroit-mercy-logo.png" alt="Detroit mercy logo" class="udmercy-logo" />
            </div>
        </section>
        <section class="right-section">
            <div class="udmercy-logo-wrapper-mobile">
                <img src="../assets/detroit-mercy-logo.png" alt="Detroit mercy logo" class="udmercy-logo-mobile" />
            </div>
            <h3 class="signup-title">Detroit Mercy Reimbursement System</h3>
            <section class="mb-5">
                <article>
                    <h3 class="thanks-for-signing-up-msg">Thank you for signing up!</h3>
                    <h4 class="email-confirmation-text">
                        A 6-character code has being sent to
                        {{ userSignupData ? userSignupData.workEmail.trim() : '' }}@udmercy.edu. You should
                        receive an email in 1-2 minutes. Please check your spam/junk folder
                        if it does not arrive.

                        Note: The 6-character code is case-sensitive and will expire in 10 minutes
                    </h4>
                    <div class="verify-code-section">
                        <form @submit.prevent="verifySixCharacterCode">
                            <h4 class="font-medium">Enter 6-character code here:</h4>
                            <input type="text" v-model="userCode" class="code-input-field" placeholder="XXXXXX"
                                required>
                            <br>
                            <button class="mt-5 verify-button" type="submit">Enter</button>
                        </form>
                        <h3 class="text-sm font-normal mt-6 underline cursor-pointer" @click="resendCode">Resend Code
                        </h3>
                    </div>
                </article>
            </section>
        </section>
    </main>
</template>

<script lang="ts" setup>
import axios from "axios";
import { onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { UserData } from "../types/types";
import { useUserInfoStore } from "../store/index"
import { TYPE, useToast } from "vue-toastification";
const userDataStore = useUserInfoStore();
const toast = useToast()
const router = useRouter()
let userCode = ref<string>("")
let userSignupData = ref<UserData>()
let tries = ref<number>(0)

async function verifySixCharacterCode() {
    if (userCode.value.length !== 6) {
        toast("Please enter 6 characters", {
            type: TYPE.ERROR
        })
        return
    }

    try {
        if (userSignupData.value === undefined || userSignupData.value === null) {
            return
        }

        await axios.post(`${import.meta.env.VITE_API_URL}/api/verify-code`,
            {
                userCode: userCode.value,
                workEmail: userSignupData.value.workEmail,
                employmentNumber: userSignupData.value.employmentNumber
            })


        userDataStore.updateUserData(userSignupData)
        router.push(`/complete-verification`)
    } catch (err: any) {
        toast(err?.response?.data?.message || "There was an error verifying your code. Please try again", {
            type: TYPE.ERROR
        })
    }
}

onMounted(() => {
    userSignupData.value = userDataStore.userData as UserData

    if (userSignupData.value === undefined || userSignupData.value === null || Object.keys(userSignupData.value).length === 0) {
        toast("There was an error fetching your information. Please restart the signup process", {
            type: TYPE.ERROR
        })
        router.push("/signup")
    }
})

async function resendCode() {
    try {
        if (tries.value >= 3) {
            toast("You have exceeded the limit of code resends. Please restart the signup process", {
                type: TYPE.WARNING
            })
            return
        }

        toast("Resending code...", {
            type: TYPE.INFO
        })

        if (userSignupData.value?.workEmail && userSignupData.value.employmentNumber) {
            await axios
                .post(
                    `${import.meta.env.VITE_API_URL}/api/send-confirmation-email`,
                    {
                        workEmail: userSignupData.value.workEmail,
                        employmentNumber: userSignupData.value.employmentNumber
                    }
                )

            tries.value++
            toast("Code was re-sent successfully", {
                type: TYPE.SUCCESS
            })
        } else {
            throw new Error("No user data found")
            return
        }
    } catch (err: any) {
        toast(err?.response?.data?.message || "An unexpected error has occured. Please try again later", {
            type: TYPE.ERROR
        })
    }
}
</script>


<style scoped>
@import url("../assets/styles/signup-page.css");

.input-field,
.work-email-section {
    height: 70px;
}

.code-input-field {
    padding-left: 20px;
    /* width: 210px; */
    box-sizing: border-box;
    height: 50px;
    font-size: 13px;
    padding-right: 20px;
    background: #ffffff;
    border: 1px solid #f7f7f7;
    margin-bottom: 15px;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.17);
    border-radius: 5px;
}
</style>
