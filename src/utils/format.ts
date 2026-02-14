// Format số thành 70,000 hoặc 70,000 VNĐ
export const formatVND = (value: number | string, showVND = false) => {
     const num = typeof value === 'string' ? Number(value) : value
     const formatted = num.toLocaleString('en-US')
     return showVND ? `${formatted} VNĐ` : formatted
}