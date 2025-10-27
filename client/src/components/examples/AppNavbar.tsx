import AppNavbar from '../AppNavbar';

export default function AppNavbarExample() {
  return (
    <AppNavbar
      userName="John Doe"
      onLogout={() => console.log('Logout triggered')}
    />
  );
}
