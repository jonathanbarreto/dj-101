import {notFound} from 'next/navigation';
import {CoordPicker} from './CoordPicker';

export default function CoordsPage() {
  if (process.env.NODE_ENV !== 'development') notFound();
  return <CoordPicker />;
}
