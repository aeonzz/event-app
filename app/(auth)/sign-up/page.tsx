import SignUpForm from '@/components/Forms/Signup';

const page = () => {
  return (
    <div className='w-full h-screen flex items-center'>
      <div className='flex-1 h-screen bg-zinc-800'>
        <h2 className='text-2xl text-start font-bold m-7'>Rendezvy</h2>
      </div>
      <div className='flex-1 h-screen grid place-items-center border shadow-xl'>
        <SignUpForm />
      </div>
    </div>
  );
};

export default page;