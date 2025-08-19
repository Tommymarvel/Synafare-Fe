import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/dash'); // since that's your "main dashboard"
}
