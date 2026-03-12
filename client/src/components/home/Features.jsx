import React from 'react'
import { Zap } from 'lucide-react'
import Title from './Title'
const Features = () => {
  const [isHover, setIsHover] = React.useState(false);
  return (
    <>
      <div id='features' className='flex flex-col items-center mt-10 scroll-mt-12'>

        <div className="flex items-center gap-2 text-sm text-green-600 bg-green-400/10 rounded-full px-6 py-1.5">
          <Zap width={14} />
          <span>Simple Process</span>
        </div>
        <Title title='Build your resume' description='Our streamlined process helps you create a professional resume in minutes with intelligent AI-powered tools and features.' />
        <div className="flex flex-col md:flex-row items-center">
          <img
            className="max-w-xl w-full xl:w-1/2"
            src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/features/group-image-1.png"
            alt=""
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
          />

          <div className="px-4 md:px-0 space-y-6">
            {/* Feature 1 - Fixed hover */}
            <div className="flex items-start gap-6 max-w-md p-6 rounded-xl cursor-pointer group
                hover:bg-violet-50 transition-colors">

              <div className="p-4 rounded-xl bg-violet-100 group-hover:bg-violet-300 transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="size-6 text-violet-700"
                >
                  <path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path>
                  <path d="M22 12A10 10 0 0 0 12 2v10z"></path>
                </svg>
              </div>
              <div className="space-y-2">
                <h3 className="text-base font-semibold text-slate-700">
                  Real-Time Analytics
                </h3>
                <p className="text-sm text-slate-600 max-w-xs">
                  Get instant insights into your finances with live dashboards.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex items-start gap-6 max-w-md p-6 rounded-xl cursor-pointer group
                hover:bg-green-50 transition-colors">

              <div className="p-4 rounded-xl bg-green-100 group-hover:bg-green-300 transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="size-6 text-green-700"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </div>
              <div className="space-y-2">
                <h3 className="text-base font-semibold text-slate-700">
                  Bank-Grade Security
                </h3>
                <p className="text-sm text-slate-600 max-w-xs">
                  End-to-end encryption, 2FA, compliance with GDPR standards.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex items-start gap-6 max-w-md p-6 rounded-xl cursor-pointer group
                hover:bg-orange-50 transition-colors">

              <div className="p-4 rounded-xl bg-orange-100 group-hover:bg-orange-300 transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="size-6 text-orange-700"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
              </div>
              <div className="space-y-2">
                <h3 className="text-base font-semibold text-slate-700">
                  Customizable Reports
                </h3>
                <p className="text-sm text-slate-600 max-w-xs">
                  Export professional, audit-ready financial reports for tax or internal review.
                </p>
              </div>
            </div>
          </div>
        </div>

        <style>
          {`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
          * {
            font-family: 'Poppins', sans-serif;
          }
        `}
        </style>
      </div>
    </>
  )
}

export default Features