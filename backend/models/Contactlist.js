import mongoose  from "mongoose";

const contactlistSchema = new mongoose.Schema({
    name:{
        type:String,require:true
    },
    phone:{
        type:String, require:true
    }
})

const contactlistModel= mongoose.model.food || mongoose.model("contacts",contactlistSchema)

export default contactlistModel;