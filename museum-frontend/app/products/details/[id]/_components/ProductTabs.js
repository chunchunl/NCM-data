'use client'

import React, { useState } from 'react'
import '../_styles/ProductTabs.scss'

export default function ProductTabs() {
  const [activeTab, setActiveTab] = useState('desc')

  const handleTabClick = (tab) => {
    setActiveTab(tab)
  }

  return (
    <div className="container product-tab">
      <div className="row">
        {/* 左側選單 + 中線 */}
        <div className="col-12 col-md-2 mb-4 mb-md-0 tab-left">
          <div className="tab-nav">
            <button
              className={`tab-button ${activeTab === 'desc' ? 'active' : ''}`}
              data-tab="desc"
              onClick={() => handleTabClick('desc')}
            >
              商品說明
            </button>
            <button
              className={`tab-button ${activeTab === 'note' ? 'active' : ''}`}
              data-tab="note"
              onClick={() => handleTabClick('note')}
            >
              注意事項
            </button>
          </div>
        </div>
        {/* 右側內容 */}
        <div className="col-12 col-md-10">
          {/* 商品說明 */}
          <div
            className={`tab-content desc ${activeTab === 'desc' ? 'active' : ''}`}
          >
            <h4 className="fw-bold">商品說明</h4>
            <p className="mb-2">青花纏枝天球瓶</p>
            <p className="desc-text">
              文物描述：侈口，直頸，圓鼓腹，平底略凹，無足。天球瓶因形似天上星球故名，器型為永樂官窯所創製。口沿下畫花卉紋一周，上下各加飾青線二道，圓腹通體繪一回首穿蓮三爪行龍，張口、吐舌、露牙、雙目圓睜，闊步奔行，龍身滿畫鱗甲，雄武矯健。瓶頸、隙地滿畫轉枝蓮紋。青花鮮豔濃重，多處帶褐綠斑或鐵褐結晶疵斑，並滲青斑點。白釉泛青，內壁尤甚。胎骨厚重，底部露胎處，質堅細膩泛橘紅色，肩腹間接痕三道。永樂、宣德年間，盛行燒製大型器，如天球瓶、扁壺等，紋飾多以龍紋及花卉紋最為常見。永樂天球瓶造型、紋飾雄偉精緻為其時代特色。
            </p>
            {/* 模擬表格區塊 */}
            <div className="row border-top border-1 text-center fw-bold py-2">
              <div className="col-4">材質</div>
              <div className="col-4">出產地</div>
              <div className="col-4">用途(功能)</div>
            </div>
            <div className="row text-center py-2">
              <div className="col-4">瓷土</div>
              <div className="col-4">中國</div>
              <div className="col-4">觀賞</div>
            </div>
          </div>
          {/* 注意事項 */}
          <div
            className={`tab-content note ${activeTab === 'note' ? 'active' : ''}`}
          >
            <h4 className="fw-bold">注意事項</h4>
            <p className="desc-text">
              為了保障您的權益，故宮網路商城所購買的商品，辦理退換貨時，且商品必須是全新狀態與完整包裝(商品、附件、內外包裝、隨貨文件、贈品等)。因此若您在訂購商品前或收到商品後，希望更進一步了解商品的使用方式，或對該產品有任何疑慮，請先來函或來電與客服人員連絡。
              因拍攝與個人螢幕略有色差，圖片僅供參考，顏色請以實際收到商品為準。
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}