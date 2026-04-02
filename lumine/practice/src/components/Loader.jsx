const Loader = ({ fullPage = false }) => {
  if (fullPage) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="loader" />
      </div>
    );
  }

  return (
    <div className="loader-wrap">
      <div className="loader" />
    </div>
  );
};

export default Loader;
