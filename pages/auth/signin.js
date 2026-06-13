import Head from "next/head";
export default function SignIn() {
 return (<><Head><title>Sign In - AppPassport</title></Head><div style={{padding:"40px"}}><h1>AppPassport</h1><p>From onboarding to governance — one passport for every application.</p><a href="/auth/login">Sign in with Auth0</a></div></>);
}
