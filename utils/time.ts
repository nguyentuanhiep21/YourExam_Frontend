import { format } from "date-fns";

/**
 * Lấy thời gian hiện tại theo múi giờ GMT+7 (Asia/Ho_Chi_Minh)
 * Trả về chuỗi định dạng ISO 8601 kèm offset +07:00
 */
export function getGmt7IsoString(): string {
  // Lấy thời gian UTC hiện tại, sau đó cộng thêm 7 tiếng (7 * 60 * 60 * 1000 ms)
  const now = new Date();
  const utcMs = now.getTime() + (now.getTimezoneOffset() * 60000);
  const gmt7Date = new Date(utcMs + (3600000 * 7));
  
  // Format thành chuỗi yyyy-MM-dd'T'HH:mm:ss.SSS+07:00
  return format(gmt7Date, "yyyy-MM-dd'T'HH:mm:ss.SSS") + "+07:00";
}
