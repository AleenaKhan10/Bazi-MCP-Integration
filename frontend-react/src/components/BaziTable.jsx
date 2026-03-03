/* ===========================================
   BaZi Table Component — Simplified Four Pillars
   ===========================================
   
   Displays the core BaZi chart as a clean table:
   HOUR | DAY | MONTH | YEAR columns
   HS (天干) row + EB (地支) row
   
   The Day column's Heavenly Stem (日主) gets a 
   RED BOX to identify the Day Master.
   
   Uses data directly from baziResult context.
*/

// --- Character to Name Mappings (same as backend) ---
const STEM_NAMES = {
  '甲': 'Jia', '乙': 'Yi', '丙': 'Bing', '丁': 'Ding', '戊': 'Wu',
  '己': 'Ji', '庚': 'Geng', '辛': 'Xin', '壬': 'Ren', '癸': 'Gui'
}

const BRANCH_NAMES = {
  '子': 'Rat', '丑': 'Ox', '寅': 'Tiger',
  '卯': 'Rabbit', '辰': 'Dragon', '巳': 'Snake',
  '午': 'Horse', '未': 'Goat', '申': 'Monkey',
  '酉': 'Rooster', '戌': 'Dog', '亥': 'Pig'
}

// Element color mapping (for Chinese characters)
const ELEMENT_COLORS = {
  '木': '#22c55e',  // Wood = green
  '火': '#ef4444',  // Fire = red
  '土': '#d97706',  // Earth = amber
  '金': '#9ca3af',  // Metal = gray
  '水': '#3b82f6',  // Water = blue
}

function extractPillar(pillarData) {
  if (!pillarData || typeof pillarData !== 'object') {
    return { stem: '?', stemName: '?', stemElement: '', branch: '?', branchName: '?', branchElement: '' }
  }
  const stemData = pillarData['天干'] || {}
  const branchData = pillarData['地支'] || {}
  
  const stem = stemData['天干'] || '?'
  const branch = branchData['地支'] || '?'
  
  return {
    stem,
    stemName: STEM_NAMES[stem] || stem,
    stemElement: stemData['五行'] || '',
    branch,
    branchName: BRANCH_NAMES[branch] || branch,
    branchElement: branchData['五行'] || '',
  }
}

export default function BaziTable({ baziResult, formData }) {
  if (!baziResult) return null

  // Extract the 4 pillars from baziResult
  const hourPillar = extractPillar(baziResult['时柱'])
  const dayPillar = extractPillar(baziResult['日柱'])
  const monthPillar = extractPillar(baziResult['月柱'])
  const yearPillar = extractPillar(baziResult['年柱'])

  // Build header details from formData
  const time = formData?.birthTime || ''
  const day = formData?.birthDay || ''
  const month = formData?.birthMonth || ''
  const year = formData?.birthYear || ''

  const pillars = [
    { label: 'HOUR', detail: time, ...hourPillar },
    { label: 'DAY', detail: day, ...dayPillar, isDayMaster: true },
    { label: 'MONTH', detail: month, ...monthPillar },
    { label: 'YEAR', detail: year, ...yearPillar },
  ]

  return (
    <div className="bazi-table-wrapper">
      <table className="bazi-table-front">
        {/* Header Row */}
        <thead>
          <tr>
            <th className="bazi-label-cell"></th>
            {pillars.map((p, i) => (
              <th key={i} className="bazi-header-cell">
                <div className="bazi-header-label">{p.label}</div>
                {p.detail && <div className="bazi-header-detail">{p.detail}</div>}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* HS Row (天干 - Heavenly Stems) */}
          <tr>
            <td className="bazi-row-label">
              <div>HS</div>
              <div className="bazi-row-label-chinese">天干</div>
            </td>
            {pillars.map((p, i) => (
              <td 
                key={i} 
                className="bazi-element-cell"
                style={{ background: p.stemElement ? `${ELEMENT_COLORS[p.stemElement]}10` : 'transparent' }}
              >
                {/* RED BOX around Day Master HS */}
                <div 
                  className={`bazi-char ${p.isDayMaster ? 'bazi-day-master-box' : ''}`}
                  style={{ color: ELEMENT_COLORS[p.stemElement] || '#fff' }}
                >
                  {p.stem}
                </div>
                <div className="bazi-romanized">{p.stemName}</div>
              </td>
            ))}
          </tr>
          {/* EB Row (地支 - Earthly Branches) */}
          <tr>
            <td className="bazi-row-label">
              <div>EB</div>
              <div className="bazi-row-label-chinese">地支</div>
            </td>
            {pillars.map((p, i) => (
              <td 
                key={i} 
                className="bazi-element-cell"
                style={{ background: p.branchElement ? `${ELEMENT_COLORS[p.branchElement]}10` : 'transparent' }}
              >
                <div 
                  className="bazi-char"
                  style={{ color: ELEMENT_COLORS[p.branchElement] || '#fff' }}
                >
                  {p.branch}
                </div>
                <div className="bazi-romanized">{p.branchName}</div>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  )
}
