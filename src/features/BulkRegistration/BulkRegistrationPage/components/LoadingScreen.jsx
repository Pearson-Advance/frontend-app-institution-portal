const LoadingScreen = () => (
  <div className="state-card state-card--loading">
    <div className="spinner" />
    <p className="state-card__title">Processing your file...</p>
    <p className="state-card__subtitle">This may take a moment</p>
  </div>
);

export default LoadingScreen;
