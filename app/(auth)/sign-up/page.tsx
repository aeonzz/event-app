import NotFound from '@/app/not-found';
import SignUpForm from '@/components/Forms/Signup';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';

const signUp = () => {

  return (
    <div className='w-full h-auto p-16 flex items-center justify-center'>
      <SignUpForm />
    </div>
  );

};

export default signUp;