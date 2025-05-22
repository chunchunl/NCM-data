import React from 'react'
import { memo } from 'react'
import Image from 'next/image'

const CourseContent = memo(function CourseContent({ course, artist, artistExperiences }) {
  return (
    <>
      {/* Course Introduction */}
      <section className="content-section mt-0" data-aos="fade-up">
        <h2 className="section-title">課程介紹</h2>
        <p className="lead mb-4">{course.description}</p>
        <ul className="feature-list">
          {course.features?.map((feature, index) => (
            <li key={index} data-aos="fade-up" data-aos-delay={index * 100}>
              <i className="bi bi-check-circle-fill"></i>
              <div>
                <h5>{feature.title}</h5>
                <p className="mb-0">{feature.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Course Video */}
      {console.log('video_url:', course.video_url)}
      {course.video_url && (
        <section className="content-section" data-aos="fade-up">
          <h2 className="section-title">創作影片</h2>
          <div className="ratio ratio-16x9">
            <iframe
              src={course.video_url}
              title="Course video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </section>
      )}

      {/* Artist Information */}
      {artist && (
        <section className="content-section" data-aos="fade-up">
          <h2 className="section-title">師資介紹</h2>
          <div className="instructor-card">
            <img 
              src={artist.avatar || "/course-img/artist-img/default-avatar.jpg"} 
              alt={artist.name}
              className="instructor-avatar"
            />
            <div className="instructor-info">
              <h3>{artist.name}</h3>
              <p className="text-muted">{artist.type}</p>
              <p>{artist.bio}</p>
              {artistExperiences && artistExperiences.length > 0 && (
                <ul className="experience-list">
                  {artistExperiences.map((exp, index) => (
                    <li key={index}>{exp}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Venue Information */}
      {course.venue_name && (
        <section className="content-section" data-aos="fade-up">
          <h2 className="section-title">教室環境</h2>
          <div className="row g-4">
            <div className="col-md-8">
              <img 
                src={course.venue_main_image || "/course-img/classroom/B101_2.jpg"} 
                alt="教室全景" 
                className="img-fluid rounded"
              />
            </div>
            <div className="col-md-4">
              <div className="row g-4">
                <div className="col-12">
                  <img 
                    src={course.venue_image_1 || "/course-img/classroom/B101.jpg"} 
                    alt="工作區" 
                    className="img-fluid rounded"
                  />
                </div>
                <div className="col-12">
                  <img 
                    src={course.venue_image_2 || "/course-img/classroom/B101.jpg"} 
                    alt="窯場" 
                    className="img-fluid rounded"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  )
})

export default CourseContent 