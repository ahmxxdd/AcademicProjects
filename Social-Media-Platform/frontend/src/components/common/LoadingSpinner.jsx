// Define a functional component called LoadingSpinner
const LoadingSpinner = ({ size = "md" }) => {
  // Dynamically set the class for the spinner size based on the 'size' prop, defaulting to 'md' (medium)
  const sizeClass = `loading-${size}`;

  // Return a <span> element with the appropriate classes for styling the loading spinner
  return <span className={`loading loading-spinner ${sizeClass}`} />;
};

// Export the LoadingSpinner component for use in other parts of the application
export default LoadingSpinner;
