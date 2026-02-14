import { Typography } from 'antd'
import React from 'react'

interface ApartmentDescriptionProps {
  description: string
}

export default function ApartmentDescription({ description }: ApartmentDescriptionProps) {
  return (
    <div className='mt-7 space-y-3'>
      <h2 className='font-semibold text-xl'>Mô tả</h2>
      <Typography.Paragraph className='text-justify'>
        {description}
      </Typography.Paragraph>
    </div>
  )
}
