// This function formats the post creation date into a human-readable format
export const formatPostDate = (createdAt) => {
  const currentDate = new Date(); // Get the current date
  const createdAtDate = new Date(createdAt); // Convert the createdAt string to a Date object

  // Calculate the difference between the current time and the post creation time
  const timeDifferenceInSeconds = Math.floor((currentDate - createdAtDate) / 1000); // Difference in seconds
  const timeDifferenceInMinutes = Math.floor(timeDifferenceInSeconds / 60); // Difference in minutes
  const timeDifferenceInHours = Math.floor(timeDifferenceInMinutes / 60); // Difference in hours
  const timeDifferenceInDays = Math.floor(timeDifferenceInHours / 24); // Difference in days

  // Return the formatted post date based on the time difference
  if (timeDifferenceInDays > 1) {
    // If the post was created more than 1 day ago, return the formatted date (month and day)
    return createdAtDate.toLocaleDateString("en-US", {
      month: "short", // Short month name (e.g., "Jan")
      day: "numeric", // Day of the month (e.g., "10")
    });
  } else if (timeDifferenceInDays === 1) {
    // If the post was created exactly 1 day ago, return "1d"
    return "1d";
  } else if (timeDifferenceInHours >= 1) {
    // If the post was created within the last 24 hours, return hours (e.g., "2h")
    return `${timeDifferenceInHours}h`;
  } else if (timeDifferenceInMinutes >= 1) {
    // If the post was created within the last hour, return minutes (e.g., "5m")
    return `${timeDifferenceInMinutes}m`;
  } else {
    // If the post was created within the last minute, return "Just now"
    return "Just now";
  }
};

// This function formats the date when a user joined the platform into a readable string
export const formatMemberSinceDate = (createdAt) => {
  const date = new Date(createdAt); // Convert the createdAt string to a Date object
  const months = [
    "January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December",
  ]; // Array containing the full month names

  const month = months[date.getMonth()]; // Get the month name from the month index
  const year = date.getFullYear(); // Get the year of the createdAt date

  // Return a formatted string like "Joined March 2023"
  return `Joined ${month} ${year}`;
};
