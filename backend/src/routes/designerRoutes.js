import { Router } from 'express';
import {
  getDesigners,
  getDesignerById,
  createDesigner,
  updateDesigner,
  deleteDesigner,
} from '../controllers/designerController.js';
import { protect, requireRole } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', protect, getDesigners);
router.get('/:id', protect, getDesignerById);

router.post('/', protect, requireRole('admin'), createDesigner);
router.put('/:id', protect, requireRole('admin'), updateDesigner);
router.delete('/:id', protect, requireRole('admin'), deleteDesigner);

export default router;
