import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="py-8 px-4 mt-24 max-w-screen-xl lg:py-16 lg:px-6">
      <div className="mx-auto max-w-screen-sm text-center">
        <h1 className="mb-4 text-7xl tracking-tight font-extrabold text-primary-600 dark:text-primary-500">404</h1>
        <p className="mb-4 text-2xl tracking-tight font-bold text-gray-900 dark:text-white">Something&apos;s missing.</p>
        <p className="mb-4 text-md font-light text-gray-500 dark:text-gray-400">Sorry, we can&apos;t find that page. You&apos;ll find lots to explore on the home page. </p>
        <Link href="/" className="inline-flex text-black dark:text-white bg-primary-600 hover:bg-primary-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-primary-900 my-4">Back to Homepage</Link>
      </div>
    </div>
  )
}