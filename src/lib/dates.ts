import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const TZ = "Asia/Jakarta";

export function calculateBookingDates(eventDateIso: string) {
  const eventDate = dayjs.tz(eventDateIso, TZ).startOf("day");

  return {
    eventDate: eventDate.toDate(),
    dropOffDate: eventDate.subtract(3, "day").toDate(), // BH-RISK-02: Diubah ke H-3
    pickUpDate: eventDate.subtract(1, "day").toDate(), // H-1
    returnDate: eventDate.add(2, "day").toDate(), // H+2
  };
}
