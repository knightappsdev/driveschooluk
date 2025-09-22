import { Router } from 'express';
import { 
  upload, 
  uploadLearningMaterial, 
  getLearningMaterials,
  getMaterialsByCourse,
  downloadFile,
  deleteLearningMaterial
} from '../controllers/uploadController';

const router = Router();

// Upload learning material
router.post('/learning-materials', upload.single('file'), uploadLearningMaterial);

// Get all learning materials
router.get('/learning-materials', getLearningMaterials);

// Get materials by course
router.get('/learning-materials/course/:courseId', getMaterialsByCourse);

// Download file
router.get('/learning-materials/:id/download', downloadFile);

// Delete learning material
router.delete('/learning-materials/:id', deleteLearningMaterial);

export default router;