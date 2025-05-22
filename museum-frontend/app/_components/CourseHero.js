import React from 'react'

export default function CourseHero({ bannerImage, category, title }) {
  return (
    <section 
      className="course-hero" 
      style={{ 
        backgroundImage: `url(${bannerImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="container">
        <div className="hero-content" data-aos="fade-up">
          <span className="hero-badge">{category}</span>
          <h1 className="course-title">{title}</h1>
        </div>
      </div>
    </section>
  )
} 