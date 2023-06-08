import React from 'react'

const unique_idToColor = unique_id => {
  if (unique_id[0] % 2 === 0) {
    return `${process.env.PUBLIC_URL}/assets/red.png`
  } else {
    return `${process.env.PUBLIC_URL}/assets/yellow.png`
  }
}

const CollectibleAvatar = props => {
  const outerStyle = { height: '160px', position: 'relative', width: '50%' }
  const innerStyle = {
    height: '150px',
    position: 'absolute',
    top: '3%',
    left: '50%',
  }
  const { unique_id } = props

  if (!unique_id) return null

  const color = unique_idToColor(unique_id)
  return (
    <div style={outerStyle}>
      <img alt="body" src={color} style={innerStyle} />
    </div>
  )
}

export default CollectibleAvatar
