import SignupCard from '../SignupCard';

export default function SignupCardExample() {
  return (
    <SignupCard 
      onGoogleSignup={() => console.log('Google signup triggered')}
      onPhoneSignup={() => console.log('Phone signup triggered')}
    />
  );
}
