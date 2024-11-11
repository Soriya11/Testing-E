<template>
  <div class="p-4">
    <div class="flex justify-center md:justify-end mb-5">
      <input
        v-model="searchTerm"
        type="text"
        placeholder="Search items"
        class="p-2 border border-gray-100 rounded-lg mb-5 w-full md:w-80 lg:w-96"
      />
    </div>
    <div
      v-for="(group, categoryId) in groupedItems"
      :key="categoryId"
      class="mb-8"
    >
      <h2 class="text-xl bg-white rounded-2xl font-semibold mt-8 mb-4 p-2">
        {{ group.categoryName }}
      </h2>
      <div
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5"
        v-auto-animate
      >
        <div
          v-for="item in group.items"
          :key="item._id"
          class="relative bg-white border border-slate-100 rounded-3xl p-4 sm:p-8 cursor-pointer transition hover:-translate-y-2 hover:shadow-xl"
          @click="openDialog(item)"
        >
          <img
            v-if="item.imageUrl"
            :src="item.imageUrl"
            alt="Item Image"
            class="w-full h-32 sm:h-48 md:h-64 object-cover rounded-lg"
          />
          <div class="flex justify-between mt-2 sm:mt-5">
            <b class="text-sm sm:text-base">
              {{ group.categoryName }}:
              <b class="text-[#ff0000]">{{ item.price }}$</b>
            </b>
          </div>
          <hr class="my-2" />
          <p class="mt-2 text-base sm:text-lg text-slate-500">
            {{ item.name }}
          </p>
        </div>
      </div>
    </div>

    <el-dialog
      v-model="dialogVisible"
      :title="selectedItem?.name"
      width="400px"
      class="rounded-lg"
      align-center
    >
      <div v-if="selectedItem">
        <img
          v-if="selectedItem.imageUrl"
          :src="selectedItem.imageUrl"
          alt="Selected Item Image"
          class="w-full h-64 object-cover rounded-lg mb-4"
        />
        <p class="mb-4">
          <b>Price:</b> <b class="text-[#ff0000]">{{ selectedItem.price }}$</b>
        </p>
        <p><b>Description:</b> {{ selectedItem.description }}</p>
      </div>
      <template #footer>
        <div class="flex justify-end w-full">
          <button
            @click="dialogVisible = false"
            class="el-button el-button--primary"
          >
            Close
          </button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>
import { ref, onMounted, computed } from "vue";
import { ElDialog } from "element-plus";
import { Meteor } from "meteor/meteor";

const items = ref([]);
const searchTerm = ref("");
const selectedItem = ref(null);
const dialogVisible = ref(false);

const fetchItems = () => {
  Meteor.call("fetchItemsWithCategories", (err, result) => {
    if (!err) items.value = result;
  });
};

const openDialog = (item) => {
  selectedItem.value = item;
  dialogVisible.value = true;
};

const groupedItems = computed(() => {
  const grouped = {};

  items.value.forEach((item) => {
    if (
      item.status === "Active" &&
      item.name.toLowerCase().includes(searchTerm.value.toLowerCase())
    ) {
      if (!grouped[item.categoryId]) {
        grouped[item.categoryId] = {
          categoryName: item.categoryName,
          items: [],
        };
      }
      grouped[item.categoryId].items.push(item);
    }
  });

  return grouped;
});

onMounted(() => {
  fetchItems();
});
</script>


