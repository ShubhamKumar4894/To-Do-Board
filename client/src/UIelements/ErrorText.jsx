import './ErrorText.css'
export const ErrorText = ({ message }) => {
  return (
    <p className="error-text">
      {message}
    </p>
  );
}