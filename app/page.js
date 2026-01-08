
import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <h1>Welcome to BMDRM Documentation</h1>
      <p>Select a topic from the sidebar to get started.</p>
      <div style={{ marginTop: '2rem' }}>
        <Link href="/docs/intro" style={{
          color: '#3b82f6',
          border: '1px solid #3b82f6',
          padding: '10px 20px',
          borderRadius: '5px'
        }}>
          Get Started
        </Link>
      </div>
    </div>
  );
}
