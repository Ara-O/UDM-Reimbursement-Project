<template>
    <div class="p-6">
      <!-- Header -->
      <header class="mb-8">
        <h1 class="text-2xl font-bold">Admin Dashboard</h1>
      </header>
  
      <!-- Pending Requests Section -->
      <section>
        <h2 class="text-xl font-semibold mb-4">Pending Requests</h2>
  
        <!-- Search and Filters -->
        <div class="flex items-center gap-4 mb-6">
          <input
            type="text"
            placeholder="Search through pending requests"
            class="p-2 border rounded-md flex-1"
          />
          <select class="p-2 border rounded-md">
            <option value="" disabled selected>Search Criteria</option>
            <option value="date">Date</option>
            <option value="name">Name</option>
          </select>
          <select class="p-2 border rounded-md">
            <option value="" disabled selected>Sort By</option>
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
  
        <!-- Cards Section -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <!-- Single Card -->
          <div
            v-for="(request, index) in pendingRequests"
            :key="index"
            class="bg-blue-900 text-white rounded-lg shadow-lg p-4"
          >
            <h3 class="text-lg font-semibold mb-2">{{ request.title }}</h3>
            <p class="mb-2">Sent by: {{ request.sentBy }}</p>
            <p class="mb-4">Date: {{ request.date }}</p>
  
            <div class="flex gap-2">
              <button
                class="bg-gray-100 text-blue-900 px-4 py-1 rounded hover:bg-gray-200"
              >
                View PDF
              </button>
              <button
                class="bg-gray-100 text-blue-900 px-4 py-1 rounded hover:bg-gray-200"
              >
                Edit
              </button>
              <button
                class="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
              >
                Approve
              </button>
              <button
                class="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
              >
                Deny
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        pendingRequests: [
          {
            title: "University Conference",
            sentBy: "Ethan Scheys",
            date: "12/12/2024",
          },
          {
            title: "University Conference",
            sentBy: "Ethan Scheys",
            date: "12/12/2024",
          },
          {
            title: "University Conference",
            sentBy: "Ethan Scheys",
            date: "12/12/2024",
          },
        ],
      };
    },
  };
  </script>
  
  <style scoped>
  /* Tailwind CSS styles are applied directly via classes. */
  </style>
  