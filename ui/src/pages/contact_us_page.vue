<template>
  <section class="contact-us-page">
    <section class="left-section">
      <div class="udmercy-logo-wrapper">
        <img
          src="../assets/detroit-mercy-logo.png"
          alt="Detroit mercy logo"
          class="udmercy-logo"
          @click="$router.push('/dashboard')"
        />
      </div>
    </section>
    <section class="right-section">
      <h3 class="contact-title">Contact Us</h3>
      <span class="mt-3">
        <form @submit.prevent="sendEmail">
          <div class="messageSection">
            <span>
              <label style="font-size: 16px">Message</label><br />
              <textarea
                v-model="message"
                class="messageTB mt-5 pt-3 leading-7"
                name="message"
                placeholder="Enter any of the following: &#10;- Feature Suggestions &#10;- Bug Reports &#10;- Compliments"
              ></textarea>
            </span>
          </div>
          <button
            type="button"
            @click="$router.push('/dashboard')"
            class="mt-6 mb-2 bg-udmercy-blue text-white border-none w-auto px-5 h-11 rounded-full cursor-pointer text-xs"
          >
            Return to Dashboard
          </button>
          <button
            type="submit"
            class="mt-6 mb-2 ml-4 bg-udmercy-blue text-white border-none w-auto px-5 h-11 rounded-full cursor-pointer text-xs"
          >
            Send Email
          </button>
        </form>
      </span>
    </section>
    <!-- <section class="contact-form">
            <h3 style="font-size:45px; font-family:Monoton;">Contact Me</h3>
            <form ref="form" @submit.prevent="sendEmail">
                <div class="nameEmail">
                    <span>
                        <label style="font-size: 18px">Name</label><br />
                        <input v-model="name" class="nameTB" type="text" name="user_name" placeholder="Enter Full Name">
                    </span>
                    <span>
                        <label style="font-size: 18px">Email</label><br />
                        <input v-model="email" class="emailTB" type="email" name="user_email" placeholder="Enter Email">
                    </span>
                </div>
                <div class="messageSection">
                    <span>
                        <label style="font-size: 18px">Message</label><br />
                        <textarea v-model="message" class="messageTB" name="message"
                            placeholder="Enter Sweet Little Nothings"></textarea>
                    </span>
                </div>
                <input class="sendBT" type="submit" value="Send">
            </form>
        </section> -->
  </section>
</template>

<script lang="ts" setup>
import axios from "axios";
import { ref } from "vue";
import { useToast, TYPE } from "vue-toastification";
import { Form, Field, ErrorMessage } from "vee-validate";

const name = ref<string>("");
const email = ref<string>("");
const message = ref<string>("");
const toast = useToast();
async function sendEmail() {
  //let ourEmail = '"UDM Reimbursement Support Team" <udm-reimbursement-team@em2297.araoladipo.dev>"';
  try {
    console.log("HELLLLO");
    await axios.post(`${import.meta.env.VITE_API_URL}/api/send-contact-email`, {
      message: message.value,
      sender: email.value,
      name: name.value,
    });

    toast("Feedback sent successfully", {
      type: TYPE.SUCCESS,
    });
    message.value = "";
  } catch (err) {
    toast("An unexpected error has occured. Please try again later", {
      type: TYPE.ERROR,
    });
  }
}
</script>

<style scoped>
@import url("../assets/styles/contact-page.css");
</style>
