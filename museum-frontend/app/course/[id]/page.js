'use client'

import { useEffect, useState, useCallback, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import axios from 'axios'
// import Image from 'next/image'
import { useToast } from '@/app/_components/ToastManager'
import Head from 'next/head'
import '@/app/_styles/globals.scss'
import '@/app/_styles/courseDetail.scss'
import CourseInfo from '@/app/_components/CourseInfo'
import CourseContent from '@/app/_components/CourseContent'
import EnrollmentSection from '@/app/_components/EnrollmentSection'
import RelatedCourses from '@/app/_components/RelatedCourses'

// API functions
const fetchCourse = async (id) => {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/api/courses/${id}`
  )
  return response.data
}

const fetchArtist = async (artistId) => {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/api/artists/${artistId}`
  )
  return response.data
}

const fetchArtistExperiences = async (artistId) => {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/api/artists/${artistId}/experiences`
  )
  return response.data
}

const fetchRelatedCourses = async (courseId, categoryId) => {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/api/courses/related?courseId=${courseId}&category=${categoryId}`
  )
  return response.data
}

export default function CourseDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id
  const [state, setState] = useState({
    course: null,
    artist: null,
    artistExperiences: [],
    relatedCourses: [],
    loading: true,
    error: null,
  })
  const toast = useToast()

  // Fetch course and related data
  const fetchCourseData = useCallback(async () => {
    if (!id) return

    try {
      setState((prev) => ({ ...prev, loading: true, error: null }))
      const courseData = await fetchCourse(id)
      const artistData = await fetchArtist(courseData.artist_id)
      const experiencesData = await fetchArtistExperiences(courseData.artist_id)

      // 嘗試獲取相關課程
      let relatedCoursesData = []
      try {
        relatedCoursesData = await fetchRelatedCourses(
          id,
          courseData.categories[0]?.id
        )
      } catch (err) {
        console.error('Failed to fetch related courses:', err)
        // 相關課程加載失敗不影響主要功能
      }

      setState((prev) => ({
        ...prev,
        course: courseData,
        artist: artistData,
        artistExperiences: experiencesData,
        relatedCourses: relatedCoursesData,
        loading: false,
      }))
    } catch (err) {
      console.error('Failed to fetch data:', err)
      setState((prev) => ({
        ...prev,
        loading: false,
        error: '無法載入課程資訊',
      }))
      // 使用正確的 toast 方法
      if (toast && typeof toast.showToast === 'function') {
        toast.showToast('error', '無法載入課程資訊')
      }
    }
  }, [id, toast])

  useEffect(() => {
    fetchCourseData()
  }, [fetchCourseData])

  // Event handlers
  const handleFavorite = useCallback((courseId) => {
    console.log(`收藏課程 ${courseId}`)
    // TODO: Implement favorite logic
  }, [])

  const handleEnroll = useCallback(() => {
    if (!state.course) return
    console.log('報名課程:', state.course.id)
    // TODO: Implement enrollment logic
  }, [state.course])

  // Computed data
  const courseData = useMemo(() => {
    if (!state.course) return null

    return {
      ...state.course,
      price: state.course.price || '2,800',
      duration: `${state.course.duration_value || 12}${state.course.duration_unit === 'week' ? '週' : '天'}課程`,
      weeklyHours: `${state.course.hours_per_session || 2}小時`,
      maxStudents: state.course.max_students || '20',
      sessionsPerWeek: state.course.sessions_per_week || 2,
      materialsIncluded: state.course.materials_included
        ? '含材料與工具'
        : '不含材料',
      artist: state.artist,
      artistExperiences: state.artistExperiences,
    }
  }, [state.course, state.artist, state.artistExperiences])

  // Loading & error states
  if (state.loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">載入中...</span>
        </div>
        <p className="mt-3">載入中...</p>
      </div>
    )
  }

  if (state.error) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-danger" role="alert">
          {state.error}
        </div>
        <button className="btn btn-primary mt-3" onClick={fetchCourseData}>
          重試
        </button>
      </div>
    )
  }

  if (!courseData) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-warning" role="alert">
          找不到課程
        </div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>{courseData.title} | 國立故瓷博物館</title>
        <meta name="description" content={courseData.description || ''} />
      </Head>

      {console.log('images:', courseData.images)}
      {/* Gallery Section */}
      <section className="course-gallery container py-4">
        <div className="row g-3">
          {Array.isArray(courseData.images) &&
            courseData.images.slice(0, 3).map((img, idx) => (
              <div className="col-md-4" key={img.image_path}>
                <div className="gallery-img-wrapper">
                  <img
                    src={img.image_path}
                    alt={`課程圖片${idx + 1}`}
                    className="img-fluid rounded"
                    style={{
                      objectFit: 'cover',
                      width: '100%',
                      height: '260px',
                    }}
                  />
                </div>
              </div>
            ))}
        </div>
      </section>

      <div className="container px-3 px-md-4">
        <CourseInfo
          category={courseData.category || '陶藝課程'}
          title={courseData.title}
          rating={courseData.rating}
          reviewCount={courseData.reviewCount}
          studentCount={courseData.studentCount}
          duration={courseData.duration}
          weeklyHours={courseData.weeklyHours}
          maxStudents={courseData.maxStudents}
          onFavorite={handleFavorite}
          courseId={courseData.id}
        />

        <div className="row mt-5">
          <div className="col-lg-8">
            <CourseContent
              course={courseData}
              artist={courseData.artist}
              artistExperiences={courseData.artistExperiences}
            />
          </div>
          <div className="col-lg-4">
            <EnrollmentSection course={courseData} onEnroll={handleEnroll} />
          </div>
        </div>
      </div>

      {/* 推薦課程板塊 */}
      <RelatedCourses courses={state.relatedCourses} />
    </>
  )
}

// 自定義組件實現
// function CourseDetail3D({ roomId }) {
//   return (
//     <section className="spline-container">
//       <iframe
//         src={`https://my.spline.design/untitled-${roomId || 'FPswV6rOeZZPKCr2BxFt1apj'}/`}
//         frameBorder='0'
//         width='100%'
//         height='100%'
//       ></iframe>
//     </section>
//   )
// }

function ArtistCard({ artist }) {
  if (!artist) return null
  return (
    <section className="content-section" data-aos="fade-up">
      <h2 className="section-title">師資介紹</h2>
      <div className="instructor-card">
        <img
          src={artist.avatar || '/course-img/artist-img/Hawk+Hive.jpg'}
          alt={artist.name}
          className="instructor-avatar"
        />
        <div className="instructor-info">
          <h3>{artist.name || 'Tip Toland'}</h3>
          <p className="text-muted">{artist.title || '駐村藝術家'}</p>
          <p>
            {artist.bio ||
              '從事陶藝創作超過30年，專精於傳統陶藝技法的傳承與創新。作品多次在國際展覽中展出，並獲得多項重要獎項。'}
          </p>
          <ul className="experience-list">
            {Array.isArray(artist.experiences) &&
            artist.experiences.length > 0 ? (
              artist.experiences.map((exp, index) => <li key={index}>{exp}</li>)
            ) : (
              <li>尚無經歷資料</li>
            )}
          </ul>
        </div>
      </div>
    </section>
  )
}

function AddToCartButton({ courseId }) {
  const handleAddToCart = () => {
    // 加入購物車的邏輯
    console.log(`添加課程 ${courseId} 到購物車`)
    // 可以使用API請求或狀態管理
  }

  return (
    <button className="btn btn-enroll mb-3" onClick={handleAddToCart}>
      <i className="bi bi-cart-plus"></i> 立即報名
    </button>
  )
}
