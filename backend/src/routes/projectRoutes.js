import { Router } from 'express';
import {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  submitBid,
  withdrawBid,
  awardProject,
  submitDelivery,
  approveDelivery,
  requestRevision,
  addComment,
} from '../controllers/projectController.js';
import { protect, requireRole } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', protect, getProjects);
router.get('/:id', protect, getProjectById);

router.post('/', protect, requireRole('admin'), createProject);
router.put('/:id', protect, requireRole('admin'), updateProject);
router.delete('/:id', protect, requireRole('admin'), deleteProject);

router.post('/:id/bids', protect, requireRole('designer'), submitBid);
router.delete('/:id/bids', protect, requireRole('designer'), withdrawBid);

router.post('/:id/award', protect, requireRole('admin'), awardProject);
router.post('/:id/deliveries', protect, requireRole('designer'), submitDelivery);
router.post('/:id/approve', protect, requireRole('admin'), approveDelivery);
router.post('/:id/revisions', protect, requireRole('admin'), requestRevision);
router.post('/:id/comments', protect, addComment);

export default router;
