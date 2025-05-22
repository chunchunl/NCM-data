import express from 'express';
import { getCourseById, getRelatedCourses } from '../controllers/courseController.js';
const router = express.Router();

router.get('/:id', getCourseById);           // /api/courses/:id
router.get('/related', getRelatedCourses);    // /api/courses/related

export default router;