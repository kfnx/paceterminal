import { FileUploader } from '@/components/ui/file-uploader';

export default function UploadPage() {
  return (
    <main className='flex min-h-screen flex-col items-center justify-center bg-bg-weak-50 p-4'>
      <FileUploader />
    </main>
  );
}
