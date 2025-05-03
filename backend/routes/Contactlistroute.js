import express from 'express'
import { addcontact, contactlist, deletecontact, updatecontact, upload } from '../controllers/ContactlistControllers.js'
const contactRouter = express.Router()

contactRouter.post("/upload",upload)
contactRouter.get("/contactlist",contactlist)
contactRouter.post("/add",addcontact)
contactRouter.put("/update/:id",updatecontact)
contactRouter.delete("/delete/:id",deletecontact)
export default contactRouter