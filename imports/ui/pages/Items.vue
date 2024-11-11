<template>
  <div>
    <el-button type="primary" @click="openNewItemDialog"
      >Add New Item</el-button
    >
    <el-dialog
      v-model="centerDialogVisible"
      :title="form._id ? 'Edit Item' : 'Add Item'"
      width="500"
      align-center
    >
      <el-form
        :model="form"
        ref="refForm"
        :rules="rules"
        label-width="80px"
        size="default"
        v-loading="loadingForm"
      >
        <el-form-item label="Name" prop="name">
          <el-input v-model="form.name" placeholder="Enter name" />
        </el-form-item>

        <el-form-item label="Price" prop="price">
          <el-input
            v-model.number="form.price"
            type="number"
            placeholder="Enter price"
          >
            <template #prepend>$</template>
          </el-input>
        </el-form-item>

        <el-form-item label="Cost" prop="cost">
          <el-input
            v-model.number="form.cost"
            type="number"
            placeholder="Enter cost"
          >
            <template #prepend>$</template>
          </el-input>
        </el-form-item>

        <el-form-item label="Description" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            placeholder="Enter description"
            rows="4"
          />
        </el-form-item>

        <el-form-item label="Status" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio label="Active">Active</el-radio>
            <el-radio label="Inactive">Inactive</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="Category" prop="categoryId">
          <el-select v-model="form.categoryId" placeholder="Select Category">
            <el-option
              v-for="category in categories"
              :key="category.value"
              :label="category.label"
              :value="category.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="Upload">
          <input type="file" ref="fileInput" @change="handleChange" />
          <button
            type="button"
            class="bg-blue-500 text-white font-bold py-2 px-4 rounded mt-2"
            @click="handleUpload"
            v-if="file"
          >
            Upload
          </button>

          <div v-if="form.imageUrl" class="mt-4">
            <img
              :src="form.imageUrl"
              alt="Uploaded Image"
              class="w-32 h-32 object-cover rounded"
            />
          </div>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" :loading="loadingForm" @click="onSubmit">
            {{ form._id ? "Update" : "Add" }}
          </el-button>
          <el-button v-if="form._id" type="danger" @click="onRemove">
            Remove
          </el-button>
          <el-button @click="resetForm">Reset</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <div class="flex justify-end space-x-4 mb-2">
      <div class="flex items-center space-x-2">
        <el-form-item class="flex-grow">
          <el-input
            v-model="nameSearch"
            placeholder="Input Name                 🔍"
            clearable
            class="rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
          />
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="selectedCategoryId"
            placeholder="🔎| by Category"
            @change="filterByCategory"
            class="min-w-40"
          >
            <el-option label="Show All" value="" />
            <el-option
              v-for="category in categories"
              :key="category.value"
              :label="category.label"
              :value="category.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-select
            v-model="selectedStatus"
            placeholder="🔎| by Status"
            @change="filterByStatus"
            class="min-w-40"
          >
            <el-option label="All" value="" />
            <el-option label="Active" value="Active" />
            <el-option label="Inactive" value="Inactive" />
          </el-select>
        </el-form-item>
      </div>
    </div>

    <el-table
      :data="filteredData"
      border
      stripe
      v-loading="loading"
      class="mt-4 text-cyan-900"
    >
      <el-table-column type="index" label="No" width="50" />
      <el-table-column prop="name" label="Name">
        <template #default="scope">
          <el-tooltip content="Update Here" placement="top">
            <span
              class="cursor-pointer text-[#409EFF]"
              @click="edit(scope.row)"
            >
              {{ scope.row.name }}
            </span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="Image">
        <template #default="scope">
          <img
            v-if="scope.row.imageUrl"
            :src="scope.row.imageUrl"
            class="w-[150px] h-[100px] object-cover rounded"
          />
        </template>
      </el-table-column>
      <el-table-column prop="price" label="Price">
        <template #default="scope">
          <span>${{ scope.row.price }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="cost" label="Cost">
        <template #default="scope">
          <span>${{ scope.row.cost }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="description" label="Description" />
      <el-table-column prop="status" label="Status">
        <template #default="scope">
          <el-tag
            :type="scope.row.status === 'Active' ? 'success' : 'danger'"
            effect="plain"
          >
            {{ scope.row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="categoryName" label="Category">
        <template #default="scope">
          <span
            :class="
              scope.row.status === 'Active'
                ? 'category-active'
                : 'category-inactive'
            "
          >
            {{ scope.row.categoryName }}
          </span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>


<script setup>
import { Delete } from "@element-plus/icons-vue";
import FilesCollection from "/imports/api/files/files";

const file = ref("");
const fileData = ref([]);
const setFile = ref({
  imageUrl: "",
});

const uploadToServer = () => {
  const uploadInstance = FilesCollection.insert({
    file: file.value,
    chunkSize: "dynamic",
  });

  uploadInstance.on("end", function (err, res) {
    if (err) {
      ElNotification.error({
        title: "Upload Error",
        message: "Error during upload: " + err.message,
      });
    } else {
      const fileId = this.config.fileId;
      form.value.imageUrl = fileId;
      ElNotification.success({
        title: "Upload Successful",
        message: "File has been uploaded successfully!",
        duration: 3000,
      });
      getFileUploads();

      file.value = null;
      if ($refs.fileInput) $refs.fileInput.value = null;
    }
  });
};

const handleChange = (e) => {
  const target = e.target;
  if (target && target.files) {
    file.value = target.files[0];
  }
};

const handleUpload = () => {
  if (!file.value) {
    ElNotification.warning({
      title: "File Required",
      message: "Please select a file to upload.",
    });
    return;
  }
  uploadToServer();
};

const getFileUploads = () => {
  Meteor.call("findImageData", (err, res) => {
    if (err) {
      console.log("Error fetching file data:", err);
    } else {
      fileData.value = res;
      const uploadedFile = fileData.value.find(
        (file) => file._id === form.value.imageUrl
      );
      if (uploadedFile && uploadedFile.url) {
        form.value.imageUrl = uploadedFile.url;
      }
    }
  });
};

const removeFileFromServer = (id) => {
  FilesCollection.remove({ _id: id }, (err) => {
    if (err) {
      console.log("Error removing file from server:", err);
      ElNotification.error({
        title: "Remove Error",
        message: "Error removing file: " + err.message,
      });
    } else {
      console.log("File removed from server");
      getFileUploads();
    }
  });
};

const onRemove = () => {
  if (form.value.imageUrl) {
    const fileToRemove = fileData.value.find(
      (file) => file.url === form.value.imageUrl
    );
    if (fileToRemove && fileToRemove._id) {
      removeFileFromServer(fileToRemove._id);
    }
  }
  remove();
};

onMounted(() => {
  getFileUploads();
});
import { ref, onMounted, computed } from "vue";
import { ElNotification } from "element-plus";
import { Plus } from "@element-plus/icons-vue";

const centerDialogVisible = ref(false);
const dialogImageUrl = ref("");
const dialogVisible = ref(false);
const loadingForm = ref(false);
const loading = ref(false);
const refForm = ref(null);

const form = ref({
  name: "",
  price: null,
  cost: null,
  description: "",
  status: "Active",
  categoryId: null,
  imageUrl: "",
});

const dataTable = ref([]);
const categories = ref([]);
const selectedCategoryId = ref("");

const fetchCategories = () => {
  Meteor.call("itemsOpts", (err, result) => {
    if (err) {
      ElNotification.error({ title: "Error", message: err.message });
    } else {
      categories.value = result;
    }
  });
};

const rules = {
  name: [{ required: true, message: "Name is required", trigger: "blur" }],
  price: [{ required: true, message: "Price is required", trigger: "blur" }],
  cost: [{ required: true, message: "Cost is required", trigger: "blur" }],
  categoryId: [
    { required: true, message: "Category is required", trigger: "blur" },
  ],
  status: [{ required: true, message: "Status is required", trigger: "blur" }],
};

const openNewItemDialog = () => {
  resetForm();
  centerDialogVisible.value = true;
};
const edit = (row) => {
  form.value = { ...row };
  form.value.oldImageUrl = row.imageUrl;
  centerDialogVisible.value = true;
};

const onSubmit = () => {
  if (!refForm.value) return;

  loadingForm.value = true;
  refForm.value.validate((valid) => {
    if (!valid) {
      loadingForm.value = false;
      return;
    }
    const imageChanged = form.value.imageUrl !== form.value.oldImageUrl;

    if (imageChanged && form.value.oldImageUrl) {
      const oldFile = fileData.value.find(
        (file) => file.url === form.value.oldImageUrl
      );
      if (oldFile && oldFile._id) {
        removeFileFromServer(oldFile._id);
      }
    }
    const itemToUpdate = {
      _id: form.value._id,
      name: form.value.name,
      price: form.value.price,
      cost: form.value.cost,
      description: form.value.description,
      status: form.value.status,
      categoryId: form.value.categoryId,
      imageUrl: form.value.imageUrl,
    };

    const methodName = form.value._id ? "updateItems" : "insertItems";
    Meteor.call(methodName, itemToUpdate, (err) => {
      loadingForm.value = false;
      if (err) {
        ElNotification.error({ title: "Error", message: err.message });
      } else {
        ElNotification.success({
          title: "Success",
          message: form.value._id
            ? "Item updated successfully"
            : "Item added successfully",
        });
        centerDialogVisible.value = false;
        resetForm();
        getData();
      }
    });
  });
};

const remove = () => {
  if (!form.value._id) return;

  loadingForm.value = true;
  Meteor.call("removeItemsById", { _id: form.value._id }, (err) => {
    if (err) {
      ElNotification.error({ title: "Remove Error", message: err.message });
    } else {
      ElNotification.success({
        title: "Success",
        message: "Item removed successfully",
      });
      resetForm();
      getData();
      centerDialogVisible.value = false;
    }
    loadingForm.value = false;
  });
};

const resetForm = () => {
  form.value = {
    name: "",
    price: null,
    cost: null,
    description: "",
    status: "Active",
    categoryId: null,
    imageUrl: "",
  };
};

onMounted(() => {
  fetchCategories();
  getData();
});

const getData = () => {
  loading.value = true;
  Meteor.call("fetchItemsWithCategories", (err, result) => {
    if (err) {
      ElNotification.error({ title: "Error", message: err.message });
    } else {
      dataTable.value = result;
    }
    loading.value = false;
  });
};
//search-status-and-categories
const selectedStatus = ref("");
const nameSearch = ref("");

const filteredData = computed(() => {
  return dataTable.value.filter((item) => {
    const categoryMatch = selectedCategoryId.value
      ? item.categoryId === selectedCategoryId.value
      : true;
    const statusMatch = selectedStatus.value
      ? item.status === selectedStatus.value
      : true;
    const nameMatch = nameSearch.value
      ? item.name.toLowerCase().includes(nameSearch.value.toLowerCase())
      : true;
    return categoryMatch && statusMatch && nameMatch;
  });
});

const filterByStatus = () => {};
const searchByName = () => {};
</script>

<style scoped>
.category-active {
  color: rgb(103, 197, 100);
  padding: 4px 8px;
  border-radius: 4px;
  display: inline-block;
  font-size: 14px;
}

.category-inactive {
  font-size: 14px;
  color: #f56c6c;
  padding: 4px 8px;
  border-radius: 4px;
  display: inline-block;
}
</style> 
