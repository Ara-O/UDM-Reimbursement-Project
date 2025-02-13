import mongoose from "mongoose";

let DepartmentChairRegistrySchema = mongoose.Schema(
  {
    department_code: String,
    chair_email: String,
  },
  {
    timestamps: true,
  }
);

let DepartmentChairRegistry = mongoose.model(
  "DepartmentChairRegistry",
  DepartmentChairRegistrySchema,
  "department_chair_registry"
);

export default DepartmentChairRegistry;
