"use client"
import { ADMIN_URLS } from '@/constants/apiUrls';
import { getSubscriptionDetails, updateSubscriptionPlan } from '@/services/admin-services';
import { ChevronDown } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';

const SubscriptionPlans = () => {
  const [activePlan, setActivePlan] = useState('');
  const [selectedPlanId, setSelectedPlanId] = useState(''); // Store the _id of the selected plan
  const [formData, setFormData] = useState({
    key: '',
    priceEuros:'',
    priceGBP:'',
    tasksPermitted:'',
    pictureUploadLimit: '',
    videoUploadLimit: '',
    jobApplicationsPerDay: '',
    jobApplicationsPerMonth: '',
    generalContact: 'Yes',
    websitePublication: 'Yes',
    profilePromotion: 'Yes',
    modelCoach: 'Yes',
    modelTrip: 'Yes',
    unlimitedShoots: 'Yes',
    regionalAccess: [],
    modelRouteProgram: 'Yes',
    freeTrialTasks: '',
    freeTrialPictures: '',
    freeTrialVideos: '',
    freeTrialJobAppsDay: '',
    freeTrialJobAppsMonth: '',
  });
  const [plans, setPlans] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [regionalAccessOptions, setRegionalAccessOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const booleanOptions = ['Yes', 'No'];

  // Fetch data from API
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        const response = await getSubscriptionDetails(`${ADMIN_URLS.GET_SUBSCRIPTIONS}`);
        if (response.status === 200) {
          const apiData = response.data.data;
          const plans = apiData.plans;
          if (plans && plans.length > 0) {
            setPlans(plans);
            // Extract languages from the first plan's name object
            const firstPlan = plans[0];
            const extractedLanguages = Object.keys(firstPlan.name);
            setLanguages(extractedLanguages);
            // Extract regional access options from API response
            setRegionalAccessOptions(apiData.regionalAccess || []);
            // Set default form data to the first plan
            if (firstPlan) {
              setActivePlan(firstPlan.name.en);
              setSelectedPlanId(firstPlan._id);
              const newFormData = {
                key: firstPlan.key || '',
                priceEuros: firstPlan.unitAmounts?.eur ? `€${(firstPlan.unitAmounts.eur / 100).toFixed(2)}` : '',
                priceGBP: firstPlan.unitAmounts?.gbp ? `£${(firstPlan.unitAmounts.gbp / 100).toFixed(2)}` : '',
                tasksPermitted: firstPlan.fullAccess.tasks?.toString() || '',
                pictureUploadLimit: firstPlan.fullAccess.pictureUploadLimit?.toString() || '',
                videoUploadLimit: firstPlan.fullAccess.videoUploadLimit?.toString() || '',
                jobApplicationsPerDay: firstPlan.fullAccess.jobApplicationsPerDay?.toString() || '',
                jobApplicationsPerMonth: firstPlan.fullAccess.jobApplicationsPerMonth?.toString() || '',
                generalContact: firstPlan.fullAccess.generalContact ? 'Yes' : 'No',
                websitePublication: firstPlan.fullAccess.websitePublication ? 'Yes' : 'No',
                profilePromotion: firstPlan.fullAccess.profilePromotion ? 'Yes' : 'No',
                modelCoach: firstPlan.fullAccess.modelCoach ? 'Yes' : 'No',
                modelTrip: firstPlan.fullAccess.modelTrip ? 'Yes' : 'No',
                unlimitedShoots: firstPlan.fullAccess.unlimitedShoots ? 'Yes' : 'No',
                regionalAccess: firstPlan.fullAccess.regionalAccess || [],
                modelRouteProgram: firstPlan.fullAccess.modelRouteProgram ? 'Yes' : 'No',
                freeTrialTasks: firstPlan.trialAccess.tasks?.toString() || '',
                freeTrialPictures: firstPlan.trialAccess.pictureUploadLimit?.toString() || '',
                freeTrialVideos: firstPlan.trialAccess.videoUploadLimit?.toString() || '',
                freeTrialJobAppsDay: firstPlan.trialAccess.jobApplicationsPerDay?.toString() || '',
                freeTrialJobAppsMonth: firstPlan.trialAccess.jobApplicationsPerMonth?.toString() || '',
              };
              // Dynamically add name and description fields for each language
              extractedLanguages.forEach((lang) => {
                newFormData[`planName${lang.charAt(0).toUpperCase() + lang.slice(1)}`] = firstPlan.name[lang] || '';
                newFormData[`description${lang.charAt(0).toUpperCase() + lang.slice(1)}`] = firstPlan.description[lang] || '';
              });
              setFormData(newFormData);
            }
          } else {
            throw new Error('No plans found in API response');
          }
        } else {
          throw new Error(response.data.message || 'Invalid API response');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegionalAccessChange = (region) => {
    setFormData((prev) => {
      const currentRegions = prev.regionalAccess || [];
      if (currentRegions.includes(region)) {
        return { ...prev, regionalAccess: currentRegions.filter((r) => r !== region) };
      } else {
        return { ...prev, regionalAccess: [...currentRegions, region] };
      }
    });
  };

  const handleSave = async () => {
    try {
      // Transform formData to API-compatible payload
      const payload = {
        planId: selectedPlanId,
        key: formData.key,
        name: {},
        description: {},
        unitAmounts: {
          eur: parseFloat(formData.priceEuros.replace('€', '')) * 100 || 0,
          gbp: parseFloat(formData.priceGBP.replace('£', '')) * 100 || 0,
        },
        fullAccess: {
          tasks: parseInt(formData.tasksPermitted) || 0,
          pictureUploadLimit: parseInt(formData.pictureUploadLimit) || 0,
          videoUploadLimit: parseInt(formData.videoUploadLimit) || 0,
          jobApplicationsPerDay: parseInt(formData.jobApplicationsPerDay) || 0,
          jobApplicationsPerMonth: parseInt(formData.jobApplicationsPerMonth) || 0,
          generalContact: formData.generalContact === 'Yes',
          websitePublication: formData.websitePublication === 'Yes',
          profilePromotion: formData.profilePromotion === 'Yes',
          modelCoach: formData.modelCoach === 'Yes',
          modelTrip: formData.modelTrip === 'Yes',
          unlimitedShoots: formData.unlimitedShoots === 'Yes',
          regionalAccess: formData.regionalAccess,
          modelRouteProgram: formData.modelRouteProgram === 'Yes',
        },
        trialAccess: {
          tasks: parseInt(formData.freeTrialTasks) || 0,
          pictureUploadLimit: parseInt(formData.freeTrialPictures) || 0,
          videoUploadLimit: parseInt(formData.freeTrialVideos) || 0,
          jobApplicationsPerDay: parseInt(formData.freeTrialJobAppsDay) || 0,
          jobApplicationsPerMonth: parseInt(formData.freeTrialJobAppsMonth) || 0,
        },
      };

      // Add dynamic language fields to name and description
      languages.forEach((lang) => {
        payload.name[lang] = formData[`planName${lang.charAt(0).toUpperCase() + lang.slice(1)}`] || '';
        payload.description[lang] = formData[`description${lang.charAt(0).toUpperCase() + lang.slice(1)}`] || '';
      });

      console.log('Saving subscription details:', payload);

      const response = await updateSubscriptionPlan(`${ADMIN_URLS.UPDATE_SUBSCRIPTION_PLAN}`, payload);
      if (response.status === 200) {
        toast.success('Subscription plan updated successfully!');
      } else {
        throw new Error(response.data.message || 'Failed to update subscription plan');
      }
    } catch (err) {
      console.error('Error saving subscription:', err);
      alert(`Error: ${err.message}`);
    }
  };

  if (loading) {
    return <div className="text-gray-200 text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">Error: {error}</div>;
  }

  return (
    <div className="w-full mx-auto p-4 flex flex-col gap-8">
      <div className="w-full flex justify-center rounded-lg">
        <div className="p-[3px] bg-zinc-900 rounded-full inline-flex justify-center items-center gap-2.5">
          {plans.map((plan) => (
            <div
              key={plan.name.en}
              className={`p-2.5 rounded-full flex justify-center items-center gap-2.5 cursor-pointer ${
                activePlan === plan.name.en ? 'bg-rose-500' : ''
              } ${plan.name.en === 'Rising Star Plan' ? 'w-32' : 'w-40'}`}
              onClick={() => {
                setActivePlan(plan.name.en);
                setSelectedPlanId(plan._id);
                const newFormData = {
                  key: plan.key || '',
                  priceEuros: plan.unitAmounts?.eur ? `€${(plan.unitAmounts.eur / 100).toFixed(2)}` : '',
                  priceGBP: plan.unitAmounts?.gbp ? `£${(plan.unitAmounts.gbp / 100).toFixed(2)}` : '',
                  tasksPermitted: plan.fullAccess.tasks?.toString() || '',
                  pictureUploadLimit: plan.fullAccess.pictureUploadLimit?.toString() || '',
                  videoUploadLimit: plan.fullAccess.videoUploadLimit?.toString() || '',
                  jobApplicationsPerDay: plan.fullAccess.jobApplicationsPerDay?.toString() || '',
                  jobApplicationsPerMonth: plan.fullAccess.jobApplicationsPerMonth?.toString() || '',
                  generalContact: plan.fullAccess.generalContact ? 'Yes' : 'No',
                  websitePublication: plan.fullAccess.websitePublication ? 'Yes' : 'No',
                  profilePromotion: plan.fullAccess.profilePromotion ? 'Yes' : 'No',
                  modelCoach: plan.fullAccess.modelCoach ? 'Yes' : 'No',
                  modelTrip: plan.fullAccess.modelTrip ? 'Yes' : 'No',
                  unlimitedShoots: plan.fullAccess.unlimitedShoots ? 'Yes' : 'No',
                  regionalAccess: plan.fullAccess.regionalAccess || [],
                  modelRouteProgram: plan.fullAccess.modelRouteProgram ? 'Yes' : 'No',
                  freeTrialTasks: plan.trialAccess.tasks?.toString() || '',
                  freeTrialPictures: plan.trialAccess.pictureUploadLimit?.toString() || '',
                  freeTrialVideos: plan.trialAccess.videoUploadLimit?.toString() || '',
                  freeTrialJobAppsDay: plan.trialAccess.jobApplicationsPerDay?.toString() || '',
                  freeTrialJobAppsMonth: plan.trialAccess.jobApplicationsPerMonth?.toString() || '',
                };
                languages.forEach((lang) => {
                  newFormData[`planName${lang.charAt(0).toUpperCase() + lang.slice(1)}`] = plan.name[lang] || '';
                  newFormData[`description${lang.charAt(0).toUpperCase() + lang.slice(1)}`] = plan.description[lang] || '';
                });
                setFormData(newFormData);
              }}
            >
              <div
                className={`text-center ${
                  activePlan === plan.name.en ? 'text-white' : 'text-gray-200'
                } text-xs font-normal font-['Kodchasan'] ${plan.name.en === 'New Face Plan' ? 'w-28' : ''}`}
              >
                {plan.name.en}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <label className="text-gray-200 text-xs font-light">Key</label>
          <input
            type="text"
            name="key"
            value={formData.key}
            onChange={handleInputChange}
            className="w-full p-4 bg-zinc-900/80 border border-zinc-700 rounded-lg text-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
            placeholder="Enter key"
          />
        </div>
        <div className="flex flex-col gap-4">
          <h2 className="text-gray-200 text-lg font-semibold">Plan Details</h2>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-gray-200 text-xs font-light">Name of Plan</label>
              {languages.map((lang) => (
                <div key={lang} className="flex items-center gap-2.5">
                  <div className="w-full bg-zinc-900/80 border border-zinc-700 rounded-lg flex items-center gap-2.5">
                    <div className="w-24 h-12 px-4 bg-neutral-700/80 border border-zinc-700 rounded-lg flex items-center justify-center">
                      <span className="text-gray-400 text-sm font-light font-['Kodchasan']">
                        {lang.toUpperCase()}
                      </span>
                    </div>
                    <input
                      type="text"
                      name={`planName${lang.charAt(0).toUpperCase() + lang.slice(1)}`}
                      value={formData[`planName${lang.charAt(0).toUpperCase() + lang.slice(1)}`]}
                      onChange={handleInputChange}
                      className="flex-1 pr-4 py-4 bg-transparent text-gray-400 text-sm font-light font-['Kodchasan'] focus:outline-none"
                      placeholder={`Enter plan name in ${lang.toUpperCase()}`}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-gray-200 text-xs font-light">Price In Euros</label>
                <input
                  type="text"
                  name="priceEuros"
                  value={formData.priceEuros}
                  onChange={handleInputChange}
                  className="w-full p-4 bg-zinc-900/80 border border-zinc-700 rounded-lg text-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                  placeholder="Enter price in Euros"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-gray-200 text-xs font-light">Price In GBP</label>
                <input
                  type="text"
                  name="priceGBP"
                  value={formData.priceGBP}
                  onChange={handleInputChange}
                  className="w-full p-4 bg-zinc-900/80 border border-zinc-700 rounded-lg text-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                  placeholder="Enter price in GBP"
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-gray-200 text-xs font-light">Description</label>
              {languages.map((lang) => (
                <div key={lang} className="flex items-start gap-2.5">
                  <div className="w-full bg-zinc-900/80 border border-zinc-700 rounded-lg flex items-start gap-2.5">
                    <div className="w-24 h-12 px-4 bg-neutral-700/80 border border-zinc-700 rounded-lg flex items-center justify-center">
                      <span className="text-gray-400 text-sm font-light font-['Kodchasan']">
                        {lang.toUpperCase()}
                      </span>
                    </div>
                    <textarea
                      name={`description${lang.charAt(0).toUpperCase() + lang.slice(1)}`}
                      value={formData[`description${lang.charAt(0).toUpperCase() + lang.slice(1)}`]}
                      onChange={handleInputChange}
                      className="flex-1 pr-4 py-4 bg-transparent text-gray-400 text-sm font-light font-['Kodchasan'] focus:outline-none h-32"
                      placeholder={`Enter description in ${lang.toUpperCase()}`}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: 'Tasks Permitted', name: 'tasksPermitted', type: 'text' },
                { label: 'Picture Upload Limit', name: 'pictureUploadLimit', type: 'text' },
                { label: 'Video Upload Limit', name: 'videoUploadLimit', type: 'text' },
                { label: 'Job Applications Per Day', name: 'jobApplicationsPerDay', type: 'text' },
                { label: 'Job Applications Per Month', name: 'jobApplicationsPerMonth', type: 'text' },
                { label: 'General Contact', name: 'generalContact', type: 'select' },
                { label: 'Website Publication', name: 'websitePublication', type: 'select' },
                { label: 'Profile Promotion', name: 'profilePromotion', type: 'select' },
                { label: 'Model Coach', name: 'modelCoach', type: 'select' },
               
                { label: 'Unlimited Shoots', name: 'unlimitedShoots', type: 'select' },
                { label: 'Model Route Program', name: 'modelRouteProgram', type: 'select' },
              ].map(({ label, name, type }) => (
                <div key={name} className="flex flex-col gap-2">
                  <label className="text-gray-200 text-xs font-light">{label}</label>
                  {type === 'select' ? (
                    <div className="relative">
                      <select
                        name={name}
                        value={formData[name]}
                        onChange={handleInputChange}
                        className="w-full p-4 bg-zinc-900/80 border border-zinc-700 rounded-lg text-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 appearance-none"
                      >
                        {booleanOptions.map((option) => (
                          <option key={option} value={option} className="text-gray-400">
                            {option}
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 rotate-90 opacity-50">
                        <div className='rotate-270 '> < ChevronDown className='w-5' /> </div>
                      </div>
                    </div>
                  ) : (
                    <input
                      type="text"
                      name={name}
                      value={formData[name]}
                      onChange={handleInputChange}
                      className="w-full p-4 bg-zinc-900/80 border border-zinc-700 rounded-lg text-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                      placeholder={`Enter ${label.toLowerCase()}`}
                    />
                  )}
                </div>
              ))}
              <div className="flex flex-col gap-2">
                <label className="text-gray-200 text-xs font-light">Regional Access</label>
                <div className="w-full p-4 bg-zinc-900/80 border border-zinc-700 rounded-lg flex flex-wrap gap-2">
                  {formData.regionalAccess.map((region) => (
                    <div
                      key={region}
                      className="px-1.5 py-[3px] bg-zinc-800 rounded-sm flex justify-center items-center gap-2"
                    >
                      <span className="text-gray-400 text-xs font-light font-['Kodchasan']">{region}</span>
                      <button
                        onClick={() => handleRegionalAccessChange(region)}
                        className="w-3 h-3 flex items-center justify-center"
                      >
                        <div className="w-1.5 h-1.5 border border-stone-200 rounded-full" />
                      </button>
                    </div>
                  ))}
                  <select
                    onChange={(e) => handleRegionalAccessChange(e.target.value)}
                    value=""
                    className="bg-transparent text-gray-400 text-sm font-light font-['Kodchasan'] focus:outline-none"
                  >
                    <option value="" disabled>
                      Select region
                    </option>
                    {regionalAccessOptions
                      .filter((option) => !formData.regionalAccess.includes(option))
                      .map((option) => (
                        <option key={option} value={option} className="text-gray-400">
                          {option}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Free Trial Details */}
        <div className="flex flex-col gap-4">
            <h2 className="text-gray-200 text-lg font-semibold">Free Trial Details</h2>
            <div className="flex flex-col gap-4">
              {[
                { label: 'Tasks Permitted', name: 'freeTrialTasks' },
                { label: 'Picture Upload Limit', name: 'freeTrialPictures' },
                { label: 'Video Upload Limit', name: 'freeTrialVideos' },
              ].map(({ label, name }) => (
                <div key={name} className="flex flex-col gap-2">
                  <label className="text-gray-200 text-xs font-light">{label}</label>
                  <input
                    type="text"
                    name={name}
                    value={formData[name]}
                    onChange={handleInputChange}
                    className="w-full p-4 bg-zinc-900/80 border border-zinc-700 rounded-lg text-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                    placeholder={`Enter ${label.toLowerCase()}`}
                  />
                </div>
              ))}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: 'Job Applications Per Day', name: 'freeTrialJobAppsDay' },
                  { label: 'Job Applications Per Month', name: 'freeTrialJobAppsMonth' },
                ].map(({ label, name }) => (
                  <div key={name} className="flex flex-col gap-2">
                    <label className="text-gray-200 text-xs font-light">{label}</label>
                    <input
                      type="text"
                      name={name}
                      value={formData[name]}
                      onChange={handleInputChange}
                      className="w-full p-4 bg-zinc-900/80 border border-zinc-700 rounded-lg text-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                      placeholder={`Enter ${label.toLowerCase()}`}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>


          {/* Save Button */}
          <button
            onClick={handleSave}
            className="w-full px-5 py-4 bg-rose-500 text-white rounded-lg text-sm font-semibold hover:bg-rose-600 transition-colors duration-200"
          >
            Save Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlans;