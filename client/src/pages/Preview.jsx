import React, { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { dummyResumeData } from "../assets/assets";
import ResumePreview from "../components/ResumePreview"
import Loader from "../components/Loader"
import { ArrowLeftIcon } from "lucide-react"
import api from "../configs/api"

const Preview = () => {
  const { resumeId } = useParams()

  const [resumeData, setResumeData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      // try fetch public resume from server
      try {
        const { data } = await api.get(
          `/api/resumes/public/${resumeId}`
        )

        if (data?.resume) {
          setResumeData(data.resume)
          setIsLoading(false)
          return
        }
      } catch (err) {
        // ignore and fallback to dummy
      }

      const data = dummyResumeData.find(
        (resume) => String(resume._id || resume.id) === resumeId
      )

      setResumeData(data || null)
      setIsLoading(false)
    }

    load()
  }, [resumeId])

  if (isLoading) {
    return <Loader />
  }

  return resumeData ? (
    <div className="bg-slate-100 min-h-screen">
      <div className="max-w-3xl mx-auto py-10">
        <ResumePreview
          data={resumeData}
          template={resumeData.template}
          accentColor={resumeData.accent_color}
          classes="py-4 bg-white"
        />
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center h-screen">
      <p className="text-center text-6xl text-slate-400 font-medium">
        Resume not found
      </p>
      <Link
        to="/"
        className="mt-6 bg-green-500 hover:bg-green-600 text-white rounded-full px-6 h-9 ring-1 ring-green-400 flex items-center transition-colors"
      >
        <ArrowLeftIcon className="mr-2 size-4" />
        Go to home page
      </Link>
    </div>
  )
}

export default Preview
