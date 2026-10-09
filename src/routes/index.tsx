import { createFileRoute } from '@tanstack/react-router';
import { HomePage, homeHead } from '@/components/home-experience';

export const Route = createFileRoute('/')({
  head: homeHead,
  component: HomePage,
});
