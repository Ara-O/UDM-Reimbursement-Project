<template>
    <span class="flex items-center gap-6">
        <h2 class="font-semibold">Reimbursement Claim Information</h2>
        <img src="../../assets/edit-icon.png" alt="Edit icon" class="w-7">
    </span>

    <form action="">
        <div class="flex gap-16">
            <span>
                <h4 class="font-normal text-sm">Reason for Travel/Expense</h4>
                <input type="text" name="reason-or-expense-input"
                    class="border-[0.5px] h-10 rounded-md border-gray-200 border-solid shadow-md">
            </span>
            <span>
                <h4 class="font-normal text-sm">Destination-City, State, Country</h4>
                <input type="text" name="destination-city-state-input"
                    class="border-[0.5px] h-10 rounded-md border-gray-200 border-solid shadow-md">
            </span>
        </div>
    </form>
</template>