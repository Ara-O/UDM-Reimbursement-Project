import mongoose, { Schema } from "mongoose"

const authSchema = new Schema({
    employmentNumber: String,
    workEmail: String,
    authString: String,
}, { timestamps: true })

authSchema.index({ createdAt: 1 }, { expireAfterSeconds: 300 });

const Auth = mongoose.model('auth', authSchema, 'auth')

export { Auth }