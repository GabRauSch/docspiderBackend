import { Router } from "express";
import { DocumentsController } from "../controllers/DocumentsController";
import { upload } from "../config/multer";

const router = Router();

router.get('/all', DocumentsController.listAll);
router.get('/:id', DocumentsController.byId)
router.post('/file', upload.single('document'), DocumentsController.createWithFile);
router.put('/', DocumentsController.update);
router.delete('/:id', DocumentsController.delete);

export default router;