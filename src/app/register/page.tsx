'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Upload, X, Check, AlertCircle } from 'lucide-react'
import FooterSection from '@/components/sections/FooterSection'

export default function RegisterPage() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    // Step 1: Personal Details
    name: '',
    email: '',
    phone: '',
    gender: '',
    dateOfBirth: '',
    country: '',
    city: '',
    profilePhoto: null as File | null,
    profilePhotoPreview: '',
    password: '',
    confirmPassword: '',
    
    // Step 2: Research & Motivation Details
    motivation: '',
    fieldCategory: '',
    otherFieldCategory: '',
    hasExperience: false,
    experienceDescription: '',
    teamworkFeelings: '',
    futureGoals: '',
    skills: [] as string[],
    otherSkills: '',
    hobbies: '',
    availabilityDays: '',
    availabilityHours: '',
    linkedin: '',
    github: ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [generalError, setGeneralError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const skillsOptions = [
    'Programming',
    'Machine Learning',
    'Data Science',
    'Web Development',
    'Mobile Development',
    'Cloud Computing',
    'Database Management',
    'Network Security',
    'Automotive Engineering',
    'Vehicle Design',
    'Mechanical Engineering',
    'Electrical Engineering',
    'Robotics',
    'AI/ML',
    'Computer Vision'
  ]

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format'
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required'
    if (!formData.gender) newErrors.gender = 'Gender is required'
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required'
    if (!formData.country.trim()) newErrors.country = 'Country is required'
    if (!formData.city.trim()) newErrors.city = 'City is required'
    if (!formData.password) newErrors.password = 'Password is required'
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters'
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm password'
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.motivation.trim()) newErrors.motivation = 'Motivation is required'
    if (!formData.fieldCategory) newErrors.fieldCategory = 'Field category is required'
    if (formData.hasExperience && !formData.experienceDescription.trim()) {
      newErrors.experienceDescription = 'Experience description is required'
    }
    if (!formData.teamworkFeelings.trim()) newErrors.teamworkFeelings = 'Teamwork feelings are required'
    if (!formData.futureGoals.trim()) newErrors.futureGoals = 'Future goals are required'
    if (formData.skills.length === 0) newErrors.skills = 'Please select at least one skill'
    if (!formData.hobbies.trim()) newErrors.hobbies = 'Hobbies are required'
    if (!formData.availabilityDays) newErrors.availabilityDays = 'Availability days are required'
    if (!formData.availabilityHours) newErrors.availabilityHours = 'Availability hours are required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: string, value: string | boolean | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleSkillToggle = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }))
    
    if (errors.skills) {
      setErrors(prev => ({ ...prev, skills: '' }))
    }
  }

  const handleProfilePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setFormData(prev => ({
          ...prev,
          profilePhoto: file,
          profilePhotoPreview: e.target?.result as string
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const removeProfilePhoto = () => {
    setFormData(prev => ({
      ...prev,
      profilePhoto: null,
      profilePhotoPreview: ''
    }))
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const nextStep = () => {
    if (validateStep1()) {
      setStep(2)
    }
  }

  const prevStep = () => {
    setStep(1)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setGeneralError('')
    
    if (!validateStep2()) return

    setLoading(true)

    try {
      const submitData = new FormData()
      
      // Personal details
      submitData.append('name', formData.name)
      submitData.append('email', formData.email)
      submitData.append('phone', formData.phone)
      submitData.append('gender', formData.gender)
      submitData.append('dateOfBirth', formData.dateOfBirth)
      submitData.append('country', formData.country)
      submitData.append('city', formData.city)
      submitData.append('password', formData.password)
      
      // Profile photo
      if (formData.profilePhoto) {
        submitData.append('profilePhoto', formData.profilePhoto)
      }
      
      // Research & motivation details
      submitData.append('motivation', formData.motivation)
      submitData.append('fieldCategory', formData.fieldCategory === 'Other' ? formData.otherFieldCategory : formData.fieldCategory)
      submitData.append('hasExperience', formData.hasExperience.toString())
      submitData.append('experienceDescription', formData.experienceDescription)
      submitData.append('teamworkFeelings', formData.teamworkFeelings)
      submitData.append('futureGoals', formData.futureGoals)
      submitData.append('skills', JSON.stringify(formData.skills))
      submitData.append('otherSkills', formData.otherSkills)
      submitData.append('hobbies', formData.hobbies)
      submitData.append('availabilityDays', formData.availabilityDays)
      submitData.append('availabilityHours', formData.availabilityHours)
      submitData.append('linkedin', formData.linkedin)
      submitData.append('github', formData.github)

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        body: submitData,
      })

      if (response.ok) {
        window.location.href = '/login?message=Registration successful! Please wait for admin approval.'
      } else {
        const data = await response.json()
        setGeneralError(data.error || 'Registration failed')
      }
    } catch (error) {
      setGeneralError('An error occurred during registration')
    } finally {
      setLoading(false)
    }
  }

  const getFieldValidation = (fieldName: string) => {
    const hasError = errors[fieldName]
    const hasValue = formData[fieldName as keyof typeof formData]
    
    if (hasError) return 'border-red-500 shadow-red-500/50'
    if (hasValue && typeof hasValue === 'string' && hasValue.trim()) return 'border-green-500 shadow-green-500/50'
    return 'border-gray-600'
  }

  return (
    <div className="min-h-screen bg-black flex flex-col relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse delay-3000"></div>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex items-center justify-center px-4 py-12 relative z-10">
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gray-900">
          <motion.div 
            className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg shadow-blue-500/50"
            initial={{ width: '50%' }}
            animate={{ width: step === 1 ? '50%' : '100%' }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
          />
        </div>

        <Card className="w-full max-w-4xl bg-black/40 backdrop-blur-xl border-gray-700 text-white relative z-10 shadow-2xl">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
              Join Arive Lab
            </h1>
            <p className="text-gray-300 text-lg">Create your account and start innovating</p>
          </div>

          {/* Step indicators */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-4">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                step === 1 
                  ? 'border-blue-500 bg-blue-500/20 text-blue-400 shadow-lg shadow-blue-500/50' 
                  : 'border-green-500 bg-green-500/20 text-green-400'
              }`}>
                {step === 1 ? '1' : <Check className="w-5 h-5" />}
              </div>
              <div className={`w-20 h-0.5 transition-all duration-300 ${
                step === 1 ? 'bg-gray-600' : 'bg-green-500'
              }`}></div>
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                step === 2 
                  ? 'border-blue-500 bg-blue-500/20 text-blue-400 shadow-lg shadow-blue-500/50' 
                  : 'border-gray-600 text-gray-400'
              }`}>
                2
              </div>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: step === 1 ? -50 : 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: step === 1 ? 50 : -50 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              className="min-h-[500px]"
            >
              {step === 1 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-gray-300">Full Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className={`bg-black/40 backdrop-blur-sm border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:shadow-blue-500/50 transition-all duration-300 ${getFieldValidation('name')}`}
                        placeholder="Enter your full name"
                      />
                      {errors.name && <p className="text-red-400 text-sm flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.name}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-gray-300">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className={`bg-black/40 backdrop-blur-sm border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:shadow-blue-500/50 transition-all duration-300 ${getFieldValidation('email')}`}
                        placeholder="Enter your email"
                      />
                      {errors.email && <p className="text-red-400 text-sm flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.email}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-gray-300">Phone Number *</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className={`bg-black/40 backdrop-blur-sm border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:shadow-blue-500/50 transition-all duration-300 ${getFieldValidation('phone')}`}
                        placeholder="Enter your phone number"
                      />
                      {errors.phone && <p className="text-red-400 text-sm flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.phone}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="gender" className="text-gray-300">Gender *</Label>
                      <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                        <SelectTrigger className={`bg-black/40 backdrop-blur-sm border-gray-600 text-white focus:border-blue-500 focus:shadow-blue-500/50 transition-all duration-300 ${getFieldValidation('gender')}`}>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent className="bg-black/90 backdrop-blur-sm border-gray-600 text-white">
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                          <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.gender && <p className="text-red-400 text-sm flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.gender}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dateOfBirth" className="text-gray-300">Date of Birth *</Label>
                      <Input
                        id="dateOfBirth"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                        className={`bg-black/40 backdrop-blur-sm border-gray-600 text-white focus:border-blue-500 focus:shadow-blue-500/50 transition-all duration-300 ${getFieldValidation('dateOfBirth')}`}
                      />
                      {errors.dateOfBirth && <p className="text-red-400 text-sm flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.dateOfBirth}</p>}
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="country" className="text-gray-300">Country *</Label>
                      <Input
                        id="country"
                        value={formData.country}
                        onChange={(e) => handleInputChange('country', e.target.value)}
                        className={`bg-black/40 backdrop-blur-sm border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:shadow-blue-500/50 transition-all duration-300 ${getFieldValidation('country')}`}
                        placeholder="Enter your country"
                      />
                      {errors.country && <p className="text-red-400 text-sm flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.country}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="city" className="text-gray-300">City *</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        className={`bg-black/40 backdrop-blur-sm border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:shadow-blue-500/50 transition-all duration-300 ${getFieldValidation('city')}`}
                        placeholder="Enter your city"
                      />
                      {errors.city && <p className="text-red-400 text-sm flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.city}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="profilePhoto" className="text-gray-300">Profile Photo</Label>
                      <div className="flex items-center space-x-4">
                        <div className="flex-1">
                          <Input
                            id="profilePhoto"
                            type="file"
                            accept="image/*"
                            onChange={handleProfilePhotoChange}
                            ref={fileInputRef}
                            className="bg-black/40 backdrop-blur-sm border-gray-600 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                          />
                        </div>
                        {formData.profilePhotoPreview && (
                          <div className="relative">
                            <img
                              src={formData.profilePhotoPreview}
                              alt="Profile preview"
                              className="w-16 h-16 rounded-full object-cover border-2 border-blue-500"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={removeProfilePhoto}
                              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 hover:bg-red-600 text-white p-0"
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-gray-300">Password *</Label>
                      <Input
                        id="password"
                        type="password"
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        className={`bg-black/40 backdrop-blur-sm border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:shadow-blue-500/50 transition-all duration-300 ${getFieldValidation('password')}`}
                        placeholder="Create a password"
                      />
                      {errors.password && <p className="text-red-400 text-sm flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.password}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="text-gray-300">Confirm Password *</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                        className={`bg-black/40 backdrop-blur-sm border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:shadow-blue-500/50 transition-all duration-300 ${getFieldValidation('confirmPassword')}`}
                        placeholder="Confirm your password"
                      />
                      {errors.confirmPassword && <p className="text-red-400 text-sm flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.confirmPassword}</p>}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="motivation" className="text-gray-300">Why do you want to join Arive Lab? *</Label>
                      <Textarea
                        id="motivation"
                        value={formData.motivation}
                        onChange={(e) => handleInputChange('motivation', e.target.value)}
                        className={`bg-black/40 backdrop-blur-sm border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:shadow-blue-500/50 transition-all duration-300 min-h-[100px] ${getFieldValidation('motivation')}`}
                        placeholder="Tell us why you want to join Arive Lab..."
                      />
                      {errors.motivation && <p className="text-red-400 text-sm flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.motivation}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="fieldCategory" className="text-gray-300">Field Category *</Label>
                      <Select value={formData.fieldCategory} onValueChange={(value) => handleInputChange('fieldCategory', value)}>
                        <SelectTrigger className={`bg-black/40 backdrop-blur-sm border-gray-600 text-white focus:border-blue-500 focus:shadow-blue-500/50 transition-all duration-300 ${getFieldValidation('fieldCategory')}`}>
                          <SelectValue placeholder="Select your field category" />
                        </SelectTrigger>
                        <SelectContent className="bg-black/90 backdrop-blur-sm border-gray-600 text-white">
                          <SelectItem value="Computer Science">Computer Science</SelectItem>
                          <SelectItem value="Automotive Engineering">Automotive Engineering</SelectItem>
                          <SelectItem value="Electrical Engineering">Electrical Engineering</SelectItem>
                          <SelectItem value="Mechanical Engineering">Mechanical Engineering</SelectItem>
                          <SelectItem value="Data Science">Data Science</SelectItem>
                          <SelectItem value="Artificial Intelligence">Artificial Intelligence</SelectItem>
                          <SelectItem value="Robotics">Robotics</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      {formData.fieldCategory === 'Other' && (
                        <Input
                          value={formData.otherFieldCategory}
                          onChange={(e) => handleInputChange('otherFieldCategory', e.target.value)}
                          className="bg-black/40 backdrop-blur-sm border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:shadow-blue-500/50 transition-all duration-300"
                          placeholder="Specify your field category"
                        />
                      )}
                      {errors.fieldCategory && <p className="text-red-400 text-sm flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.fieldCategory}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-300">Do you have any experience? *</Label>
                      <div className="flex items-center space-x-4">
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <Checkbox
                            checked={formData.hasExperience}
                            onCheckedChange={(checked) => handleInputChange('hasExperience', checked as boolean)}
                            className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                          />
                          <span className="text-white">Yes</span>
                        </label>
                      </div>
                      {formData.hasExperience && (
                        <Textarea
                          value={formData.experienceDescription}
                          onChange={(e) => handleInputChange('experienceDescription', e.target.value)}
                          className={`bg-black/40 backdrop-blur-sm border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:shadow-blue-500/50 transition-all duration-300 min-h-[80px] ${getFieldValidation('experienceDescription')}`}
                          placeholder="Describe your experience..."
                        />
                      )}
                      {errors.experienceDescription && <p className="text-red-400 text-sm flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.experienceDescription}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="teamworkFeelings" className="text-gray-300">How do you feel about teamwork? *</Label>
                      <Textarea
                        id="teamworkFeelings"
                        value={formData.teamworkFeelings}
                        onChange={(e) => handleInputChange('teamworkFeelings', e.target.value)}
                        className={`bg-black/40 backdrop-blur-sm border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:shadow-blue-500/50 transition-all duration-300 min-h-[80px] ${getFieldValidation('teamworkFeelings')}`}
                        placeholder="Share your thoughts on teamwork..."
                      />
                      {errors.teamworkFeelings && <p className="text-red-400 text-sm flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.teamworkFeelings}</p>}
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="futureGoals" className="text-gray-300">What do you want to be in the future? *</Label>
                      <Textarea
                        id="futureGoals"
                        value={formData.futureGoals}
                        onChange={(e) => handleInputChange('futureGoals', e.target.value)}
                        className={`bg-black/40 backdrop-blur-sm border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:shadow-blue-500/50 transition-all duration-300 min-h-[80px] ${getFieldValidation('futureGoals')}`}
                        placeholder="Describe your future goals..."
                      />
                      {errors.futureGoals && <p className="text-red-400 text-sm flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.futureGoals}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-300">Skills *</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {skillsOptions.map((skill) => (
                          <label key={skill} className="flex items-center space-x-2 cursor-pointer">
                            <Checkbox
                              checked={formData.skills.includes(skill)}
                              onCheckedChange={() => handleSkillToggle(skill)}
                              className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                            />
                            <span className="text-white text-sm">{skill}</span>
                          </label>
                        ))}
                      </div>
                      {errors.skills && <p className="text-red-400 text-sm flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.skills}</p>}
                      <div className="flex flex-wrap gap-2 mt-2">
                        {formData.skills.map((skill) => (
                          <Badge key={skill} variant="secondary" className="bg-blue-600/20 text-blue-400 border-blue-600">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                      <Input
                        value={formData.otherSkills}
                        onChange={(e) => handleInputChange('otherSkills', e.target.value)}
                        className="bg-black/40 backdrop-blur-sm border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:shadow-blue-500/50 transition-all duration-300"
                        placeholder="Other skills (comma separated)"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="hobbies" className="text-gray-300">Your Hobbies *</Label>
                      <Textarea
                        id="hobbies"
                        value={formData.hobbies}
                        onChange={(e) => handleInputChange('hobbies', e.target.value)}
                        className={`bg-black/40 backdrop-blur-sm border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:shadow-blue-500/50 transition-all duration-300 min-h-[80px] ${getFieldValidation('hobbies')}`}
                        placeholder="Tell us about your hobbies..."
                      />
                      {errors.hobbies && <p className="text-red-400 text-sm flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.hobbies}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="availabilityDays" className="text-gray-300">Availability (Days/Week) *</Label>
                        <Input
                          id="availabilityDays"
                          type="number"
                          min="1"
                          max="7"
                          value={formData.availabilityDays}
                          onChange={(e) => handleInputChange('availabilityDays', e.target.value)}
                          className={`bg-black/40 backdrop-blur-sm border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:shadow-blue-500/50 transition-all duration-300 ${getFieldValidation('availabilityDays')}`}
                          placeholder="Days per week"
                        />
                        {errors.availabilityDays && <p className="text-red-400 text-sm flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.availabilityDays}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="availabilityHours" className="text-gray-300">Availability (Hours/Week) *</Label>
                        <Input
                          id="availabilityHours"
                          type="number"
                          min="1"
                          max="168"
                          value={formData.availabilityHours}
                          onChange={(e) => handleInputChange('availabilityHours', e.target.value)}
                          className={`bg-black/40 backdrop-blur-sm border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:shadow-blue-500/50 transition-all duration-300 ${getFieldValidation('availabilityHours')}`}
                          placeholder="Hours per week"
                        />
                        {errors.availabilityHours && <p className="text-red-400 text-sm flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.availabilityHours}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="linkedin" className="text-gray-300">LinkedIn Profile</Label>
                        <Input
                          id="linkedin"
                          value={formData.linkedin}
                          onChange={(e) => handleInputChange('linkedin', e.target.value)}
                          className="bg-black/40 backdrop-blur-sm border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:shadow-blue-500/50 transition-all duration-300"
                          placeholder="LinkedIn URL (optional)"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="github" className="text-gray-300">GitHub Profile</Label>
                        <Input
                          id="github"
                          value={formData.github}
                          onChange={(e) => handleInputChange('github', e.target.value)}
                          className="bg-black/40 backdrop-blur-sm border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:shadow-blue-500/50 transition-all duration-300"
                          placeholder="GitHub URL (optional)"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {generalError && (
            <div className="mt-6 p-4 bg-red-500/20 border border-red-500 rounded-lg">
              <p className="text-red-400 text-center">{generalError}</p>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={step === 1}
              className="bg-transparent border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </Button>

            <div className="flex space-x-4">
              {step === 1 ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold px-8 py-3 rounded-full shadow-lg shadow-blue-500/50 hover:shadow-blue-500/70 transition-all duration-300"
                >
                  Next Step
                </Button>
              ) : (
                <Button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold px-8 py-3 rounded-full shadow-lg shadow-green-500/50 hover:shadow-green-500/70 transition-all duration-300"
                >
                  {loading ? 'Creating Account...' : 'Complete Registration'}
                </Button>
              )}
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Already have an account?{' '}
              <Link href="/login" className="text-blue-400 hover:text-blue-300 transition-colors">
                Sign in here
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
      </div>
      
      {/* Footer */}
      <FooterSection />
    </div>
  )
}