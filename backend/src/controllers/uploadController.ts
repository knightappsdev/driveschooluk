import { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Simple multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter for allowed file types
const fileFilter = (_req: any, file: any, cb: any) => {
  const allowedTypes = ['.pdf', '.doc', '.docx', '.mp4', '.mp3', '.jpg', '.jpeg', '.png'];
  const fileExtension = path.extname(file.originalname).toLowerCase();
  
  if (allowedTypes.includes(fileExtension)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, DOC, DOCX, MP4, MP3, JPG, JPEG, PNG files are allowed.'), false);
  }
};

export const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  }
});

// Upload learning material
export const uploadLearningMaterial = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }

    const { title, description, courseId, category } = req.body;

    // Get a valid admin user for uploadedBy field
    const adminUser = await prisma.user.findFirst({
      where: { role: 'SUPER_ADMIN' }
    });

    if (!adminUser) {
      res.status(500).json({ error: 'No admin user found' });
      return;
    }

    // Save file info to database
    const learningMaterial = await prisma.learningMaterial.create({
      data: {
        title,
        description,
        fileUrl: req.file.path,
        type: category || 'general',
        fileSize: req.file.size,
        courseId: courseId || null,
        uploadedBy: adminUser.id,
        content: `Original filename: ${req.file.originalname}`
      }
    });

    res.status(201).json({
      message: 'File uploaded successfully',
      material: {
        ...learningMaterial,
        fileName: req.file.originalname,
        mimeType: req.file.mimetype
      }
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload file' });
  }
};

// Get all learning materials
export const getLearningMaterials = async (_req: Request, res: Response): Promise<void> => {
  try {
    const materials = await prisma.learningMaterial.findMany({
      include: {
        course: {
          select: {
            title: true
          }
        }
      }
    });

    // Transform the data to match frontend expectations
    const transformedMaterials = materials.map(material => ({
      ...material,
      fileName: material.content?.split('Original filename: ')[1] || 'Unknown',
      category: material.type,
      mimeType: 'application/octet-stream' // Default mime type
    }));

    res.json(transformedMaterials);
  } catch (error) {
    console.error('Error fetching materials:', error);
    res.status(500).json({ error: 'Failed to fetch materials' });
  }
};

// Get learning materials by course
export const getMaterialsByCourse = async (req: Request, res: Response): Promise<void> => {
  try {
    const { courseId } = req.params;
    
    if (!courseId) {
      res.status(400).json({ error: 'Course ID is required' });
      return;
    }
    
    const materials = await prisma.learningMaterial.findMany({
      where: {
        courseId: courseId
      }
    });

    res.json(materials);
  } catch (error) {
    console.error('Error fetching course materials:', error);
    res.status(500).json({ error: 'Failed to fetch course materials' });
  }
};

// Download file
export const downloadFile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    if (!id) {
      res.status(400).json({ error: 'Material ID is required' });
      return;
    }
    
    const material = await prisma.learningMaterial.findUnique({
      where: { id }
    });

    if (!material) {
      res.status(404).json({ error: 'File not found' });
      return;
    }

    const filePath = material.fileUrl;
    
    if (!filePath || !fs.existsSync(filePath)) {
      res.status(404).json({ error: 'Physical file not found' });
      return;
    }

    const fileName = material.content?.split('Original filename: ')[1] || 'download';
    res.download(filePath, fileName);

  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ error: 'Failed to download file' });
  }
};

// Delete learning material
export const deleteLearningMaterial = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    if (!id) {
      res.status(400).json({ error: 'Material ID is required' });
      return;
    }
    
    const material = await prisma.learningMaterial.findUnique({
      where: { id }
    });

    if (!material) {
      res.status(404).json({ error: 'Material not found' });
      return;
    }

    // Delete physical file
    if (material.fileUrl && fs.existsSync(material.fileUrl)) {
      fs.unlinkSync(material.fileUrl);
    }

    // Delete from database
    await prisma.learningMaterial.delete({
      where: { id }
    });

    res.json({ message: 'Material deleted successfully' });

  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: 'Failed to delete material' });
  }
};