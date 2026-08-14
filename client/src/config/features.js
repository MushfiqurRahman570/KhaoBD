// Simple feature toggles. Flipping a flag to false hides the feature from the
// UI without deleting any of its code, routes, or data — flip it back to true
// to bring it back instantly.
export const FEATURES = {
  // Table booking is paused while a map is shown in its place on the
  // restaurant detail page. The booking form, API routes, and "My bookings"
  // list in the profile page all still exist and work — they're just hidden.
  booking: false,
};
