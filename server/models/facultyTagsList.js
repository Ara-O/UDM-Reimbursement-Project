import mongoose from "mongoose";

const FacultyTagsListSchema = new mongoose.Schema(
    {
        tag: String
    },
    {
        timestamps: true,
    }
);

const FacultyTagsList = mongoose.model(
    "FacultyTagsList",
    FacultyTagsListSchema,
    "faculty_tags_list"
);

export default FacultyTagsList;
