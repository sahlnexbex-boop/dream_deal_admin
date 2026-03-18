import { Info } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { getNotifications, getProfileSummary } from '../../api/dashboard'
import { notificationsKey, profileSummaryKey } from '../../api/queryKeys'
import { useState, useEffect } from 'react'
import { EncryptData } from '../../hooks/crypto'
import { OLD_PORTAL_URL } from '../../utils/oldPortal'

export default function AlertBanners() {
  const { data: notificationsData, isLoading, error } = useQuery({
    queryKey: notificationsKey(),
    queryFn: getNotifications,
    retry: 1,
    staleTime: 5 * 60 * 1000,
    // enabled: false,
  })

  const [visibleNotifications, setVisibleNotifications] = useState<any[]>([])

  const { data: profileData } = useQuery({
    queryKey: profileSummaryKey(),
    queryFn: getProfileSummary,
    staleTime: 5 * 60 * 1000,
  })

  useEffect(() => {
    if (notificationsData && Array.isArray(notificationsData)) {
      const kycStatus = profileData?.personal_details?.kyc_status?.toLowerCase() || '';

      const filtered = notificationsData.filter((notif) => {
        // Comment out agreement pending alert box
        if (notif.type.toLowerCase() === 'agreement') {
          return false;
        }

        // kyc_status: "Not Submitted" then only show kyc alertbox
        if (notif.type.toLowerCase() === 'kyc') {
          return kycStatus === 'not submitted' || kycStatus === 'not_submitted';
        }

        return true;
      });

      setVisibleNotifications(filtered)
    }
  }, [notificationsData, profileData])

  const handleAction = (type: string) => {
    const userId = localStorage.getItem("user_id") || "";
    const encryptedUserId = userId ? EncryptData(userId) : "";
    const schemeId = localStorage.getItem("scheme_id") || "";

    if (type.toLowerCase() === 'kyc') {
      window.location.href = `${OLD_PORTAL_URL}/go-to?user_id=${encryptedUserId}&url=/kyc&current_scheme_id=${schemeId}`;
    }
  }

  useEffect(() => {
    console.log('Notifications Data:', notificationsData)
    console.log('Visible Notifications:', visibleNotifications)
    console.log('Is Loading:', isLoading)
    console.log('Error:', error)
  }, [notificationsData, visibleNotifications, isLoading, error])

  const getNotificationStyle = (type: string) => {
    switch (type.toLowerCase()) {
      case 'agreement':
        return {
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          iconBg: 'bg-red-500',
          titleColor: 'text-red-700',
          messageColor: 'text-red-600',
          badgeBg: 'bg-red-50/40',
          buttonColor: 'bg-red-500 hover:bg-red-600',
        }
      case 'kyc':
        return {
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          iconBg: 'bg-yellow-500',
          titleColor: 'text-yellow-700',
          messageColor: 'text-yellow-600',
          badgeBg: 'bg-yellow-50/40',
          buttonColor: 'bg-yellow-500 hover:bg-yellow-600',
        }
      default:
        return {
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          iconBg: 'bg-blue-500',
          titleColor: 'text-blue-700',
          messageColor: 'text-blue-600',
          badgeBg: 'bg-blue-50/40',
          buttonColor: 'bg-blue-500 hover:bg-blue-600',
        }
    }
  }

  if (isLoading) {
    return null
  }

  if (visibleNotifications.length === 0) {
    return null
  }

  return (
    <div>
      {/* Alert Banners */}
      <div className="space-y-3">
        {visibleNotifications.map((notification) => {
          const style = getNotificationStyle(notification.type)

          return (
            <div
              key={notification.notification_id}
              className={`${style.bgColor} border ${style.borderColor} rounded-xl px-4 py-2 flex items-center justify-between gap-4 flex-col sm:flex-row animate-in fade-in slide-in-from-top-2 duration-300 transition-all`}
            >
              <div className="flex items-start gap-3 flex-1">
                <div className={`${style.iconBg} rounded-full p-1.5 mt-0.5 shrink-0`}>
                  <Info size={16} className="text-white" />
                </div>
                <div className="flex-1">
                  <h4 className={`font-semibold ${style.titleColor} text-sm`}>
                    {notification.title}
                  </h4>
                  <p className={`${style.messageColor} text-xs leading-relaxed`}>
                    {notification.message}
                  </p>
                </div>
              </div>
              <div className="w-full flex justify-end sm:w-auto">
                <button
                  onClick={() => handleAction(notification.type)}
                  className={`${style.buttonColor} text-white font-medium text-xs px-4 py-2 rounded-lg transition-colors whitespace-nowrap focus:outline-none`}
                >
                  {notification.action_type === 'verify_agreement'
                    ? 'Verify Agreement'
                    : 'Verify Now'}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
