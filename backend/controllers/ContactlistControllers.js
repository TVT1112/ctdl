import contactlistModel from "../models/Contactlist.js";

const upload = async (req, res) => {
  try {
    await contactlistModel.insertMany(req.body);
    res.json({success:true,message:"đã thêm note"})
  } catch (error) {
    console.error("Upload error:", error);
    res.json({success:false,message:"Lỗi"})
  }
};

const contactlist = async (req,res)=>{
  try {
    const list= await contactlistModel.find()
    res.json({success:true,data:list})
  } catch (error) {
    console.log(err)
    res.json({success:false,message:"lỗi"})
  }
}

const addcontact= async (req,res)=>{
  try {
    const newContact = new contactlistModel(req.body);
    await newContact.save();
    res.json({ success: true, message: "Thêm liên hệ thành công" });
  } catch (error) {
    res.json({ success: false, message: "Lỗi khi thêm liên hệ", error });
  }
}

const updatecontact = async (req,res)=>{
  try {
    await contactlistModel.findByIdAndUpdate(req.params.id, req.body);
    res.json({ success: true, message: "Cập nhật thành công" });
  } catch (error) {
    res.json({ success: false, message: "Lỗi khi cập nhật", error });
  }
}

const deletecontact = async (req, res) => {
  try {
    const deleted = await contactlistModel.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Không tìm thấy liên hệ để xóa" });
    }
    res.json({ success: true, message: "Xóa thành công" });
  } catch (error) {
    console.error("Lỗi xóa:", error);
    res.status(500).json({ success: false, message: "Lỗi khi xóa", error });
  }
};

export {upload,contactlist,addcontact,updatecontact,deletecontact};
