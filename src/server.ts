import app from "./app";
import config from "./config";
import {autoReturnBookings} from "./modules/booking/booking.service"
const port = config.port;

app.listen(port, () => {
  console.log(`Vehicle Rental System app listening on port ${port}`);
});


// Auto-return bookings
setInterval(async () => {
  try {
    console.log("Running auto return job...");
    await autoReturnBookings();
  } catch (error) {
    console.error("Auto return job failed:", error);
  }
}, 60 * 1000); 