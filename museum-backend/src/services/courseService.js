import pool from '../config/database.js';

export async function fetchCourseById(id) {
  // 查詢課程主資料
  const [courses] = await pool.query('SELECT * FROM courses WHERE id = ?', [id]);
  if (!courses.length) return null;
  const course = courses[0];

  // 查詢課程圖片
  const [images] = await pool.query('SELECT * FROM course_images WHERE course_id = ?', [id]);
  course.images = images;

  // 查詢課程分類
  const [categories] = await pool.query(
    `SELECT cc.* FROM course_category_map ccm
     JOIN course_categories cc ON ccm.category_id = cc.id
     WHERE ccm.course_id = ?`, [id]);
  course.categories = categories;
  course.category = categories[0]?.name || '';

  // 查詢藝術家
  const [artistRows] = await pool.query('SELECT * FROM artists WHERE id = ?', [course.artist_id]);
  course.artist = artistRows[0] || null;

  return course;
}

export async function fetchRelatedCourses(courseId, categoryId) {
  // 查詢同分類的其他課程
  const [rows] = await pool.query(
    `SELECT c.* FROM courses c
     JOIN course_category_map ccm ON c.id = ccm.course_id
     WHERE ccm.category_id = ? AND c.id != ? LIMIT 3`,
    [categoryId, courseId]
  );
  return rows;
}