import React, { useEffect, useState } from "react"
import { Sparkles } from "lucide-react"
import { useSelector } from "react-redux"
import { toast } from "react-hot-toast"
import api from "../configs/api"

const ProfessionalSummary = ({ data, onChange }) => {
  const { token } = useSelector((state) => state.auth)
  const [isEnhancing, setIsEnhancing] = useState(false)
  const [summaryText, setSummaryText] = useState(data || "")

  useEffect(() => {
    setSummaryText(data || "")
  }, [data])

  const handleSummaryChange = (value) => {
    setSummaryText(value)
    onChange(value)
  }

  const handleEnhance = async () => {
    const currentSummary = summaryText.trim()

    if (!currentSummary) {
      toast.error("Write a professional summary first")
      return
    }

    if (!token) {
      toast.error("Please log in to use AI enhancement")
      return
    }

    try {
      setIsEnhancing(true)

      const { data: response } = await api.post(
        "/api/ai/enhance-pro-sum",
        { userContent: currentSummary },
        { headers: { Authorization: token } }
      )

      const enhancedContent = response?.enhancedContent?.trim()

      if (enhancedContent) {
        handleSummaryChange(enhancedContent)
        toast.success("Professional summary enhanced")
      } else {
        toast.error("AI did not return enhanced content")
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message)
    } finally {
      setIsEnhancing(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            <Sparkles className="size-5 text-purple-600" />
            Professional Summary
          </h3>
          <p className="text-sm text-gray-500">
            Add summary for your resume here
          </p>
        </div>

        <button
          type="button"
          onClick={handleEnhance}
          disabled={isEnhancing}
          className="flex items-center gap-1 px-3 py-1.5 text-xs bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <Sparkles className="size-3" />
          {isEnhancing ? "Enhancing..." : "Enhance with AI"}
        </button>
      </div>

      {/* Textarea */}
      <div className="mt-6">
        <textarea
          value={summaryText}
          onChange={(e) => handleSummaryChange(e.target.value)}
          rows={6}
          className="w-full p-3 px-4 mt-2 border text-sm border-gray-300 rounded-lg
          focus:ring focus:ring-blue-500 focus:border-blue-500 outline-none
          transition-colors resize-none"
          placeholder="Write a compelling professional summary that highlights your key strengths and career objectives..."
        />

        <p className="text-xs text-gray-500 max-w-4/5 mx-auto text-center mt-2">
          Tip: Keep it concise (3–4 sentences) and focus on your most relevant
          achievements and skills.
        </p>
      </div>
    </div>
  )
}

export default ProfessionalSummary
