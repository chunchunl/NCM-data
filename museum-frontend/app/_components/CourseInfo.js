import React from 'react'

export default function CourseInfo({
  category,
  title,
  studentCount,
  duration,
  weeklyHours,
  maxStudents,
  onFavorite,
  courseId
}) {
  return (
    <div className="course-info-card" data-aos="fade-up">
      <div className="row align-items-center">
        <div className="col-md-6">
          <span className="course-category-badge mb-3">{category}</span>
          <h3 className="display-4 fw-bold mb-3">{title}</h3>
        </div>
        <div className="col-md-6">
          <div className="d-flex align-items-center justify-content-center mb-3 gap-3">
            <div>
              <i className="bi bi-people-fill text-primary"></i>
              <span className="mx-2">已有 {studentCount} 位報名</span>
            </div>
            <div className="text-center ms-3">
              <button 
                className="btn btn-outline" 
                style={{ maxWidth: '200px' }}
                onClick={() => onFavorite(courseId)}
              >
                <i className="bi bi-heart"></i>
                <span>收藏課程</span>
              </button>
            </div>
          </div>
          <div className="info-grid">
            <div className="info-item">
              <i className="bi bi-calendar3"></i>
              <h5 className="pt-3">課程時長</h5>
              <p className="mb-0">{duration}</p>
            </div>
            <div className="info-item">
              <i className="bi bi-clock"></i>
              <h5 className="pt-3">每週課時</h5>
              <p className="mb-0">{weeklyHours}</p>
            </div>
            <div className="info-item">
              <i className="bi bi-person-workspace"></i>
              <h5 className="pt-3">班級人數</h5>
              <p className="mb-0">限{maxStudents}人</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 