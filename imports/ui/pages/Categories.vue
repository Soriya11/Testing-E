<template>
  <div>
    <el-button plain @click="openNewItemDialog">New Item</el-button>

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
          <el-input v-model="form.name" placeholder="Enter name"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            :loading="loadingForm"
            @click="onSubmit"
          >
            {{ form._id ? 'Update' : 'Add' }}
          </el-button>
          <el-button v-if="form._id" type="danger" @click="remove">
            Remove
          </el-button>
          <el-button @click="resetForm">Reset</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-table :data="dataTable" border stripe v-loading="loading">
      <el-table-column type="index" label="No" width="50" />
      <el-table-column prop="name" label="Name">
        <template #default="scope">
           <el-tooltip content="Update" placement="top">
      <span
        class="cursor-pointer text-[#409EFF]"
        @click="edit(scope.row)"
      >
        {{ scope.row.name }}
      </span>
    </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { ElNotification } from "element-plus";

type FormType = {
  _id?: string;
  name: string;
};

const centerDialogVisible = ref(false);
const loading = ref(false);
const loadingForm = ref(false);
const refForm = ref();
const form = ref<FormType>({ name: "" });
const dataTable = ref<FormType[]>([]);

const rules = {
  name: [{ required: true, message: "Name is required", trigger: "blur" }],
};

const notify = (message: string, type: "success" | "error") => {
  ElNotification({
    message,
    type,
    duration: 2000,
  });
};

const openNewItemDialog = () => {
  resetForm();
  centerDialogVisible.value = true;
};

const edit = (row: FormType) => {
  form.value = { ...row };
  centerDialogVisible.value = true;
};

const onSubmit = () => {
  loadingForm.value = true;
  refForm.value.validate((valid: boolean) => {
    if (!valid) {
      loadingForm.value = false;
      notify("Validation failed", "error");
      return;
    }

    const methodName = form.value._id ? "updateCategory" : "insertCategory";
    Meteor.call(methodName, { ...form.value }, (err: Error) => {
      loadingForm.value = false;
      if (err) {
        notify("Operation failed", "error");
      } else {
        notify(form.value._id ? "Updated successfully" : "Added successfully", "success");
        resetForm();
        getData();
        centerDialogVisible.value = false;
      }
    });
  });
};

const remove = () => {
  loadingForm.value = true;
  Meteor.call("removeCategoryById", { _id: form.value._id }, (err: Error) => {
    loadingForm.value = false;
    if (err) {
      notify("Remove failed", "error");
    } else {
      notify("Removed successfully", "success");
      resetForm();
      getData();
      centerDialogVisible.value = false;
    }
  });
};

const resetForm = () => {
  refForm.value?.resetFields();
  form.value = { name: "" };
  delete form.value._id;
};

const getData = () => {
  loading.value = true;
  Meteor.call("fetchCategories", (err: Error, res: FormType[]) => {
    loading.value = false;
    if (err) {
      notify("Failed to fetch data", "error");
    } else {
      dataTable.value = res;
    }
  });
};

onMounted(() => {
  getData();
});
</script>

