import { Typography } from 'antd'

interface ApartmentDescriptionProps {
  description: string
}

export default function ApartmentDescription({ description }: ApartmentDescriptionProps) {
  return (
    <div className='mt-6 md:mt-7 space-y-3'>
      <h2 className='font-semibold text-lg md:text-xl'>Mô tả</h2>
      <Typography.Paragraph className='text-justify text-sm md:text-base'>
        {description}
      </Typography.Paragraph>
    </div>
  )
}
