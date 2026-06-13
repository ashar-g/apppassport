import Head from "next/head";

export default function SignIn() {
  return (
    <>
      <Head>
        <title>Sign in with Auth0 - AppPassport</title>
      </Head>

      <div style={{
        minHeight:"100vh",
        display:"flex",
        alignItems:"center",
        justifyContent:"center",
        background:"#f5f7fb",
        padding:"24px"
      }}>
        <div style={{
          maxWidth:"520px",
          width:"100%",
          background:"#fff",
          borderRadius:"16px",
          padding:"40px",
          boxShadow:"0 10px 30px rgba(0,0,0,0.08)",
          textAlign:"center"
        }}>
          <h1>AppPassport</h1>
          <p style={{fontSize:"18px",marginBottom:"24px"}}>
            From onboarding to governance — one passport for every application.
          </p>

          <p style={{color:"#666",marginBottom:"32px"}}>
            Secure enterprise access powered by Auth0.
          </p>

          <a
            href="/auth/login"
            style={{
              display:"inline-block",
              padding:"14px 28px",
              borderRadius:"8px",
              textDecoration:"none",
              fontWeight:"600",
              border:"1px solid #ddd"
            }}
          >
            Sign in with Auth0
          </a>

          <div style={{marginTop:"24px",fontSize:"14px",color:"#777"}}>
            Single Sign-On • Application Governance • Access Lifecycle
          </div>
        </div>
      </div>
    </>
  );
}
