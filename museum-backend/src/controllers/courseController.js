import { fetchCourseById, fetchRelatedCourses } from '../services/courseService.js';

export async function getCourseById(req, res) {
  try {
    const course = await fetchCourseById(req.params.id);
    if (!course) return res.status(404).json({ error: 'Course not found' });
    res.json(course);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getRelatedCourses(req, res) {
  try {
    const { courseId, category } = req.query;
    const courses = await fetchRelatedCourses(courseId, category);
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}