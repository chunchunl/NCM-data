// 'use client'

// import React, { useState } from 'react'
// import { Button } from 'react-bootstrap'
// import { FaCamera, FaPalette } from 'react-icons/fa'
// import styles from './cover.module.scss'

// export default function LowContent() {
//   const [showColorPicker, setShowColorPicker] = useState(false)
//   const [selectedColor, setSelectedColor] = useState('#f8f1e3')

//   const colors = [
//     '#f8f1e3',
//     '#e3d5ca',
//     '#d5bdaf',
//     '#a3b18a',
//     '#588157',
//     '#3a5a40'
//   ]

//   const handleColorSelect = (color) => {
//     setSelectedColor(color)
//     setShowColorPicker(false)
//   }

//   return (
//     <div className={styles.coverContainer}>
//       <div 
//         className={styles.coverImage}
//         style={{ backgroundColor: selectedColor }}
//       />
      
//       <div className={styles.coverEditBtn}>
//         <div className={styles.editOptions}>
//           <Button variant="light" className={styles.editBtn}>
//             <FaCamera />
//           </Button>
//           <Button 
//             variant="light" 
//             className={styles.editBtn}
//             onClick={() => setShowColorPicker(!showColorPicker)}
//           >
//             <FaPalette />
//           </Button>
//         </div>
//       </div>

//       <div className={`${styles.colorPicker} ${showColorPicker ? styles.show : ''}`}>
//         {colors.map((color, index) => (
//           <div
//             key={index}
//             className={styles.colorOption}
//             style={{ backgroundColor: color }}
//             onClick={() => handleColorSelect(color)}
//           />
//         ))}
//       </div>
//     </div>
//   )
// } 


'use client'

import React, { useState } from 'react'
import { Button } from 'react-bootstrap'
import { FaCamera, FaPalette } from 'react-icons/fa'
import styles from './cover.module.scss'

export default function LowContent() {
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [selectedColors, setSelectedColors] = useState(['#f8f1e3', '#e3d5ca'])
  const [selectingIndex, setSelectingIndex] = useState(0) // 0 或 1

  const colors = ['#f8f1e3', '#e3d5ca', '#d5bdaf', '#a3b18a', '#588157', '#3a5a40']

  const handleColorSelect = (color) => {
    const newColors = [...selectedColors]
    newColors[selectingIndex] = color
    setSelectedColors(newColors)
    setShowColorPicker(false)
  }

  return (
    <div className={styles.coverContainer}>
      <div
        className={styles.coverImage}
        style={{
          background: `linear-gradient(135deg, ${selectedColors[0]}, ${selectedColors[1]})`,
          animation: 'gradientShift 6s ease infinite'
        }}
      />

      <div className={styles.coverEditBtn}>
        <div className={styles.editOptions}>
          <Button variant="light" className={styles.editBtn}>
            <FaCamera />
          </Button>
          {/* 按下不同按鈕，選擇要改哪一個顏色 */}
          <Button
            variant="light"
            className={styles.editBtn}
            onClick={() => {
              setSelectingIndex(0)
              setShowColorPicker(!showColorPicker)
            }}
          >
            🎨 顏色 1
          </Button>
          <Button
            variant="light"
            className={styles.editBtn}
            onClick={() => {
              setSelectingIndex(1)
              setShowColorPicker(!showColorPicker)
            }}
          >
            🌈 顏色 2
          </Button>
        </div>
      </div>

      <div className={`${styles.colorPicker} ${showColorPicker ? styles.show : ''}`}>
        {colors.map((color, index) => (
          <div
            key={index}
            className={styles.colorOption}
            style={{ backgroundColor: color }}
            onClick={() => handleColorSelect(color)}
          />
        ))}
      </div>
    </div>
  )
}
