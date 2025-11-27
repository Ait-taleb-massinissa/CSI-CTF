export default function PageContainer({ children }) {
  return (
    <div style={{
      padding: "40px 60px",
      maxWidth: "900px",
      margin: "0 auto"
    }}>
      {children}
    </div>
  );
}
