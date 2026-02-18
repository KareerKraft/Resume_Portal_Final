import React, { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { useSelector } from 'react-redux'
import axios from 'axios'
import { dummyResumeData } from "../assets/assets"
import { toast } from 'react-hot-toast';
import {
  Share2Icon,
  EyeIcon,
  EyeOffIcon,
  DownloadIcon,
  ArrowLeftIcon,
  ChevronLeft,
  ChevronRight,
  User,
  FileText,
  Briefcase,
  GraduationCap,
  FolderIcon,
  Sparkles,
} from "lucide-react"

import TemplateSelector from "../components/TemplateSelector"
import ColorPicker from "../components/ColorPicker"
import ProfessionalSummary from "../components/ProfessionalSummary"
import ExperienceForm from "../components/ExperienceForm"
import EducationForm from "../components/EducationForm"
import ProjectForm from "../components/ProjectForm"
import SkillsForm from "../components/SkillsForm"
import PersonalInfoForm from "../components/PersonalInfoForm"
import ResumePreview from "../components/ResumePreview"

const ResumeBuilder = () => {
  const { resumeId } = useParams()
  const { token } = useSelector(state => state.auth)

  const [resumeData, setResumeData] = useState({
    _id: "",
    title: "",
    personal_info: {},
    professional_summary: "",
    experience: [],
    education: [],
    project: [],
    skills: [],
    template: "classic",
    accent_color: "#3B82F6",
    public: false,
  })

  const [activeSectionIndex, setActiveSectionIndex] = useState(0)
  const [removeBackground, setRemoveBackground] = useState(false)

  const sections = [
    { id: "personal", name: "Personal Info", icon: User },
    { id: "summary", name: "Summary", icon: FileText },
    { id: "experience", name: "Experience", icon: Briefcase },
    { id: "education", name: "Education", icon: GraduationCap },
    { id: "projects", name: "Projects", icon: FolderIcon },
    { id: "skills", name: "Skills", icon: Sparkles },
  ]

  const activeSection = sections[activeSectionIndex]

  useEffect(() => {
    const load = async () => {
      // check local dummy data first
      const resume = dummyResumeData.find((r) => r._id === resumeId)
      if (resume) {
        setResumeData(resume)
        document.title = resume.title
        return
      }

      try {
        const { data } = await axios.get(`http://localhost:3000/api/resumes/get/${resumeId}`, {
          headers: { Authorization: token }
        })
        if (data?.resume) {
          setResumeData(data.resume)
          document.title = data.resume.title || ''
        }
      } catch (error) {
        // fail silently; keep defaults
        console.error(error?.response?.data || error.message)
      }
    }

    load()
  }, [resumeId])

  /* ================= ACTIONS ================= */

  const saveChanges = async () => {
    try {
      const formData = new FormData();
      
      // Add image file if it exists and is a File object
      if (resumeData.personal_info.image instanceof File) {
        formData.append('image', resumeData.personal_info.image);
      }
      
      // Create a copy of resumeData without the image for sending
      const resumeDataToSend = JSON.parse(JSON.stringify(resumeData));
      if (resumeData.personal_info.image instanceof File) {
        delete resumeDataToSend.personal_info.image;
      }
      
      // Add form fields
      formData.append('resumeId', resumeId);
      formData.append('resumeData', JSON.stringify(resumeDataToSend));
      formData.append('removeBackground', removeBackground);
      
      const response = await axios.put(
        `http://localhost:3000/api/resumes/update`,
        formData,
        {
          headers: { 
            Authorization: token
          }
        }
      );
      
      // Update state with the response data (includes image URL if uploaded)
      if (response.data.resume) {
        setResumeData(response.data.resume);
      }
      
      toast.success('Resume saved successfully!');
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
      console.error(error);
    }
  }

  const changeResumeVisibility = async () => {
    const newPublic = !resumeData.public

    try {
      // Create a copy of resume data for sending (without File objects)
      const resumeDataToSend = JSON.parse(JSON.stringify(resumeData));
      resumeDataToSend.public = newPublic;
      
      // Remove image if it's a File object (will be undefined after JSON.stringify)
      // JSON.stringify will convert File objects to {}, so we just send as-is

      // persist to server
      await axios.put(
        `http://localhost:3000/api/resumes/update`,
        { resumeId, resumeData: resumeDataToSend },
        { headers: { Authorization: token } }
      )

      setResumeData((prev) => ({ ...prev, public: newPublic }))

      // copy public link and open
      const resumeUrl = `${window.location.origin}/view/${resumeId}`
      try {
        await navigator.clipboard.writeText(resumeUrl)
      } catch (err) {
        // ignore clipboard errors
      }

      if (newPublic) {
        alert('Resume is now public. Link copied to clipboard.')
        window.open(resumeUrl, '_blank')
      } else {
        alert('Resume set to private')
      }
    } catch (error) {
      console.error(error)
      toast.error(error?.response?.data?.message || error.message)
    }
  }

  const handleShare = () => {
    const resumeUrl = `${window.location.origin}/view/${resumeId}`

    if (navigator.share && /Mobi|Android/i.test(navigator.userAgent)) {
      navigator.share({
        title: "My Resume",
        url: resumeUrl,
      })
    } else {
      navigator.clipboard.writeText(resumeUrl)
      alert("Resume link copied to clipboard")
    }
  }

  const downloadResume = () => {
    const printContents = document.getElementById("resume-print").innerHTML
    const originalContents = document.body.innerHTML

    document.body.innerHTML = printContents
    window.print()
    document.body.innerHTML = originalContents
    window.location.reload()
  }

  /* ================= UI ================= */

  return (
    <div>
      {/* HEADER */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Link
          to="/app"
          className="inline-flex gap-2 items-center text-slate-500 hover:text-slate-700"
        >
          <ArrowLeftIcon className="size-4" /> Back to Dashboard
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-8">
        <div className="grid lg:grid-cols-12 gap-8">

          {/* LEFT PANEL */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-lg shadow-sm border p-6">

              {/* Progress */}
              <div className="h-1 bg-gray-200 rounded mb-4">
                <div
                  className="h-1 bg-green-500 rounded"
                  style={{
                    width: `${((activeSectionIndex + 1) / sections.length) * 100}%`,
                  }}
                />
              </div>

              {/* Template / Accent */}
              <div className="flex gap-2 mb-4">
                <TemplateSelector
                  selectedTemplate={resumeData.template}
                  onChange={(template) =>
                    setResumeData((prev) => ({ ...prev, template }))
                  }
                />
                <ColorPicker
                  selectedColor={resumeData.accent_color}
                  onChange={(color) =>
                    setResumeData((prev) => ({ ...prev, accent_color: color }))
                  }
                />
              </div>

              {/* PREVIOUS / NEXT */}
              <div className="flex justify-between items-center mt-4">
                {activeSectionIndex > 0 ? (
                  <button
                    onClick={() =>
                      setActiveSectionIndex((i) => Math.max(i - 1, 0))
                    }
                    className="flex items-center gap-1 p-3 text-sm text-gray-600 hover:bg-gray-50 rounded-lg"
                  >
                    <ChevronLeft className="size-4" />
                    Previous
                  </button>
                ) : (
                  <div />
                )}

                <button
                  onClick={() =>
                    setActiveSectionIndex((i) =>
                      Math.min(i + 1, sections.length - 1)
                    )
                  }
                  disabled={activeSectionIndex === sections.length - 1}
                  className="flex items-center gap-1 p-3 text-sm text-gray-600 hover:bg-gray-50 rounded-lg disabled:opacity-50"
                >
                  Next
                  <ChevronRight className="size-4" />
                </button>
              </div>

              {/* FORMS */}
              {activeSection.id === "personal" && (
                <PersonalInfoForm
                  data={resumeData.personal_info}
                  onChange={(data) =>
                    setResumeData((prev) => ({ ...prev, personal_info: data }))
                  }
                  removeBackground={removeBackground}
                  setRemoveBackground={setRemoveBackground}
                />
              )}

              {activeSection.id === "summary" && (
                <ProfessionalSummary
                  data={resumeData.professional_summary}
                  onChange={(value) =>
                    setResumeData((prev) => ({
                      ...prev,
                      professional_summary: value,
                    }))
                  }
                />
              )}

              {activeSection.id === "experience" && (
                <ExperienceForm
                  data={resumeData.experience}
                  onChange={(data) =>
                    setResumeData((prev) => ({ ...prev, experience: data }))
                  }
                />
              )}

              {activeSection.id === "education" && (
                <EducationForm
                  data={resumeData.education}
                  onChange={(data) =>
                    setResumeData((prev) => ({ ...prev, education: data }))
                  }
                />
              )}

              {activeSection.id === "projects" && (
                <ProjectForm
                  data={resumeData.project}
                  onChange={(data) =>
                    setResumeData((prev) => ({ ...prev, project: data }))
                  }
                />
              )}

              {activeSection.id === "skills" && (
                <SkillsForm
                  data={resumeData.skills}
                  onChange={(data) =>
                    setResumeData((prev) => ({ ...prev, skills: data }))
                  }
                />
              )}

              {/* SAVE CHANGES */}
              <button
                onClick={saveChanges}
                className="bg-gradient-to-br from-green-100 to-green-200
                ring-1 ring-green-300 text-green-600
                hover:ring-green-400 transition-all
                rounded-md px-6 py-2 mt-6 text-sm"
              >
                Save Changes
              </button>
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="lg:col-span-7">
            <div className="flex justify-end gap-2 mb-4">
              <button
                onClick={handleShare}
                className="flex items-center p-2 px-4 gap-2 text-xs
                bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600
                rounded-lg ring-1 ring-blue-300 hover:ring-blue-400 transition-colors"
              >
                <Share2Icon className="size-4" />
              </button>

              <button
                onClick={changeResumeVisibility}
                className="px-3 py-2 text-xs bg-purple-100 rounded flex items-center gap-1"
              >
                {resumeData.public ? (
                  <EyeIcon className="size-4" />
                ) : (
                  <EyeOffIcon className="size-4" />
                )}
                {resumeData.public ? "Public" : "Private"}
              </button>

              <button
                onClick={downloadResume}
                className="flex items-center gap-2 px-6 py-2 text-xs
                bg-gradient-to-br from-green-100 to-green-200 text-green-600
                rounded-lg ring-1 ring-green-300 hover:ring-green-400 transition-colors"
              >
                <DownloadIcon className="size-4" /> Download
              </button>
            </div>

            {/* RESUME */}
            <div id="resume-print">
              <ResumePreview
                data={resumeData}
                template={resumeData.template}
                accentColor={resumeData.accent_color}
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default ResumeBuilder
