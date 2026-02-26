// Dữ liệu tỉnh/thành phố và quận/huyện Việt Nam
export const LOCATIONS: Record<string, string[]> = {
     'Hồ Chí Minh': [
          'Quận 1', 'Quận 3', 'Quận 4', 'Quận 5', 'Quận 6', 'Quận 7', 'Quận 8',
          'Quận 10', 'Quận 11', 'Quận 12', 'Bình Thạnh', 'Gò Vấp', 'Phú Nhuận',
          'Tân Bình', 'Tân Phú', 'Bình Tân', 'Thủ Đức', 'Nhà Bè', 'Hóc Môn',
          'Củ Chi', 'Bình Chánh', 'Cần Giờ',
     ],
     'Hà Nội': [
          'Ba Đình', 'Hoàn Kiếm', 'Hai Bà Trưng', 'Đống Đa', 'Tây Hồ', 'Cầu Giấy',
          'Thanh Xuân', 'Hoàng Mai', 'Long Biên', 'Nam Từ Liêm', 'Bắc Từ Liêm',
          'Hà Đông', 'Sơn Tây', 'Đông Anh', 'Gia Lâm', 'Thanh Trì',
     ],
     'Đà Nẵng': [
          'Hải Châu', 'Thanh Khê', 'Sơn Trà', 'Ngũ Hành Sơn', 'Liên Chiểu',
          'Cẩm Lệ', 'Hòa Vang',
     ],
     'Cần Thơ': [
          'Ninh Kiều', 'Bình Thủy', 'Cái Răng', 'Ô Môn', 'Thốt Nốt',
          'Phong Điền', 'Cờ Đỏ', 'Thới Lai', 'Vĩnh Thạnh',
     ],
     'Bình Dương': [
          'Thủ Dầu Một', 'Dĩ An', 'Thuận An', 'Tân Uyên', 'Bến Cát',
          'Bàu Bàng', 'Phú Giáo', 'Dầu Tiếng', 'Bắc Tân Uyên',
     ],
     'Đồng Nai': [
          'Biên Hòa', 'Long Khánh', 'Long Thành', 'Nhơn Trạch', 'Trảng Bom',
          'Vĩnh Cửu', 'Xuân Lộc', 'Thống Nhất', 'Định Quán', 'Tân Phú', 'Cẩm Mỹ',
     ],
     'Hải Phòng': [
          'Hồng Bàng', 'Ngô Quyền', 'Lê Chân', 'Hải An', 'Kiến An',
          'Đồ Sơn', 'Dương Kinh', 'Thủy Nguyên', 'An Dương',
     ],
}

export const CITIES = Object.keys(LOCATIONS)
